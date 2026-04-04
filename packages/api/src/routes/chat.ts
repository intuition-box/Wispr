import { Hono } from "hono";
import Anthropic from "@anthropic-ai/sdk";
import {
  extract,
  query,
  getIntuitionClient,
  closeIntuitionClient,
  type RankedComponent,
} from "@wispr/agent";

const chat = new Hono();

const anthropic = new Anthropic();

chat.post("/chat", async (c) => {
  const { message } = await c.req.json();

  if (!message || typeof message !== "string") {
    return c.json({ error: "message required" }, 400);
  }

  let claims, components;
  try {
    const client = await getIntuitionClient();
    claims = await extract(client, message);
    console.log("[wispr] claims:", JSON.stringify(claims));

    components = await query(client, claims);
    console.log("[wispr] components:", components.length);
  } catch (err) {
    await closeIntuitionClient();
    console.error("[wispr] pipeline failed:", err);
    return c.json({ error: (err as Error).message }, 500);
  }

  const intuitionContext = buildContext(components);

  const response = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `<intuition_context>\n${intuitionContext}\n</intuition_context>\n\n${message}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Extract JSON from response
  const jsonMatch =
    text.match(/```json\n([\s\S]*?)\n```/) || text.match(/(\{[\s\S]*\})/);
  if (!jsonMatch) {
    return c.json({ error: "No blueprint generated" }, 500);
  }

  try {
    const blueprint = JSON.parse(jsonMatch[1]);
    return c.json(blueprint);
  } catch {
    return c.json({ error: "Invalid blueprint JSON" }, 500);
  }
});

function buildContext(components: RankedComponent[]): string {
  if (components.length === 0) {
    return "No components found in the Intuition knowledge graph for this query.";
  }

  return components
    .slice(0, 10)
    .map(
      (r, i) =>
        `${i + 1}. [${r.component.type.toUpperCase()}] ${r.component.name} (trust: ${r.trustScore})\n   ${r.reasoning}`
    )
    .join("\n");
}

const SYSTEM_PROMPT = `You are Wispr, a trust-scored discovery engine for AI agent components.

You receive pre-resolved context from the Intuition knowledge graph and must return a Blueprint JSON object.

IMPORTANT: Your response must be ONLY a JSON code block, no markdown, no explanation outside the JSON.

Output this exact structure:

\`\`\`json
{
  "id": "kebab-case-id",
  "title": "Stack title",
  "intent": "user's original intent",
  "domains": ["Domain1", "Domain2"],
  "resolvedIn": "1.2s",
  "stack": {
    "id": "same-as-root-id",
    "components": [
      {
        "id": "component-id",
        "name": "Component Name",
        "description": "What it does",
        "url": "https://...",
        "type": "mcp" | "sdk" | "api" | "model" | "skill",
        "context": "context-name",
        "trustScore": 8.5,
        "curatorCount": 20
      }
    ],
    "flow": "Step 1 → Step 2 → Step 3",
    "infrastructure": ["optional infra notes"],
    "customCode": ["optional custom code notes"]
  },
  "systemPrompt": "System prompt for the agent",
  "installCommand": "npm install ...",
  "mcpConfig": {
    "mcp-name": { "command": "npx", "args": ["-y", "package-name"] }
  },
  "llms": [
    { "model": "Claude Sonnet 4.5", "provider": "Anthropic", "reasoning": "Why this model" }
  ]
}
\`\`\`

Rules:
- Use components from the Intuition context if available, otherwise use the Wispear registry
- trustScore: number 0-10 based on Intuition data (use 8.0 if unknown)
- curatorCount: number based on Intuition data (use 0 if unknown)
- type must be one of: mcp, sdk, api, model, skill, package
- flow uses → arrows between steps
- Only include mcpConfig for mcp-type components

Wispear Registry v0.1:
- content-automation: mcp-notion, mcp-twitter, brand-voice-skill, claude-sonnet-4-5
- defi: chainlink-data-feeds, 1inch-fusion-plus-sdk, privy-embedded-wallet`;

export default chat;
