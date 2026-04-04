import { db, messages, curationSignals, blueprints, blueprintComponents } from "@wispr/feedback-api";
import { eq } from "drizzle-orm";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const msgs = db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(messages.createdAt)
    .all();

  const curations = db
    .select()
    .from(curationSignals)
    .where(eq(curationSignals.conversationId, id))
    .orderBy(curationSignals.createdAt)
    .all();

  const blueprint = db
    .select()
    .from(blueprints)
    .where(eq(blueprints.conversationId, id))
    .limit(1)
    .all()[0] ?? null;

  const components = blueprint
    ? db
        .select()
        .from(blueprintComponents)
        .where(eq(blueprintComponents.blueprintId, blueprint.id))
        .orderBy(blueprintComponents.position)
        .all()
    : [];

  return Response.json({ messages: msgs, curations, blueprint, components });
}
