"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useWalletConnection, WalletConnect } from "@wispr/wallet";

const ROLE_LABELS: Record<string, string> = {
  "full-stack-web3": "Full Stack Web3 Developer",
  "smart-contract-dev": "Smart Contract Developer",
  "frontend-dev": "Frontend Developer",
  "backend-dev": "Backend Developer",
  designer: "Designer",
  "product-manager": "Product Manager",
  founder: "Founder",
};

const ROLE_EMOJI: Record<string, string> = {
  "full-stack-web3": "🌐",
  "smart-contract-dev": "📜",
  "frontend-dev": "🎨",
  "backend-dev": "⚙️",
  designer: "✏️",
  "product-manager": "📋",
  founder: "🚀",
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

const LEVEL_EMOJI: Record<string, string> = {
  beginner: "🌱",
  intermediate: "🔧",
  advanced: "⚡",
  expert: "🧠",
};

interface Position {
  id: string;
  name: string;
  type: string;
  typeIcon: string;
  context: string;
  vote: "support" | "oppose";
  staked: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
}

const DEMO_POSITIONS: Position[] = [
  { id: "mcp-notion", name: "MCP Notion", type: "mcp", typeIcon: "🔌", context: "content automation", vote: "support", staked: 120, currentValue: 148, pnl: 28, pnlPercent: 23.3 },
  { id: "brand-voice-skill", name: "Brand Voice Skill", type: "skill", typeIcon: "🧠", context: "content creation", vote: "support", staked: 80, currentValue: 95, pnl: 15, pnlPercent: 18.7 },
  { id: "mcp-twitter", name: "MCP Twitter", type: "mcp", typeIcon: "🔌", context: "social media", vote: "oppose", staked: 60, currentValue: 42, pnl: -18, pnlPercent: -30.0 },
  { id: "claude-sonnet-4-5", name: "Claude Sonnet 4.5", type: "model", typeIcon: "🤖", context: "content generation", vote: "support", staked: 200, currentValue: 267, pnl: 67, pnlPercent: 33.5 },
  { id: "chainlink-data-feeds", name: "Chainlink Data Feeds", type: "api", typeIcon: "⚡", context: "defi", vote: "support", staked: 150, currentValue: 183, pnl: 33, pnlPercent: 22.0 },
  { id: "1inch-fusion-plus-sdk", name: "1inch Fusion+ SDK", type: "sdk", typeIcon: "⚡", context: "defi", vote: "oppose", staked: 90, currentValue: 72, pnl: -18, pnlPercent: -20.0 },
];

function useProfile() {
  const searchParams = useSearchParams();
  return useMemo(() => ({
    role: searchParams.get("role") ?? "full-stack-web3",
    level: searchParams.get("level") ?? "advanced",
  }), [searchParams]);
}

export default function DashboardPage() {
  const { isConnected } = useWalletConnection();
  const profile = useProfile();

  const roleLabel = ROLE_LABELS[profile.role] ?? profile.role;
  const roleEmoji = ROLE_EMOJI[profile.role] ?? "👤";
  const levelLabel = LEVEL_LABELS[profile.level] ?? profile.level;
  const levelEmoji = LEVEL_EMOJI[profile.level] ?? "🌱";

  const totalStaked = DEMO_POSITIONS.reduce((s, p) => s + p.staked, 0);
  const totalValue = DEMO_POSITIONS.reduce((s, p) => s + p.currentValue, 0);
  const totalPnl = totalValue - totalStaked;
  const totalPnlPercent = totalStaked > 0 ? (totalPnl / totalStaked) * 100 : 0;

  const supportCount = DEMO_POSITIONS.filter((p) => p.vote === "support").length;
  const opposeCount = DEMO_POSITIONS.filter((p) => p.vote === "oppose").length;

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 page-header backdrop-blur-xl px-5 py-5">
        <h1 className="page-title">Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">
          Your positions and curation P&L
        </p>
      </div>

      <div className="relative w-full px-5 py-6">
        {/* Wallet gate */}
        {!isConnected && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-bg/70 backdrop-blur-sm">
            <span className="text-4xl">🔒</span>
            <h2 className="text-xl font-bold text-white">Connect your wallet</h2>
            <p className="text-sm text-text-secondary max-w-[300px] text-center">
              Connect your wallet to see your curation positions.
            </p>
            <WalletConnect />
          </div>
        )}

        <div className={`flex gap-6 ${!isConnected ? "blur-sm pointer-events-none" : ""}`}>
          {/* Left — P&L + Positions */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">

            {/* P&L summary cards */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-surface rounded-xl border border-border p-4 text-center">
                <div className="text-xl font-bold text-pear">{totalStaked} $T</div>
                <div className="text-[11px] text-text-secondary mt-1">Total staked</div>
              </div>
              <div className="bg-surface rounded-xl border border-border p-4 text-center">
                <div className="text-xl font-bold text-white">{totalValue} $T</div>
                <div className="text-[11px] text-text-secondary mt-1">Current value</div>
              </div>
              <div className="bg-surface rounded-xl border border-border p-4 text-center">
                <div className={`text-xl font-bold ${totalPnl >= 0 ? "text-pear" : "text-red"}`}>
                  {totalPnl >= 0 ? "+" : ""}{totalPnl} $T
                </div>
                <div className="text-[11px] text-text-secondary mt-1">Total P&L</div>
              </div>
              <div className="bg-surface rounded-xl border border-border p-4 text-center">
                <div className={`text-xl font-bold ${totalPnlPercent >= 0 ? "text-pear" : "text-red"}`}>
                  {totalPnlPercent >= 0 ? "+" : ""}{totalPnlPercent.toFixed(1)}%
                </div>
                <div className="text-[11px] text-text-secondary mt-1">ROI</div>
              </div>
            </div>

            {/* Positions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white">Your positions</h2>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-semibold text-pear">✓ {supportCount} supported</span>
                  <span className="text-[12px] font-semibold text-red">✕ {opposeCount} opposed</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEMO_POSITIONS.map((pos) => (
                  <div
                    key={pos.id}
                    className={`bg-surface rounded-xl border p-4 flex flex-col gap-3 transition-colors duration-200 ${
                      pos.vote === "support"
                        ? "border-pear/30"
                        : "border-red/30"
                    }`}
                  >
                    {/* Name + type */}
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{pos.typeIcon}</span>
                      <span className="text-[14px] font-bold text-white truncate flex-1">{pos.name}</span>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        pos.vote === "support"
                          ? "bg-pear-soft text-pear border border-pear/20"
                          : "bg-red-soft text-red border border-red/20"
                      }`}>
                        {pos.vote === "support" ? "✓ Support" : "✕ Oppose"}
                      </span>
                    </div>

                    {/* Context */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">Context</span>
                      <span className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-accent-soft text-accent border border-accent/20 self-start">
                        {pos.context}
                      </span>
                    </div>

                    {/* P&L */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-text-secondary">Staked</span>
                        <span className="text-[13px] font-semibold text-white">{pos.staked} $T</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-text-secondary">Value</span>
                        <span className="text-[13px] font-semibold text-white">{pos.currentValue} $T</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-text-secondary">P&L</span>
                        <span className={`text-[13px] font-bold ${pos.pnl >= 0 ? "text-pear" : "text-red"}`}>
                          {pos.pnl >= 0 ? "+" : ""}{pos.pnl} $T ({pos.pnlPercent >= 0 ? "+" : ""}{pos.pnlPercent.toFixed(1)}%)
                        </span>
                      </div>
                    </div>

                    {/* View details */}
                    <a
                      href={`/curate/${pos.id}`}
                      className="text-[12px] font-semibold text-accent hover:text-white transition-colors"
                    >
                      View details →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Persona card */}
          <aside className="w-[300px] shrink-0 hidden lg:flex flex-col gap-6 sticky top-24 self-start">
            {/* Profile card */}
            <div className="bg-surface rounded-xl border border-border p-5 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-3xl">
                {roleEmoji}
              </div>
              <div className="text-center">
                <h3 className="text-[16px] font-bold text-white">{roleLabel}</h3>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <span>{levelEmoji}</span>
                  <span className="text-[13px] font-semibold text-accent">{levelLabel} in AI</span>
                </div>
              </div>
              <div className="w-full h-px bg-border" />
              <div className="grid grid-cols-2 gap-3 w-full">
                <div className="text-center">
                  <div className="text-lg font-bold text-pear">{supportCount}</div>
                  <div className="text-[10px] text-text-secondary">Supported</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red">{opposeCount}</div>
                  <div className="text-[10px] text-text-secondary">Opposed</div>
                </div>
              </div>
            </div>

            {/* Recommended contexts */}
            <div className="bg-surface rounded-xl border border-border p-5 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🎯</span> Recommended for you
              </h3>
              <p className="text-[11px] text-text-secondary">
                Based on your profile as {roleLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.role.includes("web3") || profile.role.includes("contract")
                  ? ["defi", "web3 building", "smart contracts"].map((ctx) => (
                      <span key={ctx} className="text-[11px] font-semibold px-3 py-1 rounded-full bg-accent-soft text-accent border border-accent/20">{ctx}</span>
                    ))
                  : ["content automation", "productivity", "ai agents"].map((ctx) => (
                      <span key={ctx} className="text-[11px] font-semibold px-3 py-1 rounded-full bg-accent-soft text-accent border border-accent/20">{ctx}</span>
                    ))
                }
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
