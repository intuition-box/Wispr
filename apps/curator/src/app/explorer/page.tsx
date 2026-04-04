"use client";

import { useState } from "react";
import { Button, brand } from "@wispr/ui";

type CompType = "all" | "tool" | "skill" | "model" | "package";

const TYPE_STYLE: Record<string, { icon: string; gradient: string; border: string }> = {
  tool:    { icon: "🔌", gradient: "from-green/10 to-green/5",   border: "border-green/20" },
  skill:   { icon: "🧠", gradient: "from-purple/10 to-purple/5", border: "border-purple/20" },
  model:   { icon: "🤖", gradient: "from-accent/10 to-accent/5", border: "border-accent/20" },
  package: { icon: "📦", gradient: "from-amber/10 to-amber/5",   border: "border-amber/20" },
};

const TYPE_BADGE: Record<string, string> = {
  tool:    "bg-green/10 text-green border-green/20",
  skill:   "bg-purple/10 text-purple border-purple/20",
  model:   "bg-accent/10 text-accent border-accent/20",
  package: "bg-amber/10 text-amber border-amber/20",
};

const FILTERS: { label: string; value: CompType }[] = [
  { label: "All", value: "all" },
  { label: "Tool / MCP", value: "tool" },
  { label: "Skill", value: "skill" },
  { label: "Model", value: "model" },
  { label: "Package", value: "package" },
];

const COMPONENTS = [
  { id: "mcp-github", name: "MCP GitHub", type: "tool", description: "Let your agent read and write your repos via webhooks", contexts: ["ai-agents", "devops"], trust: "1.8k", curators: 24 },
  { id: "mcp-gmail", name: "MCP Gmail", type: "tool", description: "Send and read emails from your agent", contexts: ["content-automation"], trust: "920", curators: 13 },
  { id: "mcp-notion", name: "MCP Notion", type: "tool", description: "Reads databases and pages from Notion workspaces", contexts: ["content-automation"], trust: "1.4k", curators: 21 },
  { id: "mcp-twitter", name: "MCP Twitter", type: "tool", description: "Posts tweets and threads from your agent", contexts: ["social-media"], trust: "1.1k", curators: 16 },
  { id: "firecrawl-mcp", name: "Firecrawl MCP", type: "tool", description: "Scrape and crawl websites for structured data extraction", contexts: ["content-automation", "web-scraping"], trust: "780", curators: 11 },
  { id: "webhook-trigger", name: "webhook-trigger", type: "tool", description: "Triggers agent actions from external webhook events", contexts: ["ai-agents", "devops"], trust: "540", curators: 8 },
  { id: "world-id-minikit", name: "World ID MiniKit", type: "tool", description: "Verify unique humans with ZK proofs — sybil-resistant", contexts: ["web3-building", "identity"], trust: "1.6k", curators: 22 },
  { id: "chainlink-functions", name: "Chainlink Functions", type: "tool", description: "Run off-chain API calls and return results on-chain", contexts: ["defi", "web3-building"], trust: "2.1k", curators: 28 },
  { id: "chainlink-data-feeds", name: "Chainlink Data Feeds", type: "tool", description: "Real-time on-chain price oracles for crypto assets", contexts: ["defi"], trust: "2.4k", curators: 31 },
  { id: "chainlink-automation", name: "Chainlink Automation", type: "tool", description: "Automated on-chain execution triggered by conditions", contexts: ["defi", "web3-building"], trust: "1.9k", curators: 25 },
  { id: "flare-ftso", name: "Flare FTSO", type: "tool", description: "Decentralized price oracle updated every 90 seconds", contexts: ["defi"], trust: "870", curators: 12 },
  { id: "layerzero-oapp", name: "LayerZero OApp", type: "tool", description: "Cross-chain messaging and result propagation", contexts: ["web3-building"], trust: "1.3k", curators: 18 },
  { id: "circle-usdc-sdk", name: "Circle USDC SDK", type: "tool", description: "Programmatic USDC transfers and payment flows", contexts: ["defi", "web3-building"], trust: "1.5k", curators: 20 },
  { id: "ens", name: "ENS", type: "tool", description: "Human-readable Ethereum addresses (alice.eth)", contexts: ["web3-building", "identity"], trust: "2.0k", curators: 27 },
  { id: "walrus-storage", name: "Walrus Storage", type: "tool", description: "Immutable file storage with on-chain hash verification", contexts: ["web3-building"], trust: "680", curators: 9 },
  { id: "privy-embedded-wallet", name: "Privy Embedded Wallet", type: "tool", description: "Embedded wallet for seamless background transaction signing", contexts: ["web3-building", "defi"], trust: "1.2k", curators: 17 },
  { id: "1inch-fusion-plus-sdk", name: "1inch Fusion+ SDK", type: "tool", description: "Optimal swap execution with MEV protection and guaranteed slippage", contexts: ["defi"], trust: "1.7k", curators: 23 },
  { id: "code-review-skill", name: "code-review-skill", type: "skill", description: "Analyzes code diffs, detects bugs, and suggests fixes", contexts: ["ai-agents", "devops"], trust: "1.3k", curators: 19 },
  { id: "embeddings-matching-skill", name: "embeddings-matching-skill", type: "skill", description: "Semantic similarity matching between documents and profiles", contexts: ["content-automation"], trust: "890", curators: 12 },
  { id: "brand-voice-skill", name: "brand-voice-skill", type: "skill", description: "Analyzes writing style and applies it to new content", contexts: ["content-creation", "social-media"], trust: "760", curators: 10 },
  { id: "scheduling-skill", name: "scheduling-skill", type: "skill", description: "Cron-based task scheduling for recurring agent workflows", contexts: ["content-automation", "ai-agents"], trust: "640", curators: 9 },
  { id: "proof-of-delivery-skill", name: "proof-of-delivery-skill", type: "skill", description: "Verifies and timestamps file deliveries on-chain", contexts: ["web3-building"], trust: "420", curators: 6 },
  { id: "portfolio-rebalancing-skill", name: "portfolio-rebalancing-skill", type: "skill", description: "Calculates portfolio deviations and determines optimal swaps", contexts: ["defi"], trust: "950", curators: 14 },
  { id: "claude-sonnet-4-5", name: "Claude Sonnet 4.5", type: "model", description: "Long-form generation, reasoning, tone control — best for content and code", contexts: ["content-generation", "ai-agents"], trust: "3.1k", curators: 42 },
  { id: "claude-haiku-4-5", name: "Claude Haiku 4.5", type: "model", description: "Fast and cost-effective for batch processing and recurring tasks", contexts: ["ai-agents", "defi"], trust: "2.2k", curators: 33 },
  { id: "pkg-github-pr-review", name: "pkg:github-pr-review", type: "package", description: "Pre-built agent pipeline for automated GitHub PR reviews", contexts: ["ai-agents", "devops"], trust: "580", curators: 8 },
  { id: "pkg-job-scraper", name: "pkg:job-scraper", type: "package", description: "Daily job scraping + semantic profile matching pipeline", contexts: ["content-automation"], trust: "340", curators: 5 },
  { id: "pkg-content-creator", name: "pkg:content-creator", type: "package", description: "Notion-to-Twitter automated content publishing pipeline", contexts: ["content-creation", "social-media"], trust: "470", curators: 7 },
  { id: "pkg-prediction-market", name: "pkg:prediction-market", type: "package", description: "ETH prediction market with sybil-resistant human verification", contexts: ["defi", "web3-building"], trust: "620", curators: 9 },
  { id: "pkg-freelancer-autopay", name: "pkg:freelancer-autopay", type: "package", description: "Automated USDC payments triggered by file delivery proof", contexts: ["web3-building", "defi"], trust: "510", curators: 7 },
  { id: "pkg-portfolio-defi", name: "pkg:portfolio-defi", type: "package", description: "Autonomous DeFi portfolio rebalancing based on risk tolerance", contexts: ["defi"], trust: "730", curators: 11 },
];

const COMMUNITY_SETS = [
  { id: "cs-w2", initials: "W2", name: "GitHub PR Auto-Review", role: "Full Stack Web3", level: "Advanced", trust: "1.8k", preview: ["MCP GitHub", "code-review-skill", "Claude Sonnet 4.5"], locked: 1 },
  { id: "cs-w3", initials: "W3", name: "Daily Job Matcher", role: "Backend Dev", level: "Intermediate", trust: "890", preview: ["Firecrawl MCP", "embeddings-matching-skill", "MCP Gmail"], locked: 2 },
  { id: "cs-w4", initials: "W4", name: "Notion → Twitter Pipeline", role: "Content Creator", level: "Intermediate", trust: "1.1k", preview: ["MCP Notion", "brand-voice-skill", "MCP Twitter"], locked: 2 },
  { id: "cs-p2", initials: "P2", name: "ETH Prediction Market", role: "Smart Contract Dev", level: "Expert", trust: "2.4k", preview: ["World ID MiniKit", "Chainlink Functions", "Flare FTSO"], locked: 2 },
  { id: "cs-pa", initials: "PA", name: "Freelancer Autopay USDC", role: "Full Stack Web3", level: "Advanced", trust: "1.5k", preview: ["Walrus Storage", "Circle USDC SDK", "ENS"], locked: 2 },
  { id: "cs-p3", initials: "P3", name: "DeFi Portfolio Rebalancer", role: "DeFi Expert", level: "Expert", trust: "2.1k", preview: ["Chainlink Data Feeds", "1inch Fusion+ SDK", "Privy Embedded Wallet"], locked: 1 },
];

type Tab = "components" | "community";

export default function ExplorerPage() {
  const [activeTab, setActiveTab] = useState<Tab>("components");
  const [filter, setFilter] = useState<CompType>("all");
  const [stakedIds, setStagedIds] = useState<Set<string>>(new Set());

  const filtered = COMPONENTS
    .filter((c) => filter === "all" || c.type === filter)
    .sort((a, b) => {
      const aT = parseInt(a.trust.replace(/[^0-9]/g, "")) || 0;
      const bT = parseInt(b.trust.replace(/[^0-9]/g, "")) || 0;
      return bT - aT;
    });

  const toggleStake = (id: string) => {
    setStagedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg/65 backdrop-blur-xl border-b border-border px-5 py-3">
        <h1 className="text-xl font-bold text-text-primary">Explorer</h1>
        <p className="text-sm text-text-muted mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
          {COMPONENTS.length} components · {COMMUNITY_SETS.length} community bundles
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {(["components", "community"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3.5 text-sm font-medium text-center transition-colors relative
              ${activeTab === tab
                ? "text-text-primary font-bold"
                : "text-text-secondary hover:text-text-primary hover:bg-hover"
              }`}
          >
            {tab === "components" ? "Components" : "Community Sets"}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[3px] rounded-full bg-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Components tab */}
      {activeTab === "components" && (
        <>
          {/* Filters */}
          <div className="flex gap-2 px-5 py-3 border-b border-border overflow-x-auto">
            {FILTERS.map((f) => (
              <Button
                key={f.value}
                variant={filter === f.value ? "primary" : "ghost"}
                size="sm"
                onClick={() => setFilter(f.value)}
                style={{
                  borderRadius: "9999px",
                  whiteSpace: "nowrap",
                  ...(filter === f.value
                    ? { background: "var(--color-accent)", color: "#fff", border: "1px solid var(--color-accent)", boxShadow: "0 0 12px rgba(25, 144, 255, 0.3)" }
                    : { background: "transparent", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }
                  ),
                }}
              >
                {f.label}
              </Button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-border">
            {filtered.map((comp) => {
              const style = TYPE_STYLE[comp.type] ?? TYPE_STYLE.tool;
              const badge = TYPE_BADGE[comp.type] ?? TYPE_BADGE.tool;
              const isStaked = stakedIds.has(comp.id);

              return (
                <div
                  key={comp.id}
                  className="bg-bg p-5 flex flex-col gap-3 hover:bg-hover/50 transition-colors cursor-pointer group"
                >
                  {/* Top row */}
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${style.gradient} border ${style.border} flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform`}>
                      {style.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[15px] font-bold text-text-primary truncate">
                          {comp.name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${badge}`}>
                          {comp.type}
                        </span>
                      </div>
                      <p className="text-[13px] text-text-secondary mt-1 leading-relaxed line-clamp-2">
                        {comp.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/60">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-xs font-semibold text-amber">
                        <span className="text-sm">★</span> {comp.trust}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        <span className="text-sm">👥</span> {comp.curators}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); toggleStake(comp.id); }}
                      style={{
                        borderRadius: "9999px",
                        fontSize: "12px",
                        padding: "4px 14px",
                        ...(isStaked
                          ? { borderColor: "rgba(34, 197, 94, 0.4)", color: "var(--color-green)", background: "rgba(34, 197, 94, 0.1)", boxShadow: "0 0 8px rgba(34, 197, 94, 0.15)" }
                          : { borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }
                        ),
                      }}
                    >
                      {isStaked ? "Staked ✓" : "Stake"}
                    </Button>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-1.5 flex-wrap -mt-0.5">
                    {comp.contexts.map((ctx) => (
                      <span
                        key={ctx}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border text-text-muted"
                      >
                        {ctx}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Community Sets tab */}
      {activeTab === "community" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {COMMUNITY_SETS.map((set) => (
            <div
              key={set.id}
              className="bg-bg p-5 flex flex-col gap-3 hover:bg-hover/50 transition-colors cursor-pointer group"
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent/15 to-purple/15 border border-accent/20 flex items-center justify-center text-sm font-bold text-accent shrink-0 group-hover:scale-105 transition-transform">
                  {set.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-text-primary truncate">
                    {set.name}
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5">
                    {set.role} · {set.level}
                  </div>
                </div>
                <div className="text-sm font-bold text-amber flex items-center gap-1 shrink-0">
                  <span>★</span> {set.trust}
                </div>
              </div>

              {/* Preview chips */}
              <div className="flex flex-wrap gap-1.5">
                {set.preview.map((tool) => (
                  <span
                    key={tool}
                    className="text-xs px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-text-secondary"
                  >
                    {tool}
                  </span>
                ))}
                <span className="text-xs px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-text-muted opacity-50">
                  +{set.locked} locked
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-xs text-text-muted">
                  Stake to unlock full bundle
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  style={{
                    borderRadius: "9999px",
                    borderColor: "rgba(255, 204, 111, 0.4)",
                    color: "var(--color-amber)",
                    background: "rgba(255, 204, 111, 0.08)",
                    fontSize: "12px",
                    fontWeight: 700,
                    boxShadow: "0 0 8px rgba(255, 204, 111, 0.1)",
                  }}
                >
                  Stake $TRUST
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
