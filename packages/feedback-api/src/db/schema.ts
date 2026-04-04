import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ─── sessions ────────────────────────────────────────────────────────────────

export const sessions = sqliteTable("sessions", {
  id:            text("id").primaryKey(),
  walletAddress: text("wallet_address"),
  profileRole:   text("profile_role"),  // full-stack-web3 | smart-contract-dev | designer | ...
  profileLevel:  text("profile_level"), // beginner | intermediate | advanced | expert
  createdAt:     integer("created_at").notNull().default(sql`(unixepoch())`),
});

// ─── blueprints ──────────────────────────────────────────────────────────────

export const blueprints = sqliteTable("blueprints", {
  id:        text("id").primaryKey(),
  sessionId: text("session_id").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  intent:    text("intent").notNull(),
  createdAt: integer("created_at").notNull().default(sql`(unixepoch())`),
});

// ─── blueprint_components ────────────────────────────────────────────────────

export const blueprintComponents = sqliteTable(
  "blueprint_components",
  {
    id:                 text("id").primaryKey(),
    blueprintId:        text("blueprint_id").notNull().references(() => blueprints.id, { onDelete: "cascade" }),
    componentId:        text("component_id").notNull(),   // Intuition atom ID or slug
    componentType:      text("component_type").notNull(), // agent | skill | mcp | api | package | llm
    componentName:      text("component_name").notNull(),
    trustScoreAtTime:   real("trust_score_at_time"),      // snapshot at recommendation time
    position:           integer("position"),               // order in blueprint (0-based)
    adopted:            integer("adopted").notNull().default(0), // 0 | 1
  },
  (t) => [index("idx_blueprint_components_component_id").on(t.componentId)],
);

// ─── feedback_signals ────────────────────────────────────────────────────────

export const feedbackSignals = sqliteTable(
  "feedback_signals",
  {
    id:          text("id").primaryKey(),
    sessionId:   text("session_id").notNull().references(() => sessions.id, { onDelete: "cascade" }),
    componentId: text("component_id").notNull(),
    blueprintId: text("blueprint_id").references(() => blueprints.id, { onDelete: "set null" }),
    signalType:  text("signal_type").notNull(), // adopted | rejected | thumbs_up | thumbs_down | error
    rating:      integer("rating"),             // 1–5
    comment:     text("comment"),
    context:     text("context"),               // JSON string
    createdAt:   integer("created_at").notNull().default(sql`(unixepoch())`),
  },
  (t) => [
    index("idx_feedback_signals_component_id").on(t.componentId),
    index("idx_feedback_signals_signal_type").on(t.signalType),
  ],
);

// ─── usage_events ────────────────────────────────────────────────────────────

export const usageEvents = sqliteTable(
  "usage_events",
  {
    id:          text("id").primaryKey(),
    sessionId:   text("session_id").references(() => sessions.id, { onDelete: "set null" }),
    componentId: text("component_id").notNull(),
    eventType:   text("event_type").notNull(), // installed | invoked | success | error | uninstalled
    metadata:    text("metadata"),             // JSON string
    createdAt:   integer("created_at").notNull().default(sql`(unixepoch())`),
  },
  (t) => [
    index("idx_usage_events_component_id").on(t.componentId),
    index("idx_usage_events_event_type").on(t.eventType),
  ],
);

// ─── Types ───────────────────────────────────────────────────────────────────

export type Session          = typeof sessions.$inferSelect;
export type NewSession       = typeof sessions.$inferInsert;
export type Blueprint        = typeof blueprints.$inferSelect;
export type NewBlueprint     = typeof blueprints.$inferInsert;
export type BlueprintComponent    = typeof blueprintComponents.$inferSelect;
export type NewBlueprintComponent = typeof blueprintComponents.$inferInsert;
export type FeedbackSignal    = typeof feedbackSignals.$inferSelect;
export type NewFeedbackSignal = typeof feedbackSignals.$inferInsert;
export type UsageEvent        = typeof usageEvents.$inferSelect;
export type NewUsageEvent     = typeof usageEvents.$inferInsert;
