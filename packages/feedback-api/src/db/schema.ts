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

// ─── conversations ────────────────────────────────────────────────────────────

export const conversations = sqliteTable("conversations", {
  id:        text("id").primaryKey(),
  sessionId: text("session_id").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  createdAt: integer("created_at").notNull().default(sql`(unixepoch())`),
  endedAt:   integer("ended_at"),
});

// ─── messages ─────────────────────────────────────────────────────────────────

export const messages = sqliteTable("messages", {
  id:             text("id").primaryKey(),
  conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role:           text("role").notNull(), // user | assistant
  content:        text("content").notNull(),
  model:          text("model"),
  tokensInput:    integer("tokens_input"),
  tokensOutput:   integer("tokens_output"),
  latencyMs:      integer("latency_ms"),
  createdAt:      integer("created_at").notNull().default(sql`(unixepoch())`),
});

// ─── blueprints ──────────────────────────────────────────────────────────────

export const blueprints = sqliteTable("blueprints", {
  id:             text("id").primaryKey(),
  conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  intent:         text("intent").notNull(),
  createdAt:      integer("created_at").notNull().default(sql`(unixepoch())`),
});

// ─── blueprint_components ────────────────────────────────────────────────────

export const blueprintComponents = sqliteTable(
  "blueprint_components",
  {
    id:                 text("id").primaryKey(),
    blueprintId:        text("blueprint_id").notNull().references(() => blueprints.id, { onDelete: "cascade" }),
    componentId:        text("component_id").notNull(),   // Intuition atom ID (numeric) or slug fallback
    componentType:      text("component_type").notNull(), // agent | skill | mcp | api | package | llm
    componentName:      text("component_name").notNull(),
    intuitionAtomId:    text("intuition_atom_id"),        // numeric Intuition atom ID when available
    intuitionTripleId:  text("intuition_triple_id"),      // triple ID: (component isRelevantFor intent)
    trustScoreAtTime:   real("trust_score_at_time"),
    position:           integer("position"),
    adopted:            integer("adopted").notNull().default(0), // 0 | 1
  },
  (t) => ({ idx_blueprint_components_component_id: index("idx_blueprint_components_component_id").on(t.componentId) }),
);

// ─── feedback_signals ────────────────────────────────────────────────────────

export const feedbackSignals = sqliteTable(
  "feedback_signals",
  {
    id:             text("id").primaryKey(),
    conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
    componentId:    text("component_id").notNull(),
    blueprintId:    text("blueprint_id").references(() => blueprints.id, { onDelete: "set null" }),
    signalType:     text("signal_type").notNull(), // adopted | rejected | thumbs_up | thumbs_down | error
    rating:         integer("rating"),
    comment:        text("comment"),
    context:        text("context"),
    createdAt:      integer("created_at").notNull().default(sql`(unixepoch())`),
  },
  (t) => ({
    idx_feedback_signals_component_id: index("idx_feedback_signals_component_id").on(t.componentId),
    idx_feedback_signals_signal_type: index("idx_feedback_signals_signal_type").on(t.signalType),
  }),
);

// ─── curation_signals ────────────────────────────────────────────────────────

export const curationSignals = sqliteTable(
  "curation_signals",
  {
    id:              text("id").primaryKey(),
    conversationId:  text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
    curatorAddress:  text("curator_address"),
    verdict:         text("verdict").notNull(), // good | bad
    comment:         text("comment"),
    createdAt:       integer("created_at").notNull().default(sql`(unixepoch())`),
  },
  (t) => ({ idx_curation_signals_conversation_id: index("idx_curation_signals_conversation_id").on(t.conversationId) }),
);

// ─── usage_events ────────────────────────────────────────────────────────────

export const usageEvents = sqliteTable(
  "usage_events",
  {
    id:          text("id").primaryKey(),
    sessionId:   text("session_id").references(() => sessions.id, { onDelete: "set null" }),
    componentId: text("component_id").notNull(),
    eventType:   text("event_type").notNull(), // installed | invoked | success | error | uninstalled
    metadata:    text("metadata"),
    createdAt:   integer("created_at").notNull().default(sql`(unixepoch())`),
  },
  (t) => ({
    idx_usage_events_component_id: index("idx_usage_events_component_id").on(t.componentId),
    idx_usage_events_event_type: index("idx_usage_events_event_type").on(t.eventType),
  }),
);

// ─── Types ───────────────────────────────────────────────────────────────────

export type Session               = typeof sessions.$inferSelect;
export type NewSession            = typeof sessions.$inferInsert;
export type Conversation          = typeof conversations.$inferSelect;
export type NewConversation       = typeof conversations.$inferInsert;
export type Message               = typeof messages.$inferSelect;
export type NewMessage            = typeof messages.$inferInsert;
export type Blueprint             = typeof blueprints.$inferSelect;
export type NewBlueprint          = typeof blueprints.$inferInsert;
export type BlueprintComponent     = typeof blueprintComponents.$inferSelect;
export type NewBlueprintComponent  = typeof blueprintComponents.$inferInsert;
export type FeedbackSignal        = typeof feedbackSignals.$inferSelect;
export type NewFeedbackSignal     = typeof feedbackSignals.$inferInsert;
export type CurationSignal        = typeof curationSignals.$inferSelect;
export type NewCurationSignal     = typeof curationSignals.$inferInsert;
export type UsageEvent            = typeof usageEvents.$inferSelect;
export type NewUsageEvent         = typeof usageEvents.$inferInsert;
