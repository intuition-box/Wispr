import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const INTUITION_MCP_URL =
  process.env.INTUITION_MCP_URL ?? "https://mcp.intuition.systems/mcp";

let _client: Client | null = null;

export async function getIntuitionClient(): Promise<Client> {
  if (_client) return _client;

  _client = new Client({ name: "wispr-agent", version: "0.0.1" });

  await _client.connect(
    new StreamableHTTPClientTransport(new URL(INTUITION_MCP_URL))
  );

  return _client;
}
