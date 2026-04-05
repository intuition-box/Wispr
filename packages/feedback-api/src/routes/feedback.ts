import { Hono } from "hono";
import { eq, inArray, sql, and } from "drizzle-orm";
import { db } from "../db";
import { feedbackSignals, usageEvents, blueprintComponents, blueprints, conversations } from "../db/schema";

const feedback = new Hono();

// ── POST /feedback ────────────────────────────────────────────────────────────
// Submit an explicit feedback signal for a component.
//
// Body: { conversationId, componentId, blueprintId?, signalType, rating?, comment?, context? }
feedback.post("/", async (c) => {
  const body = await c.req.json();
  const { conversationId, componentId, blueprintId, signalType, rating, comment, context } = body;

  if (!conversationId || !componentId || !signalType) {
    return c.json({ error: "conversationId, componentId and signalType are required" }, 400);
  }

  const VALID_SIGNALS = ["adopted", "rejected", "thumbs_up", "thumbs_down", "error"];
  if (!VALID_SIGNALS.includes(signalType)) {
    return c.json({ error: `signalType must be one of: ${VALID_SIGNALS.join(", ")}` }, 400);
  }

  const id = crypto.randomUUID();
  db.insert(feedbackSignals).values({
    id,
    conversationId,
    componentId,
    blueprintId: blueprintId ?? null,
    signalType,
    rating: rating ?? null,
    comment: comment ?? null,
    context: context ? JSON.stringify(context) : null,
  }).run();

  return c.json({ ok: true, id });
});

// ── GET /feedback/:componentId ────────────────────────────────────────────────
// Aggregated feedback stats for a single component.
// Useful for curators assessing whether to stake/unstake.
//
// Response:
//   stats        — adoption rate, thumbs, avg rating, error rate
//   recentSignals — last 20 explicit signals
//   usageEvents  — invoked / success / error counts
feedback.get("/:componentId", async (c) => {
  const componentId = c.req.param("componentId");

  // Aggregated signal counts
  const signalRows = db
    .select({
      signalType: feedbackSignals.signalType,
      count: sql<number>`count(*)`,
      avgRating: sql<number>`avg(${feedbackSignals.rating})`,
    })
    .from(feedbackSignals)
    .where(eq(feedbackSignals.componentId, componentId))
    .groupBy(feedbackSignals.signalType)
    .all();

  const counts: Record<string, number> = {};
  let avgRating: number | null = null;
  for (const row of signalRows) {
    counts[row.signalType] = row.count;
    if (row.signalType === "thumbs_up" || row.signalType === "thumbs_down") {
      // keep going
    }
    if (row.avgRating != null) avgRating = Number(row.avgRating.toFixed(2));
  }

  const totalSignals = Object.values(counts).reduce((s, n) => s + n, 0);
  const adopted = counts["adopted"] ?? 0;
  const rejected = counts["rejected"] ?? 0;
  const adoptionBase = adopted + rejected;

  // Aggregated usage event counts
  const usageRows = db
    .select({
      eventType: usageEvents.eventType,
      count: sql<number>`count(*)`,
    })
    .from(usageEvents)
    .where(eq(usageEvents.componentId, componentId))
    .groupBy(usageEvents.eventType)
    .all();

  const usageCounts: Record<string, number> = {};
  for (const row of usageRows) usageCounts[row.eventType] = row.count;

  const invoked = usageCounts["invoked"] ?? 0;
  const errors  = usageCounts["error"] ?? 0;

  // Last 20 explicit signals
  const recentSignals = db
    .select({
      id: feedbackSignals.id,
      signalType: feedbackSignals.signalType,
      rating: feedbackSignals.rating,
      comment: feedbackSignals.comment,
      createdAt: feedbackSignals.createdAt,
    })
    .from(feedbackSignals)
    .where(eq(feedbackSignals.componentId, componentId))
    .orderBy(sql`${feedbackSignals.createdAt} desc`)
    .limit(20)
    .all();

  return c.json({
    componentId,
    stats: {
      totalSignals,
      adoptionRate: adoptionBase > 0 ? Number((adopted / adoptionBase).toFixed(2)) : null,
      thumbsUp:  counts["thumbs_up"]   ?? 0,
      thumbsDown: counts["thumbs_down"] ?? 0,
      avgRating,
      errorRate: invoked > 0 ? Number((errors / invoked).toFixed(2)) : null,
    },
    usageEvents: usageCounts,
    recentSignals,
  });
});

// ── GET /feedback/curator/:id ─────────────────────────────────────────────────
// Feedback aggregated across a set of components a curator cares about.
// The curator passes the component IDs they've staked on via query param.
//
// Query params:
//   components  — comma-separated list of componentIds (required)
//
// Response: one stats block per component, sorted by adoption rate desc.
feedback.get("/curator/:id", async (c) => {
  const curatorId = c.req.param("id");
  const raw = c.req.query("components");

  if (!raw) {
    return c.json({ error: "components query param required (comma-separated componentIds)" }, 400);
  }

  const componentIds = raw.split(",").map((s) => s.trim()).filter(Boolean);
  if (componentIds.length === 0) {
    return c.json({ error: "at least one componentId required" }, 400);
  }

  // Aggregated signals per component
  const signalRows = db
    .select({
      componentId: feedbackSignals.componentId,
      signalType: feedbackSignals.signalType,
      count: sql<number>`count(*)`,
      avgRating: sql<number>`avg(${feedbackSignals.rating})`,
    })
    .from(feedbackSignals)
    .where(inArray(feedbackSignals.componentId, componentIds))
    .groupBy(feedbackSignals.componentId, feedbackSignals.signalType)
    .all();

  // Aggregated usage per component
  const usageRows = db
    .select({
      componentId: usageEvents.componentId,
      eventType: usageEvents.eventType,
      count: sql<number>`count(*)`,
    })
    .from(usageEvents)
    .where(inArray(usageEvents.componentId, componentIds))
    .groupBy(usageEvents.componentId, usageEvents.eventType)
    .all();

  // Shape into a map keyed by componentId
  const byComponent: Record<string, {
    signals: Record<string, number>;
    avgRating: number | null;
    usage: Record<string, number>;
  }> = {};

  for (const id of componentIds) {
    byComponent[id] = { signals: {}, avgRating: null, usage: {} };
  }

  for (const row of signalRows) {
    byComponent[row.componentId].signals[row.signalType] = row.count;
    if (row.avgRating != null) {
      byComponent[row.componentId].avgRating = Number(row.avgRating.toFixed(2));
    }
  }

  for (const row of usageRows) {
    byComponent[row.componentId].usage[row.eventType] = row.count;
  }

  const components = componentIds.map((componentId) => {
    const { signals, avgRating, usage } = byComponent[componentId];
    const adopted = signals["adopted"] ?? 0;
    const rejected = signals["rejected"] ?? 0;
    const adoptionBase = adopted + rejected;
    const invoked = usage["invoked"] ?? 0;
    const errors  = usage["error"]   ?? 0;

    return {
      componentId,
      stats: {
        totalSignals: Object.values(signals).reduce((s, n) => s + n, 0),
        adoptionRate: adoptionBase > 0 ? Number((adopted / adoptionBase).toFixed(2)) : null,
        thumbsUp:   signals["thumbs_up"]   ?? 0,
        thumbsDown: signals["thumbs_down"] ?? 0,
        avgRating,
        errorRate: invoked > 0 ? Number((errors / invoked).toFixed(2)) : null,
      },
      usageEvents: usage,
    };
  }).sort((a, b) => (b.stats.adoptionRate ?? -1) - (a.stats.adoptionRate ?? -1));

  return c.json({ curatorId, components });
});

export { feedback };
