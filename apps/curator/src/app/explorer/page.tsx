"use client";

import { useState } from "react";
import { Button } from "@wispr/ui";

const COMMUNITY_SETS = [
  { id: "cs-w2", initials: "W2", name: "GitHub PR Auto-Review", role: "Full Stack Web3", level: "Advanced", trust: "1.8k", preview: ["MCP GitHub", "code-review-skill", "Claude Sonnet 4.5"], locked: 1 },
  { id: "cs-w3", initials: "W3", name: "Daily Job Matcher", role: "Backend Dev", level: "Intermediate", trust: "890", preview: ["Firecrawl MCP", "embeddings-matching-skill", "MCP Gmail"], locked: 2 },
  { id: "cs-w4", initials: "W4", name: "Notion → Twitter Pipeline", role: "Content Creator", level: "Intermediate", trust: "1.1k", preview: ["MCP Notion", "brand-voice-skill", "MCP Twitter"], locked: 2 },
  { id: "cs-p2", initials: "P2", name: "ETH Prediction Market", role: "Smart Contract Dev", level: "Expert", trust: "2.4k", preview: ["World ID MiniKit", "Chainlink Functions", "Flare FTSO"], locked: 2 },
  { id: "cs-pa", initials: "PA", name: "Freelancer Autopay USDC", role: "Full Stack Web3", level: "Advanced", trust: "1.5k", preview: ["Walrus Storage", "Circle USDC SDK", "ENS"], locked: 2 },
  { id: "cs-p3", initials: "P3", name: "DeFi Portfolio Rebalancer", role: "DeFi Expert", level: "Expert", trust: "2.1k", preview: ["Chainlink Data Feeds", "1inch Fusion+ SDK", "Privy Embedded Wallet"], locked: 1 },
];

export default function ExplorerPage() {
  const [stakedIds, setStagedIds] = useState<Set<string>>(new Set());

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
      <div className="sticky top-0 z-10 bg-bg/65 backdrop-blur-xl border-b border-border px-5 py-3">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Explorer</h1>
        <p className="text-sm text-text-primary mt-1">Community bundles curated by experts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
        {COMMUNITY_SETS.map((set) => {
          const isStaked = stakedIds.has(set.id);
          return (
            <div
              key={set.id}
              className="bg-bg p-5 flex flex-col gap-3 cursor-pointer group rounded-xl border border-border transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:border-accent/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent/15 to-purple/15 border border-accent/20 flex items-center justify-center text-sm font-bold text-accent shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(74,155,244,0.25)] transition-all duration-300">
                  {set.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-text-primary truncate">{set.name}</div>
                  <div className="text-xs text-text-secondary mt-0.5">{set.role} · {set.level}</div>
                </div>
                <div className="text-sm font-bold text-amber flex items-center gap-1 shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <span className="group-hover:animate-[spin_0.6s_ease-in-out_1]">★</span> {set.trust}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {set.preview.map((tool) => (
                  <span
                    key={tool}
                    className="text-xs px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-text-secondary transition-all duration-200 group-hover:border-accent/20 group-hover:bg-accent/5 hover:!bg-accent/15 hover:!border-accent/40 hover:!text-text-primary hover:scale-105 hover:shadow-[0_0_10px_rgba(74,155,244,0.15)] cursor-pointer active:scale-95"
                  >
                    {tool}
                  </span>
                ))}
                <span className="text-xs px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-text-muted opacity-50">
                  +{set.locked} locked
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-xs text-text-muted">Stake to unlock full bundle</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); toggleStake(set.id); }}
                  className="transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                  style={{
                    borderRadius: "9999px",
                    fontSize: "12px",
                    fontWeight: 700,
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    ...(isStaked
                      ? { borderColor: "rgba(34, 197, 94, 0.4)", color: "var(--color-green)", background: "rgba(34, 197, 94, 0.1)", boxShadow: "0 0 8px rgba(34, 197, 94, 0.15)" }
                      : { borderColor: "rgba(255, 204, 111, 0.4)", color: "var(--color-amber)", background: "rgba(255, 204, 111, 0.08)", boxShadow: "0 0 8px rgba(255, 204, 111, 0.1)" }
                    ),
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = isStaked ? "0 0 20px rgba(34, 197, 94, 0.35)" : "0 0 20px rgba(255, 204, 111, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = isStaked ? "0 0 8px rgba(34, 197, 94, 0.15)" : "0 0 8px rgba(255, 204, 111, 0.1)";
                  }}
                >
                  {isStaked ? "Staked ✓" : "Stake $TRUST"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
