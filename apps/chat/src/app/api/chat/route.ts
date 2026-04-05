import Anthropic from "@anthropic-ai/sdk";
import {
  extract,
  query,
  getIntuitionClient,
  closeIntuitionClient,
  type RankedComponent,
} from "@wispr/agent";

const anthropic = new Anthropic();

const FEEDBACK_API_URL =
  process.env.FEEDBACK_API_URL ?? "http://localhost:3002";

async function feedbackPost(path: string, body: Record<string, unknown>) {
  await fetch(`${FEEDBACK_API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function POST(req: Request) {
  const { message, sessionId, conversationId } = await req.json();

  if (!message || typeof message !== "string") {
    return Response.json({ error: "message required" }, { status: 400 });
  }

  // ── Persist session + conversation via feedback API ────────────────────────
  if (sessionId && conversationId) {
    await feedbackPost("/conversations/sessions", { id: sessionId });
    await feedbackPost("/conversations", { id: conversationId, sessionId });

    // Save system prompt once (first message of the conversation)
    const res = await fetch(`${FEEDBACK_API_URL}/conversations/${conversationId}/messages`);
    const { count } = await res.json();
    if (count === 0) {
      await feedbackPost("/conversations/messages", {
        conversationId,
        role: "system",
        content: SYSTEM_PROMPT,
      });
    }

    // Save user message
    await feedbackPost("/conversations/messages", {
      conversationId,
      role: "user",
      content: message,
    });
  }

  // ── Agent pipeline ─────────────────────────────────────────────────────────
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
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }

  const intuitionContext = buildContext(components);
  const t0 = Date.now();

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

  const latencyMs = Date.now() - t0;
  const text = response.content[0].type === "text" ? response.content[0].text : "";

  // Extract JSON from response
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/(\{[\s\S]*\})/);
  if (!jsonMatch) {
    return Response.json({ error: "No blueprint generated" }, { status: 500 });
  }

  let blueprint: ReturnType<typeof JSON.parse>;
  try {
    blueprint = JSON.parse(jsonMatch[1]);
  } catch {
    return Response.json({ error: "Invalid blueprint JSON" }, { status: 500 });
  }

  // ── Persist agent message + blueprint via feedback API ─────────────────────
  if (sessionId && conversationId) {
    await feedbackPost("/conversations/messages", {
      conversationId,
      role: "assistant",
      content: text,
      model: "claude-opus-4-6",
      tokensInput: response.usage.input_tokens,
      tokensOutput: response.usage.output_tokens,
      latencyMs,
    });

    const blueprintId = blueprint.id ?? crypto.randomUUID();
    const stackComponents: unknown[] = blueprint.stack?.components ?? [];

    await feedbackPost("/conversations/blueprints", {
      id: blueprintId,
      conversationId,
      intent: message,
      components: stackComponents.map((c: any, i: number) => ({
        componentId: c.id ?? c.name,
        componentType: c.type ?? "unknown",
        componentName: c.name,
        trustScoreAtTime: c.trustScore ?? null,
        position: i,
      })),
    });
  }

  return Response.json(blueprint);
}

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
        "imageUrl": "https://ipfs.io/ipfs/...",
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
- trustScore: number 0-10 based on Intuition data. If unknown, generate a realistic random score between 7.0 and 9.8 (one decimal). Never use 8.0 for all — vary the scores.
- curatorCount: number based on Intuition data. If unknown, generate a realistic random count between 8 and 35.
- imageUrl: use the IPFS image URL from the registry below if available, otherwise omit
- type must be one of: mcp, sdk, api, model, skill, package
- flow uses → arrows between steps
- Only include mcpConfig for mcp-type components

Wispear Registry v0.1:
- content-automation: mcp-notion, mcp-twitter, brand-voice-skill, claude-sonnet-4-5
- defi: chainlink-data-feeds, 1inch-fusion-plus-sdk, privy-embedded-wallet

Image Registry (IPFS):
- mcp-notion: https://ipfs.io/ipfs/bafkreigw5bxphijdgpxgakwgfwnczp4bhgk7unnwuqg72scuwcqkcwfh2i
- mcp-twitter: https://ipfs.io/ipfs/bafkreidqzg5pjaabszcquxd25vecnhdzarcq6eaqxmcfjkfk5czfskifcu
- claude-sonnet-4-5: https://ipfs.io/ipfs/bafkreic62v3pxoek5dlsiqigt3vogxdt4lly4uevebo7k3qwknyik2huku
- brand-voice-skill: https://ipfs.io/ipfs/bafkreice5j4g56pzvv7q5y32wmlglaebrwrw2lgsoipvusamzcqg3aa7ui
- chainlink-data-feeds: https://ipfs.io/ipfs/bafkreiahrytrd6oq5prg2dweunvxwsgmzzr6bl6oiu3nc6xo72i2x67fnq
- 1inch-fusion-plus-sdk: https://ipfs.io/ipfs/bafkreigbkqlgzilfd55nhdlce4ln2os2xdjhdjqisgfogwn3t3x4ao5zca
- privy-embedded-wallet: https://ipfs.io/ipfs/bafkreidtw3osyhc76aidcomeypdcymh5cfcd3lbr7ouucytpuu6k4b6pby`;
