"use client";

import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { usePositions } from "@/hooks/usePositions";
import { Globe, FileText, Palette, Cog, PenLine, ClipboardList, Rocket, Sprout, Wrench, Zap, Brain, AlertTriangle, Target, Plug, Bot, Package } from "lucide-react";

const COMP_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  mcp: Plug,
  skill: Brain,
  model: Bot,
  api: Zap,
  sdk: Zap,
  package: Package,
  agent: Wrench,
};

const ROLE_LABELS: Record<string, string> = {
  "full-stack-web3": "Full Stack Web3 Developer",
  "smart-contract-dev": "Smart Contract Developer",
  "frontend-dev": "Frontend Developer",
  "backend-dev": "Backend Developer",
  designer: "Designer",
  "product-manager": "Product Manager",
  founder: "Founder",
};

const ROLE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  "full-stack-web3": Globe,
  "smart-contract-dev": FileText,
  "frontend-dev": Palette,
  "backend-dev": Cog,
  designer: PenLine,
  "product-manager": ClipboardList,
  founder: Rocket,
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

const LEVEL_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  beginner: Sprout,
  intermediate: Wrench,
  advanced: Zap,
  expert: Brain,
};

function formatValue(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  if (v >= 1) return v.toFixed(2);
  if (v >= 0.01) return v.toFixed(3);
  if (v === 0) return "0";
  return v.toFixed(4);
}

function shortenAddress(addr: string): string {
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function PublicDashboardPage() {
  const params = useParams<{ address: string }>();
  const searchParams = useSearchParams();
  const address = params.address;

  const profile = useMemo(() => ({
    role: searchParams.get("role") ?? "full-stack-web3",
    level: searchParams.get("level") ?? "advanced",
  }), [searchParams]);

  const { positions, loading, error } = usePositions(address);

  const roleLabel = ROLE_LABELS[profile.role] ?? profile.role;
  const RoleIcon = ROLE_ICON[profile.role] ?? Globe;
  const levelLabel = LEVEL_LABELS[profile.level] ?? profile.level;
  const LevelIcon = LEVEL_ICON[profile.level] ?? Sprout;

  const totalValue = positions.reduce((s, p) => s + p.currentValue, 0);
  const supportCount = positions.filter((p) => p.vote === "support").length;
  const opposeCount = positions.filter((p) => p.vote === "oppose").length;

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 page-header backdrop-blur-xl px-4 sm:px-5 py-4 sm:py-5">
        <h1 className="page-title">Dashboard</h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Positions for {shortenAddress(address)}
        </p>
      </div>

      <div className="relative w-full px-4 sm:px-5 py-6">
        <div className="flex gap-6">
          {/* Left — Positions */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-surface rounded-xl border border-border p-4 text-center">
                <div className="text-xl font-bold text-pear">{positions.length}</div>
                <div className="text-[11px] text-text-secondary mt-1">Positions</div>
              </div>
              <div className="bg-surface rounded-xl border border-border p-4 text-center">
                <div className="text-xl font-bold text-white">{formatValue(totalValue)} $T</div>
                <div className="text-[11px] text-text-secondary mt-1">Total value</div>
              </div>
              <div className="bg-surface rounded-xl border border-border p-4 text-center">
                <div className="text-xl font-bold text-pear">{supportCount}</div>
                <div className="text-[11px] text-text-secondary mt-1">Support / <span className="text-red">{opposeCount}</span> Oppose</div>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-pear/30 border-t-pear rounded-full animate-spin" />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex flex-col items-center justify-center py-20 gap-2">
                <AlertTriangle className="w-6 h-6 text-amber" />
                <p className="text-sm text-text-secondary">{error}</p>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && positions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-2">
                <span className="text-2xl">🍐</span>
                <p className="text-sm text-text-secondary">No positions yet.</p>
              </div>
            )}

            {/* Positions */}
            {!loading && !error && positions.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-white">Positions</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-semibold text-pear">✓ {supportCount} supported</span>
                    <span className="text-[12px] font-semibold text-red">✕ {opposeCount} opposed</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {positions.map((pos) => (
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
                        {(() => { const I = COMP_TYPE_ICONS[pos.componentType ?? ""] ?? Package; return <I className="w-5 h-5 text-text-secondary" />; })()}
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
                      {pos.context && (
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">Context</span>
                          <span className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-accent-soft text-accent border border-accent/20 self-start">
                            {pos.context.replace(/-/g, " ")}
                          </span>
                        </div>
                      )}

                      {/* Component type */}
                      {pos.componentType && (
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-pear-soft text-pear border border-pear/20 self-start">
                          {pos.componentType}
                        </span>
                      )}

                      {/* Value */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-text-secondary">Type</span>
                          <span className="text-[12px] font-semibold text-text-muted">
                            {pos.type === "atom" ? "Atom" : "Triple"}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] text-text-secondary">Value</span>
                          <span className="text-[13px] font-bold text-pear">
                            {formatValue(pos.currentValue)} $T
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Persona card */}
          <aside className="w-[300px] shrink-0 hidden xl:flex flex-col gap-6 sticky top-24 self-start">
            {/* Profile card */}
            <div className="bg-surface rounded-xl border border-border p-5 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center">
                <RoleIcon className="w-8 h-8 text-accent" />
              </div>
              <div className="text-center">
                <h3 className="text-[16px] font-bold text-white">{roleLabel}</h3>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <LevelIcon className="w-4 h-4 text-accent" />
                  <span className="text-[13px] font-semibold text-accent">{levelLabel} in AI</span>
                </div>
                <p className="text-[11px] text-text-secondary mt-2 font-mono">
                  {shortenAddress(address)}
                </p>
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
                <Target className="w-4 h-4" /> Recommended for you
              </h3>
              <p className="text-[11px] text-text-secondary">
                Based on profile as {roleLabel}
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
