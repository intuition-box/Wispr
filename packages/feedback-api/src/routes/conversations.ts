import { Hono } from "hono";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "../db";
import {
  sessions,
  conversations,
  messages,
  blueprints,
  blueprintComponents,
  curationSignals,
} from "../db/schema";

const conv = new Hono();

// ── POST /conversations/sessions ─────────────────────────────────────────────
// Upsert a session.
// Body: { id, walletAddress?, profileRole?, profileLevel? }
conv.post("/sessions", async (c) => {
  const body = await c.req.json();
  const { id, walletAddress, profileRole, profileLevel } = body;

  if (!id) return c.json({ error: "id is required" }, 400);

  db.insert(sessions)
    .values({ id, walletAddress, profileRole, profileLevel })
    .onConflictDoNothing()
    .run();

  return c.json({ ok: true, id });
});

// ── POST /conversations ──────────────────────────────────────────────────────
// Upsert a conversation.
// Body: { id, sessionId }
conv.post("/", async (c) => {
  const body = await c.req.json();
  const { id, sessionId } = body;

  if (!id || !sessionId) return c.json({ error: "id and sessionId are required" }, 400);

  db.insert(conversations)
    .values({ id, sessionId })
    .onConflictDoNothing()
    .run();

  return c.json({ ok: true, id });
});

// ── POST /conversations/messages ─────────────────────────────────────────────
// Save a message.
// Body: { conversationId, role, content, model?, tokensInput?, tokensOutput?, latencyMs? }
conv.post("/messages", async (c) => {
  const body = await c.req.json();
  const { conversationId, role, content, model, tokensInput, tokensOutput, latencyMs } = body;

  if (!conversationId || !role || !content) {
    return c.json({ error: "conversationId, role and content are required" }, 400);
  }

  const id = crypto.randomUUID();
  db.insert(messages)
    .values({ id, conversationId, role, content, model, tokensInput, tokensOutput, latencyMs })
    .run();

  return c.json({ ok: true, id });
});

// ── GET /conversations/:id/messages ──────────────────────────────────────────
// Check if a conversation has any messages (used to decide whether to save system prompt).
conv.get("/:id/messages", async (c) => {
  const conversationId = c.req.param("id");
  const rows = db.select().from(messages).where(eq(messages.conversationId, conversationId)).limit(1).all();
  return c.json({ count: rows.length });
});

// ── POST /conversations/blueprints ───────────────────────────────────────────
// Save a blueprint with its components.
// Body: { id, conversationId, intent, components: [{ componentId, componentType, componentName, trustScoreAtTime?, position }] }
conv.post("/blueprints", async (c) => {
  const body = await c.req.json();
  const { id, conversationId, intent, components } = body;

  if (!id || !conversationId || !intent) {
    return c.json({ error: "id, conversationId and intent are required" }, 400);
  }

  db.insert(blueprints)
    .values({ id, conversationId, intent })
    .onConflictDoNothing()
    .run();

  if (Array.isArray(components)) {
    for (const comp of components) {
      db.insert(blueprintComponents)
        .values({
          id: crypto.randomUUID(),
          blueprintId: id,
          componentId: comp.componentId,
          componentType: comp.componentType ?? "unknown",
          componentName: comp.componentName,
          trustScoreAtTime: comp.trustScoreAtTime ?? null,
          position: comp.position ?? 0,
        })
        .run();
    }
  }

  return c.json({ ok: true, id });
});

// ── GET /conversations ───────────────────────────────────────────────────────
// List recent conversations with message count, preview, and curation counts.
conv.get("/", async (c) => {
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

  return c.json(result);
});

// ── GET /conversations/:id ───────────────────────────────────────────────────
// Full conversation detail: messages, curations, blueprint + components.
conv.get("/:id", async (c) => {
  const id = c.req.param("id");

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

  return c.json({ messages: msgs, curations, blueprint, components });
});

// ── POST /conversations/:id/curate ───────────────────────────────────────────
// Submit a curation signal for a conversation.
// Body: { verdict, comment?, curatorAddress? }
conv.post("/:id/curate", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const { verdict, comment, curatorAddress } = body;

  if (!verdict || !["good", "bad"].includes(verdict)) {
    return c.json({ error: "verdict must be 'good' or 'bad'" }, 400);
  }

  db.insert(curationSignals)
    .values({
      id: crypto.randomUUID(),
      conversationId: id,
      curatorAddress: curatorAddress ?? null,
      verdict,
      comment: comment ?? null,
    })
    .run();

  return c.json({ ok: true });
});

export { conv };
