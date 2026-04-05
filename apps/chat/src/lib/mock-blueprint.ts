import ontology from "../../../../plans/ontology-foundation-w4-p3.json";
import ipfsMapping from "../../../../packages/ontology/favicons/ipfs-mapping.json";

// Trust data mocked — normally comes from Intuition graph (TVL, curator stakes)
const trustData: Record<string, { trustScore: number; curatorCount: number }> = {
  "mcp-notion": { trustScore: 9.1, curatorCount: 25 },
  "mcp-twitter": { trustScore: 8.5, curatorCount: 20 },
  "claude-sonnet-4-5": { trustScore: 9.4, curatorCount: 41 },
  "brand-voice-skill": { trustScore: 8.8, curatorCount: 22 },
  "chainlink-data-feeds": { trustScore: 9.5, curatorCount: 38 },
  "1inch-fusion-plus-sdk": { trustScore: 9.3, curatorCount: 32 },
  "privy-embedded-wallet": { trustScore: 9.1, curatorCount: 26 },
};

// Resolve atom type from "is-best-of" base triples
function getAtomType(atomId: string): "tool" | "skill" | "model" {
  const triple = ontology.triples.base_triples.find(
    (t) => t.subject === atomId && t.predicate === "is-best-of"
  );
  return (triple?.object as "tool" | "skill" | "model") ?? "tool";
}

// Resolve atom context from "in-context-of" nested triples
function getAtomContext(atomId: string): string | undefined {
  // First find the base triple ID for this atom
  const baseTriple = ontology.triples.base_triples.find(
    (t) => t.subject === atomId
  );
  if (!baseTriple) return undefined;
  // Then find the nested triple that references it
  const nested = ontology.triples.nested_triples.find(
    (t) => t.subject_triple === baseTriple.id && t.predicate === "in-context-of"
  );
  if (!nested) return undefined;
  const contextAtom = ontology.atoms.find((a) => a.id === nested.object);
  return contextAtom?.name;
}

export interface BlueprintComponent {
  id: string;
  name: string;
  description: string;
  url?: string;
  imageUrl?: string;
  type: "tool" | "skill" | "model";
  context?: string;
  trustScore: number;
  curatorCount: number;
}

export interface BlueprintStack {
  id: string;
  components: BlueprintComponent[];
  flow: string;
  infrastructure?: string[];
  customCode?: string[];
}

export interface Blueprint {
  id: string;
  title: string;
  intent: string;
  domains: string[];
  resolvedIn: string;
  stack: BlueprintStack;
  systemPrompt: string;
  installCommand: string;
  mcpConfig: Record<string, { command: string; args: string[] }>;
  llms: { model: string; provider: string; reasoning: string }[];
}

// Build components from ontology atoms + triples + mock trust data
function buildStackComponents(componentIds: string[]): BlueprintComponent[] {
  return componentIds.map((id) => {
    const atom = ontology.atoms.find((a) => a.id === id)!;
    const trust = trustData[id] ?? { trustScore: 7.0, curatorCount: 5 };
    return {
      id,
      name: atom.name,
      description: atom.description,
      url: atom.url,
      type: getAtomType(id),
      context: getAtomContext(id),
      imageUrl: (ipfsMapping as Record<string, string>)[id],
      trustScore: trust.trustScore,
      curatorCount: trust.curatorCount,
    };
  });
}

// --- W4: Notion to Twitter ---

const w4Stack = ontology.use_case_stacks["w4-notion-to-twitter"];

export const mockBlueprintW4: Blueprint = {
  id: "w4-notion-to-twitter",
  title: "Notion → Twitter Autopilot",
  intent: "I want to automatically turn my Notion notes into Twitter threads every week",
  domains: ["Content", "Social Media"],
  resolvedIn: "1.2s",
  stack: {
    id: "w4-notion-to-twitter",
    components: buildStackComponents(w4Stack.components),
    flow: w4Stack.flow,
    infrastructure: w4Stack.infrastructure,
  },
  systemPrompt: `You are a content repurposing agent. Your job is to take raw Notion notes and turn them into engaging Twitter threads.

Rules:
- Each thread should be 4-8 tweets
- First tweet must hook the reader
- Use the brand voice skill to match the user's writing style
- Include a CTA in the final tweet
- Never fabricate facts — only use information from the Notion source`,
  installCommand: "npm install @notionhq/client twitter-api-v2",
  mcpConfig: {
    "notion-mcp": {
      command: "npx",
      args: ["-y", "@notionhq/notion-mcp-server"],
    },
    "twitter-mcp": {
      command: "npx",
      args: ["-y", "@enesc/twitter-mcp-server"],
    },
  },
  llms: [
    {
      model: "Claude Sonnet 4.5",
      provider: "Anthropic",
      reasoning: "Best balance of quality and cost for content generation. Strong at maintaining voice and tone.",
    },
    {
      model: "GPT-4o",
      provider: "OpenAI",
      reasoning: "Good alternative — slightly faster but less nuanced tone control.",
    },
  ],
};

// --- P3: DeFi Rebalancing ---

const p3Stack = ontology.use_case_stacks["p3-defi-rebalancing"];

export const mockBlueprintP3: Blueprint = {
  id: "p3-defi-rebalancing",
  title: "DeFi Portfolio Rebalancer",
  intent: "I want an agent that automatically rebalances my DeFi portfolio based on market conditions",
  domains: ["Web3", "DeFi"],
  resolvedIn: "1.8s",
  stack: {
    id: "p3-defi-rebalancing",
    components: buildStackComponents(p3Stack.components),
    flow: p3Stack.flow,
    customCode: p3Stack.custom_code,
  },
  systemPrompt: `You are a DeFi portfolio rebalancing agent. You monitor asset prices and execute swaps to maintain target allocations.

Rules:
- Only rebalance when deviation exceeds 5% from target
- Never swap more than 20% of portfolio in a single transaction
- Use Fusion+ for MEV-protected execution
- Log every decision with reasoning for audit trail
- Alert user before executing swaps above $1000`,
  installCommand: "npm install @chainlink/contracts @1inch/fusion-sdk @privy-io/server-auth",
  mcpConfig: {},
  llms: [
    {
      model: "Claude Sonnet 4.5",
      provider: "Anthropic",
      reasoning: "Reliable reasoning for financial decisions. Good at following strict rules.",
    },
  ],
};
