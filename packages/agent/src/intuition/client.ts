import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const INTUITION_MCP_URL =
  process.env.INTUITION_MCP_URL ?? "http://localhost:3003/mcp";

let _client: Client | null = null;
let _connecting: Promise<Client> | null = null;

async function connect(): Promise<Client> {
  // Close stale client if any
  if (_client) {
    try { await _client.close(); } catch { /* ignore */ }
    _client = null;
  }

  const client = new Client({ name: "wispr-agent", version: "0.0.1" });
  await client.connect(
    new StreamableHTTPClientTransport(new URL(INTUITION_MCP_URL))
  );
  _client = client;
  return client;
}

export async function getIntuitionClient(): Promise<Client> {
  // Reuse existing connected client
  if (_client) return _client;

  // Deduplicate concurrent connection attempts
  if (_connecting) return _connecting;

  _connecting = connect().finally(() => { _connecting = null; });
  return _connecting;
}

export async function closeIntuitionClient(): Promise<void> {
  if (_client) {
    try { await _client.close(); } catch { /* ignore */ }
    _client = null;
  }
}
