"use client";

import { Button } from "@wispr/ui";

const TRENDING = [
  { category: "DeFi", name: "Chainlink Data Feeds", trust: "2.4k $TRUST · 31 wisPearers" },
  { category: "MCP Server", name: "GitHub MCP", trust: "1.8k $TRUST · 24 wisPearers" },
  { category: "Package", name: "viem", trust: "1.2k $TRUST · 19 wisPearers" },
  { category: "LLM", name: "Claude Sonnet 4", trust: "3.1k $TRUST · 42 wisPearers" },
];

const VALIDATIONS = [
  {
    initials: "JL",
    type: "agree" as const,
    user: "jade.eth",
    action: "agrees with your stake on",
    target: "GitHub MCP",
    context: "in AI Agents",
    time: "2h",
  },
  {
    initials: "ZK",
    type: "dispute" as const,
    user: "zet.eth",
    action: "disputes your stake on",
    target: "Hardhat",
    context: "in DeFi",
    time: "5h",
  },
  {
    initials: "WZ",
    type: "agree" as const,
    user: "wieedze.eth",
    action: "agrees with your stake on",
    target: "Claude Opus 4",
    context: "in Agent Orchestration",
    time: "8h",
  },
];

export function RightPanel() {
  return (
    <aside className="w-[320px] shrink-0 sticky top-0 h-screen overflow-y-auto border-l border-border px-4 py-5 flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search components"
          className="w-full pl-9 pr-3 py-2.5 rounded-full bg-surface border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Trending */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="px-4 py-3 text-[15px] font-bold text-text-primary" style={{ fontFamily: "'Montserrat', 'Inter', sans-serif" }}>
          Trending
        </div>
        {TRENDING.map((item) => (
          <div key={item.name} className="px-4 py-3 border-t border-border hover:bg-hover transition-colors cursor-pointer">
            <div className="text-xs text-text-muted">{item.category}</div>
            <div className="text-sm font-semibold text-text-primary mt-0.5">{item.name}</div>
            <div className="text-xs text-text-secondary mt-0.5">{item.trust}</div>
          </div>
        ))}
        <div className="px-4 py-3 border-t border-border">
          <Button variant="ghost" size="sm" style={{ width: "100%", borderColor: "var(--color-border)", color: "var(--color-accent)" }}>
            Show more
          </Button>
        </div>
      </div>

      {/* Peer validations */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="px-4 py-3 text-[15px] font-bold text-text-primary" style={{ fontFamily: "'Montserrat', 'Inter', sans-serif" }}>
          Peer validations
        </div>
        {VALIDATIONS.map((v, i) => (
          <div key={i} className="px-4 py-3 border-t border-border flex gap-3">
            <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
              v.type === "agree"
                ? "bg-green/10 text-green border border-green/20"
                : "bg-red/10 text-red border border-red/20"
            }`}>
              {v.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-secondary leading-relaxed">
                <span className="font-semibold text-text-primary">{v.user}</span>{" "}
                {v.action}{" "}
                <span className="font-semibold text-accent">{v.target}</span>{" "}
                {v.context}
              </p>
              <div className="text-xs text-text-muted mt-1">{v.time} ago</div>
              <div className="flex gap-2 mt-2">
                <Button variant="ghost" size="sm" style={{ borderColor: "var(--color-green)", color: "var(--color-green)", padding: "2px 12px", fontSize: "12px" }}>
                  Agree
                </Button>
                <Button variant="ghost" size="sm" style={{ borderColor: "var(--color-red)", color: "var(--color-red)", padding: "2px 12px", fontSize: "12px" }}>
                  Dispute
                </Button>
              </div>
            </div>
          </div>
        ))}
        <div className="px-4 py-3 border-t border-border">
          <Button variant="ghost" size="sm" style={{ width: "100%", borderColor: "var(--color-border)", color: "var(--color-accent)" }}>
            Show more
          </Button>
        </div>
      </div>
    </aside>
  );
}
