import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  sessions,
  conversations,
  messages,
  blueprints,
  blueprintComponents,
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

export { conv };
