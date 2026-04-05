import { db, conversations, messages, curationSignals } from "@wispr/feedback-api";
import { desc, eq, sql } from "drizzle-orm";

export async function GET() {
  const rows = db
    .select({
      id: conversations.id,
      sessionId: conversations.sessionId,
      createdAt: conversations.createdAt,
      messageCount: sql<number>`count(${messages.id})`,
    })
    .from(conversations)
    .leftJoin(messages, eq(messages.conversationId, conversations.id))
    .groupBy(conversations.id)
    .orderBy(desc(conversations.createdAt))
    .limit(50)
    .all();

  // Attach first user message as preview + curation counts
  const result = rows.map((row) => {
    const firstMsg = db
      .select({ content: messages.content, role: messages.role })
      .from(messages)
      .where(eq(messages.conversationId, row.id))
      .orderBy(messages.createdAt)
      .limit(1)
      .all()[0];

    const curations = db
      .select({
        verdict: curationSignals.verdict,
        count: sql<number>`count(*)`,
      })
      .from(curationSignals)
      .where(eq(curationSignals.conversationId, row.id))
      .groupBy(curationSignals.verdict)
      .all();

    const goodCount = curations.find((c) => c.verdict === "good")?.count ?? 0;
    const badCount = curations.find((c) => c.verdict === "bad")?.count ?? 0;

    return {
      ...row,
      preview: firstMsg?.content ?? "",
      goodCount,
      badCount,
    };
  });

  return Response.json(result);
}
