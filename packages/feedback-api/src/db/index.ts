import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const DB_PATH = process.env.FEEDBACK_DB_PATH ?? "./feedback.db";

const sqlite = new Database(DB_PATH);

// WAL mode for better concurrent read performance
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

// Auto-create tables on startup
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    wallet_address TEXT,
    profile_role TEXT,
    profile_level TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    ended_at INTEGER
  );
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    model TEXT,
    tokens_input INTEGER,
    tokens_output INTEGER,
    latency_ms INTEGER,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE TABLE IF NOT EXISTS blueprints (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    intent TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE TABLE IF NOT EXISTS blueprint_components (
    id TEXT PRIMARY KEY,
    blueprint_id TEXT NOT NULL REFERENCES blueprints(id) ON DELETE CASCADE,
    component_id TEXT NOT NULL,
    component_type TEXT NOT NULL,
    component_name TEXT NOT NULL,
    intuition_atom_id TEXT,
    intuition_triple_id TEXT,
    trust_score_at_time REAL,
    position INTEGER,
    adopted INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS idx_blueprint_components_component_id ON blueprint_components(component_id);
  CREATE TABLE IF NOT EXISTS feedback_signals (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    component_id TEXT NOT NULL,
    blueprint_id TEXT REFERENCES blueprints(id) ON DELETE SET NULL,
    signal_type TEXT NOT NULL,
    rating INTEGER,
    comment TEXT,
    context TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE INDEX IF NOT EXISTS idx_feedback_signals_component_id ON feedback_signals(component_id);
  CREATE INDEX IF NOT EXISTS idx_feedback_signals_signal_type ON feedback_signals(signal_type);
  CREATE TABLE IF NOT EXISTS curation_signals (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    curator_address TEXT,
    verdict TEXT NOT NULL,
    comment TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE INDEX IF NOT EXISTS idx_curation_signals_conversation_id ON curation_signals(conversation_id);
  CREATE TABLE IF NOT EXISTS usage_events (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES sessions(id) ON DELETE SET NULL,
    component_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    metadata TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE INDEX IF NOT EXISTS idx_usage_events_component_id ON usage_events(component_id);
  CREATE INDEX IF NOT EXISTS idx_usage_events_event_type ON usage_events(event_type);
`);

export const db = drizzle(sqlite, { schema });
export type DB = typeof db;
