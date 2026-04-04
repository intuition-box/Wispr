// Atom registry — all deployed on-chain (Intuition L3)
// Source: packages/ontology/src/seed/deployed.json + plans/ontology-foundation-*.json

export interface AtomData {
  id: string;
  name: string;
  type: string;
  typeIcon: string;
  description: string;
  url: string;
  hash: string;
  contexts: string[];
  autonomy: string;
  usedIn: { id: string; name: string }[];
}

export const ATOMS: Record<string, AtomData> = {
  // --- W4: Notion → Twitter ---
  "mcp-notion": {
    id: "mcp-notion",
    name: "MCP Notion",
    type: "mcp",
    typeIcon: "🔌",
    description: "Model Context Protocol server for Notion — reads databases, pages, and syncs workspace content with your AI agent.",
    url: "https://github.com/makenotion/notion-mcp-server",
    hash: "0x2761…2dfc",
    contexts: ["content-automation", "productivity"],
    autonomy: "Medium",
    usedIn: [{ id: "cs-w4", name: "Notion → Twitter Pipeline" }],
  },
  "mcp-twitter": {
    id: "mcp-twitter",
    name: "MCP Twitter",
    type: "mcp",
    typeIcon: "🔌",
    description: "Model Context Protocol server for Twitter — posts tweets, threads, and manages social presence from your AI agent.",
    url: "https://github.com/EnesCinr/twitter-mcp",
    hash: "0xd969…460b",
    contexts: ["social-media", "communication"],
    autonomy: "High",
    usedIn: [{ id: "cs-w4", name: "Notion → Twitter Pipeline" }],
  },
  "brand-voice-skill": {
    id: "brand-voice-skill",
    name: "Brand Voice Skill",
    type: "skill",
    typeIcon: "🧠",
    description: "AI service that analyzes your writing style from existing content and applies it to new drafts — your voice, amplified.",
    url: "https://wispear.ai/skills/brand-voice",
    hash: "0x5f58…3e9f",
    contexts: ["content-creation", "creativity"],
    autonomy: "Low",
    usedIn: [{ id: "cs-w4", name: "Notion → Twitter Pipeline" }],
  },
  "claude-sonnet-4-5": {
    id: "claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    type: "model",
    typeIcon: "🤖",
    description: "Anthropic's Claude Sonnet 4.5 — long-form generation, advanced reasoning, and precise tone control for content and code.",
    url: "https://docs.anthropic.com/en/docs/about-claude/models",
    hash: "0xd668…47cb",
    contexts: ["content-generation", "creativity"],
    autonomy: "Low",
    usedIn: [
      { id: "cs-w4", name: "Notion → Twitter Pipeline" },
      { id: "cs-w2", name: "GitHub PR Auto-Review" },
    ],
  },

  // --- P3: DeFi Portfolio Rebalancer ---
  "chainlink-data-feeds": {
    id: "chainlink-data-feeds",
    name: "Chainlink Data Feeds",
    type: "api",
    typeIcon: "⚡",
    description: "Real-time on-chain price oracles for crypto assets. Tamper-proof, decentralized price data powering DeFi protocols.",
    url: "https://docs.chain.link/data-feeds",
    hash: "0x0139…5e86",
    contexts: ["defi", "finance"],
    autonomy: "High",
    usedIn: [{ id: "cs-p3", name: "DeFi Portfolio Rebalancer" }],
  },
  "1inch-fusion-plus-sdk": {
    id: "1inch-fusion-plus-sdk",
    name: "1inch Fusion+ SDK",
    type: "sdk",
    typeIcon: "⚡",
    description: "Optimal swap execution with MEV protection and guaranteed slippage. Atomic cross-chain swaps with intent-based architecture.",
    url: "https://docs.1inch.io/docs/fusion-swap",
    hash: "0x581e…8455",
    contexts: ["defi", "finance"],
    autonomy: "High",
    usedIn: [{ id: "cs-p3", name: "DeFi Portfolio Rebalancer" }],
  },
  "privy-embedded-wallet": {
    id: "privy-embedded-wallet",
    name: "Privy Embedded Wallet",
    type: "sdk",
    typeIcon: "⚡",
    description: "Embedded wallet solution for seamless background transaction signing. No popups, no friction.",
    url: "https://docs.privy.io",
    hash: "0xb93e…68bb",
    contexts: ["web3-building", "infrastructure"],
    autonomy: "Medium",
    usedIn: [{ id: "cs-p3", name: "DeFi Portfolio Rebalancer" }],
  },

  // --- W2: GitHub PR Auto-Review ---
  "mcp-github": {
    id: "mcp-github",
    name: "MCP GitHub",
    type: "mcp",
    typeIcon: "🔌",
    description: "Model Context Protocol server for GitHub — reads PRs, diffs, issues, and posts review comments automatically.",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/github",
    hash: "0xadf5…5bad",
    contexts: ["code-analysis", "productivity"],
    autonomy: "Medium",
    usedIn: [{ id: "cs-w2", name: "GitHub PR Auto-Review" }],
  },
  "code-review-skill": {
    id: "code-review-skill",
    name: "Code Review Skill",
    type: "skill",
    typeIcon: "🧠",
    description: "AI skill that analyzes code diffs, detects bugs, security issues, and suggests improvements with inline comments.",
    url: "https://wispear.ai/skills/code-review",
    hash: "0x41b5…f92c",
    contexts: ["code-analysis", "productivity"],
    autonomy: "Low",
    usedIn: [{ id: "cs-w2", name: "GitHub PR Auto-Review" }],
  },

  // --- W3: Daily Job Matcher ---
  "firecrawl-mcp": {
    id: "firecrawl-mcp",
    name: "Firecrawl MCP",
    type: "mcp",
    typeIcon: "🔌",
    description: "Model Context Protocol server for Firecrawl — scrapes and crawls web pages into structured data for your agent.",
    url: "https://github.com/mendableai/firecrawl-mcp-server",
    hash: "0x8c44…6dd3",
    contexts: ["data-scraping", "productivity"],
    autonomy: "Medium",
    usedIn: [{ id: "cs-w3", name: "Daily Job Matcher" }],
  },
  "embeddings-matching-skill": {
    id: "embeddings-matching-skill",
    name: "Embeddings Matching Skill",
    type: "skill",
    typeIcon: "🧠",
    description: "AI skill that compares content using vector embeddings and scores semantic similarity between documents and profiles.",
    url: "https://wispear.ai/skills/embeddings-matching",
    hash: "0x0ec8…825d",
    contexts: ["ai-agents", "productivity"],
    autonomy: "Low",
    usedIn: [{ id: "cs-w3", name: "Daily Job Matcher" }],
  },
  "mcp-gmail": {
    id: "mcp-gmail",
    name: "MCP Gmail",
    type: "mcp",
    typeIcon: "🔌",
    description: "Model Context Protocol server for Gmail — sends emails, manages inbox, and automates email workflows from your agent.",
    url: "https://github.com/modelcontextprotocol/servers/tree/main/src/gmail",
    hash: "0x3bf2…7b37",
    contexts: ["automation", "communication"],
    autonomy: "High",
    usedIn: [{ id: "cs-w3", name: "Daily Job Matcher" }],
  },
  "claude-haiku-4-5": {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    type: "model",
    typeIcon: "🤖",
    description: "Anthropic's Claude Haiku 4.5 — fast and economical for batch processing, recurring tasks, and high-volume operations.",
    url: "https://docs.anthropic.com/en/docs/about-claude/models",
    hash: "0x35cb…0dca",
    contexts: ["batch-processing", "productivity"],
    autonomy: "Low",
    usedIn: [{ id: "cs-w3", name: "Daily Job Matcher" }],
  },
};

export function getAtom(id: string): AtomData | null {
  return ATOMS[id] ?? null;
}
