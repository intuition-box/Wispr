"use client";

import { useRouter } from "next/navigation";

// All community sets — all components deployed on-chain (Intuition L3)
const COMMUNITY_SETS = [
  { id: "cs-w2", initials: "W2", name: "GitHub PR Auto-Review", role: "Full Stack Web3", level: "Advanced", trust: "1.8k", preview: [
    { name: "MCP GitHub", atomId: "mcp-github" },
    { name: "Code Review Skill", atomId: "code-review-skill" },
    { name: "Claude Sonnet 4.5", atomId: "claude-sonnet-4-5" },
  ]},
  { id: "cs-w3", initials: "W3", name: "Daily Job Matcher", role: "Backend Dev", level: "Intermediate", trust: "890", preview: [
    { name: "Firecrawl MCP", atomId: "firecrawl-mcp" },
    { name: "Embeddings Matching Skill", atomId: "embeddings-matching-skill" },
    { name: "MCP Gmail", atomId: "mcp-gmail" },
    { name: "Claude Haiku 4.5", atomId: "claude-haiku-4-5" },
  ]},
  { id: "cs-w4", initials: "W4", name: "Notion → Twitter Pipeline", role: "Content Creator", level: "Intermediate", trust: "1.1k", preview: [
    { name: "MCP Notion", atomId: "mcp-notion" },
    { name: "Brand Voice Skill", atomId: "brand-voice-skill" },
    { name: "MCP Twitter", atomId: "mcp-twitter" },
    { name: "Claude Sonnet 4.5", atomId: "claude-sonnet-4-5" },
  ]},
  { id: "cs-p3", initials: "P3", name: "DeFi Portfolio Rebalancer", role: "DeFi Expert", level: "Expert", trust: "2.1k", preview: [
    { name: "Chainlink Data Feeds", atomId: "chainlink-data-feeds" },
    { name: "1inch Fusion+ SDK", atomId: "1inch-fusion-plus-sdk" },
    { name: "Privy Embedded Wallet", atomId: "privy-embedded-wallet" },
  ]},
];

export default function ExplorerPage() {
  const router = useRouter();

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 page-header backdrop-blur-xl px-5 py-5">
        <h1 className="page-title">Explorer</h1>
        <p className="text-sm text-text-secondary mt-1">
          Community bundles curated by experts
        </p>
      </div>

      {/* Community Sets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
        {COMMUNITY_SETS.map((set) => (
          <div
            key={set.id}
            className="bg-bg p-5 flex flex-col gap-3 cursor-pointer group rounded-xl border border-border transition-colors duration-200 hover:border-border-light hover:bg-surface/50"
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent/15 to-purple/15 border border-accent/20 flex items-center justify-center text-sm font-bold text-accent shrink-0">
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

            {/* Preview chips — clickable to atom detail */}
            <div className="flex flex-wrap gap-1.5">
              {set.preview.map((tool) => (
                <span
                  key={tool.atomId}
                  onClick={(e) => { e.stopPropagation(); router.push(`/curate/${tool.atomId}`); }}
                  className="text-xs px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-text-secondary transition-colors duration-200 hover:border-accent/30 hover:text-text-primary cursor-pointer"
                >
                  {tool.name}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <span className="text-xs text-text-muted flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green rounded-full" />
                All components on-chain
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); router.push(`/curate/${set.preview[0].atomId}`); }}
                className="text-[12px] font-semibold text-accent hover:text-text-primary bg-transparent transition-colors duration-200"
              >
                View details →
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
