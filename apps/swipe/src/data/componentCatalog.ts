import type { Role } from "@wispr/ontology";

export interface ComponentInfo {
  id: string;
  name: string;
  type: "mcp" | "skill" | "model" | "sdk" | "api";
  description: string;
  atomId: string;
}

export interface UseCase {
  id: string;
  label: string;
  atomId: string;
}

// Deployed atom IDs from packages/ontology/src/seed/deployed.json
export const COMPONENT_CATALOG: ComponentInfo[] = [
  {
    id: "mcp-notion",
    name: "MCP Notion",
    type: "mcp",
    description: "Reads Notion databases and pages via Model Context Protocol",
    atomId: "0x276125410411831ca9eaa3059e3475a1efc89151bec1a884ec4d09f23f532dfc",
  },
  {
    id: "mcp-twitter",
    name: "MCP Twitter",
    type: "mcp",
    description: "Posts tweets and threads via Model Context Protocol",
    atomId: "0xd9690cd4111ea297370dc554244045be346ae4d8330709021d1fd8297298460b",
  },
  {
    id: "mcp-github",
    name: "MCP GitHub",
    type: "mcp",
    description: "Reads and comments on PRs and issues via Model Context Protocol",
    atomId: "0xadf544737f548d9b057b58606016b27e3be99a54cf55128083afe78fc1a85bad",
  },
  {
    id: "mcp-gmail",
    name: "MCP Gmail",
    type: "mcp",
    description: "Email management and sending via Model Context Protocol",
    atomId: "0x3bf263939c8d136589ea84a24c6a00bfcf3f15cfce1c2ae795d698b45fc97b37",
  },
  {
    id: "firecrawl-mcp",
    name: "Firecrawl MCP",
    type: "mcp",
    description: "Web scraping and crawling via Model Context Protocol",
    atomId: "0x8c440d5017a0bb5978388059398c39f73698ba4a93811b293e2a84f3fbd96dd3",
  },
  {
    id: "code-review-skill",
    name: "Code Review Skill",
    type: "skill",
    description: "AI-powered code diff analysis and bug detection",
    atomId: "0x41b502aee5d54674b49fba27579c0d00eb1bb178f97a860c400c43d04472f92c",
  },
  {
    id: "brand-voice-skill",
    name: "Brand Voice Skill",
    type: "skill",
    description: "Analyzes writing style and applies it to new content",
    atomId: "0x5f58b7f8e8b98f79447cc035abf7d929c259cb2384f3cb572ff25799fd023e9f",
  },
  {
    id: "embeddings-matching-skill",
    name: "Embeddings Matching",
    type: "skill",
    description: "Vector embedding comparison and semantic similarity scoring",
    atomId: "0x0ec84d948f958f451b66f392f40ed5d6455fc1554c6853ba5bac1441e10f825d",
  },
  {
    id: "claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    type: "model",
    description: "Long-form generation, reasoning, and tone control",
    atomId: "0xd6684172d40fc40377a39d8886a6b69d0124af63416a206482c80767826447cb",
  },
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    type: "model",
    description: "Fast, economical batch processing and classification",
    atomId: "0x35cb11f4a04de74c479b39448d1ab6e97dc74d71d20a1502b4a6ee86e52e0dca",
  },
  {
    id: "chainlink-data-feeds",
    name: "Chainlink Data Feeds",
    type: "api",
    description: "Real-time on-chain price oracles for crypto assets",
    atomId: "0x013916205816cc5db7c526ab75a5a9bb44b9ca1d6302d78063172062d7325e86",
  },
  {
    id: "1inch-fusion-plus-sdk",
    name: "1inch Fusion+ SDK",
    type: "sdk",
    description: "Optimal swap execution with MEV protection",
    atomId: "0x581e86cc8b1805fc9bef8144041920991e55721743a736a501372bf171a58455",
  },
  {
    id: "privy-embedded-wallet",
    name: "Privy Embedded Wallet",
    type: "sdk",
    description: "Embedded wallet for seamless transaction signing",
    atomId: "0xb93e28e3547650e9f6fa0aa2ef71ab641cf3e17e16d6ad495ae25fe3482668bb",
  },
];

// Deployed type atom IDs
export const TYPE_ATOM_IDS: Record<string, string> = {
  mcp: "0x479bb9ca8efae1cc9db20feee754f7c9b244fcba7f513bcc116b6e6933033b15",
  skill: "0xba57c5daf6c9b8b7821406db1bff01427b385a4a041f2ddd5cf004e80949610c",
  model: "0x6679f2c2cf479dd9fb122f6c3052083cae3c76844219961a239f6e5ab66e7b5e",
  sdk: "0x8c38a3fa6b369f4f30c2d7016a44b413a407d18ac25a1fa7a5ec722cd1a36e6c",
  api: "0x8de7788990242050e69e0aa56b61a7fbbeae4e4695dabe52575328d0c1858b48",
};

// Predicate atom IDs
export const IS_BEST_OF_ATOM_ID =
  "0x8fd780ca7db1d0a8a574a0b8dcffb29b77b4cbdfec610f96cf12a01229fad2a6";
export const IN_CONTEXT_OF_ATOM_ID =
  "0xa88b9975be0f56da24b2638a6a386d6ea3479a1ef6f04e08255bc7ca40d631c0";

// Use case contexts from the ontology — deployed atom IDs
const USE_CASES: Record<string, UseCase> = {
  defi: {
    id: "defi",
    label: "DeFi Development",
    atomId: "0x2b6d0071297f85ca9aa8fde3251ba1e3064217e73860e0639103236a76e7428e",
  },
  "web3-building": {
    id: "web3-building",
    label: "Web3 Building",
    atomId: "0x548bd9ec73a6b626771b78fee478e394fc267ebbe264eb2f1fc7776a9a75ac75",
  },
  "code-analysis": {
    id: "code-analysis",
    label: "Code Analysis",
    atomId: "0x5d60a671e8aca90e2058625cc5572f9992f8225efed35f67c6c08018472d96de",
  },
  "content-automation": {
    id: "content-automation",
    label: "Content Automation",
    atomId: "0x8a8150aadc28de8c1f5872900968662776a016add87cfe7dd51fd56f1b64316f",
  },
  "content-creation": {
    id: "content-creation",
    label: "Content Creation",
    atomId: "0x24dde47fb9f6ffa4d06e8052aeb40be39681b3a21123528d6843ab3d3db92a0e",
  },
  automation: {
    id: "automation",
    label: "Automation",
    atomId: "0x859a488d88a86962617d93cd5be3ca8d6de57ef712e1d185dd95b0dd37b4def0",
  },
};

// Role → use case context + component IDs
interface RoleConfig {
  useCase: UseCase;
  componentIds: string[];
}

const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  "smart-contract-dev": {
    useCase: USE_CASES["defi"],
    componentIds: [
      "mcp-github",
      "code-review-skill",
      "chainlink-data-feeds",
      "1inch-fusion-plus-sdk",
      "privy-embedded-wallet",
      "claude-sonnet-4-5",
    ],
  },
  "full-stack-web3": {
    useCase: USE_CASES["web3-building"],
    componentIds: [
      "mcp-github",
      "code-review-skill",
      "firecrawl-mcp",
      "embeddings-matching-skill",
      "chainlink-data-feeds",
      "privy-embedded-wallet",
      "claude-sonnet-4-5",
    ],
  },
  "frontend-dev": {
    useCase: USE_CASES["content-creation"],
    componentIds: [
      "mcp-github",
      "mcp-notion",
      "firecrawl-mcp",
      "brand-voice-skill",
      "claude-sonnet-4-5",
    ],
  },
  "backend-dev": {
    useCase: USE_CASES["code-analysis"],
    componentIds: [
      "mcp-github",
      "code-review-skill",
      "firecrawl-mcp",
      "embeddings-matching-skill",
      "mcp-gmail",
      "claude-sonnet-4-5",
    ],
  },
  designer: {
    useCase: USE_CASES["content-creation"],
    componentIds: [
      "mcp-notion",
      "brand-voice-skill",
      "mcp-twitter",
      "claude-sonnet-4-5",
      "claude-haiku-4-5",
    ],
  },
  "product-manager": {
    useCase: USE_CASES["content-automation"],
    componentIds: [
      "mcp-notion",
      "mcp-gmail",
      "brand-voice-skill",
      "mcp-twitter",
      "claude-sonnet-4-5",
      "claude-haiku-4-5",
    ],
  },
  founder: {
    useCase: USE_CASES["automation"],
    componentIds: [
      "mcp-notion",
      "mcp-twitter",
      "mcp-gmail",
      "brand-voice-skill",
      "privy-embedded-wallet",
      "claude-sonnet-4-5",
    ],
  },
};

const TYPE_EMOJI: Record<string, string> = {
  mcp: "🔌",
  skill: "🧠",
  model: "🤖",
  sdk: "📦",
  api: "🔗",
};

export interface Recommendation {
  useCase: UseCase;
  components: (ComponentInfo & { typeEmoji: string })[];
}

export function getRecommendations(role: Role): Recommendation {
  const config = ROLE_CONFIGS[role];
  const components = config.componentIds
    .map((id) => {
      const component = COMPONENT_CATALOG.find((c) => c.id === id);
      if (!component) return null;
      return { ...component, typeEmoji: TYPE_EMOJI[component.type] ?? "🔧" };
    })
    .filter(Boolean) as (ComponentInfo & { typeEmoji: string })[];

  return { useCase: config.useCase, components };
}
