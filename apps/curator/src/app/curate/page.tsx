"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useWalletConnection, WalletConnect } from "@wispr/wallet";

interface CurateItem {
  component: {
    id: string;
    name: string;
    description: string;
    url: string;
  };
  baseTriple: {
    id: string;
    subject: string;
    predicate: string;
    object: string;
    label: string;
  };
  nestedTriple: {
    subjectTriple: string;
    predicate: string;
    object: string;
    label: string;
  } | null;
  trustScore: number;
  wisPearerCount: number;
}

const TYPE_ICONS: Record<string, string> = {
  mcp: "🔌",
  skill: "🧠",
  model: "🤖",
  api: "⚡",
  sdk: "⚡",
  package: "📦",
  agent: "🛠️",
};

// Demo payload matching BLUEPRINT_HANDOFF spec
const DEMO_ITEMS: CurateItem[] = [
  {
    component: { id: "mcp-notion", name: "MCP Notion", description: "Model Context Protocol server for Notion — reads databases, pages, and syncs workspace content with your AI agent.", url: "https://github.com/makenotion/notion-mcp-server" },
    baseTriple: { id: "T1-mcp-notion", subject: "mcp-notion", predicate: "is-best-of", object: "mcp", label: "MCP Notion is-best-of mcp" },
    nestedTriple: { subjectTriple: "T1-mcp-notion", predicate: "in-context-of", object: "content-automation", label: "(MCP Notion is-best-of mcp) in-context-of content-automation" },
    trustScore: 9.1, wisPearerCount: 25,
  },
  {
    component: { id: "brand-voice-skill", name: "Brand Voice Skill", description: "AI service that analyzes your writing style from existing content and applies it to new drafts.", url: "https://wispear.ai/skills/brand-voice" },
    baseTriple: { id: "T1-brand-voice", subject: "brand-voice-skill", predicate: "is-best-of", object: "skill", label: "Brand Voice Skill is-best-of skill" },
    nestedTriple: { subjectTriple: "T1-brand-voice", predicate: "in-context-of", object: "content-creation", label: "(Brand Voice Skill is-best-of skill) in-context-of content-creation" },
    trustScore: 8.8, wisPearerCount: 10,
  },
  {
    component: { id: "mcp-twitter", name: "MCP Twitter", description: "Model Context Protocol server for Twitter — posts tweets, threads, and manages social presence.", url: "https://github.com/EnesCinr/twitter-mcp" },
    baseTriple: { id: "T1-mcp-twitter", subject: "mcp-twitter", predicate: "is-best-of", object: "mcp", label: "MCP Twitter is-best-of mcp" },
    nestedTriple: { subjectTriple: "T1-mcp-twitter", predicate: "in-context-of", object: "social-media", label: "(MCP Twitter is-best-of mcp) in-context-of social-media" },
    trustScore: 8.5, wisPearerCount: 16,
  },
  {
    component: { id: "claude-sonnet-4-5", name: "Claude Sonnet 4.5", description: "Anthropic's Claude Sonnet 4.5 — long-form generation, advanced reasoning, and precise tone control.", url: "https://docs.anthropic.com/en/docs/about-claude/models" },
    baseTriple: { id: "T1-claude-sonnet", subject: "claude-sonnet-4-5", predicate: "is-best-of", object: "model", label: "Claude Sonnet 4.5 is-best-of model" },
    nestedTriple: { subjectTriple: "T1-claude-sonnet", predicate: "in-context-of", object: "content-generation", label: "(Claude Sonnet 4.5 is-best-of model) in-context-of content-generation" },
    trustScore: 9.4, wisPearerCount: 42,
  },
];

function useBlueprint(): CurateItem[] {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const raw = searchParams.get("blueprint");
    if (raw) {
      try {
        return JSON.parse(atob(raw)) as CurateItem[];
      } catch { /* fallback */ }
    }
    return DEMO_ITEMS;
  }, [searchParams]);
}

type Vote = "support" | "oppose" | null;
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@wispr/ui";

const MOCK_ATOM = {
  id: "chainlink-data-feeds",
  name: "Chainlink Data Feeds",
  type: "api" as const,
  url: "https://docs.chain.link/data-feeds",
  description: "Real-time on-chain price oracles for crypto assets. Provides tamper-proof, decentralized price data for DeFi protocols.",
  autonomy: "high" as const,
};

const TYPES = [
  { value: "mcp", icon: "🔌", label: "MCP" },
  { value: "skill", icon: "🧠", label: "Skill" },
  { value: "package", icon: "📦", label: "Package" },
  { value: "api", icon: "⚡", label: "API" },
  { value: "model", icon: "🤖", label: "Model" },
  { value: "agent", icon: "🛠️", label: "Agent" },
];

const AUTONOMY = [
  { value: "low", label: "Low", description: "Needs human approval" },
  { value: "medium", label: "Medium", description: "Semi-autonomous" },
  { value: "high", label: "High", description: "Fully autonomous" },
];

export default function CuratePage() {
  const { isConnected } = useWalletConnection();
  const items = useBlueprint();
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [type, setType] = useState<string>(MOCK_ATOM.type);
  const [autonomy, setAutonomy] = useState<string>(MOCK_ATOM.autonomy);

  const handleVote = (tripleId: string, vote: Vote) => {
    setVotes((prev) => ({
      ...prev,
      [tripleId]: prev[tripleId] === vote ? null : vote,
    }));
  };

  const supportCount = Object.values(votes).filter((v) => v === "support").length;
  const opposeCount = Object.values(votes).filter((v) => v === "oppose").length;

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 page-header backdrop-blur-xl px-5 py-5">
        <h1 className="page-title">Curate</h1>
        <p className="text-sm text-text-secondary mt-1">
          Vote on contextual claims for each component
        </p>
      </div>

      <div className="relative w-full px-5 py-6">
        {/* Wallet gate */}
        {!isConnected && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-bg/70 backdrop-blur-sm">
            <span className="text-4xl">🔒</span>
            <h2 className="text-xl font-bold text-text-primary">Connect your wallet</h2>
            <p className="text-sm text-text-secondary max-w-[300px] text-center">
              Connect your wallet to vote on claims and stake $TRUST.
            </p>
            <WalletConnect />
          </div>
        )}

        {/* Summary + Add new */}
        <div className={`flex items-center justify-between mb-5 ${!isConnected ? "blur-sm" : ""}`}>
          <div className="flex items-center gap-4">
            {supportCount > 0 && (
              <span className="text-sm font-semibold text-pear">✓ {supportCount} supported</span>
            )}
            {opposeCount > 0 && (
              <span className="text-sm font-semibold text-red">✕ {opposeCount} opposed</span>
            )}
          </div>
          <a
            href="/curate/new"
            className="text-[13px] font-semibold text-accent hover:text-text-primary transition-colors"
          >
            + Add new component
          </a>
        </div>

        {/* Components */}
        <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ${!isConnected ? "blur-sm pointer-events-none" : ""}`}>
          {items.map((item) => {
            const tripleId = item.nestedTriple?.subjectTriple ?? item.baseTriple.id;
            const vote = votes[tripleId] ?? null;
            const claimLabel = item.nestedTriple?.label ?? item.baseTriple.label;
            const context = item.nestedTriple?.object ?? null;
            const typeIcon = TYPE_ICONS[item.baseTriple.object] ?? "📦";

            return (
              <div
                key={item.component.id}
                className={`bg-surface rounded-xl border p-4 flex flex-col gap-3 transition-all duration-200 ${
                  vote === "support"
                    ? "border-pear/40 shadow-[0_0_16px_rgba(212,255,71,0.1)]"
                    : vote === "oppose"
                    ? "border-red/30 opacity-60"
                    : "border-border hover:border-border-light"
                }`}
              >
                {/* Name + icon + pills */}
                <div className="flex items-center gap-3">
                  <span className="text-lg">{typeIcon}</span>
                  <span className="text-[14px] font-bold text-text-primary truncate flex-1">{item.component.name}</span>
                  <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-pear-soft text-pear border border-pear/20">
                    {item.baseTriple.object}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[12px] text-text-secondary leading-relaxed line-clamp-2">
                  {item.component.description}
                </p>

                {/* Context */}
                {context && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Context</span>
                    <span className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-accent-soft text-accent border border-accent/20 self-start">
                      {context.replace(/-/g, " ")}
                    </span>
                  </div>
                )}

                {/* Trust */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-amber">★ {item.trustScore.toFixed(1)}</span>
                  <span className="text-[11px] font-medium text-white">{item.wisPearerCount} wisPearers</span>
                </div>

                {/* View details */}
                <a
                  href={`/curate/${item.component.id}`}
                  className="text-[12px] font-semibold text-accent hover:text-text-primary transition-colors"
                >
                  View details →
                </a>

                {/* Vote buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleVote(tripleId, "support")}
                    className={`flex-1 h-9 rounded-lg flex items-center justify-center text-[12px] font-semibold gap-1 transition-all duration-200 ${
                      vote === "support"
                        ? "bg-pear text-bg border border-pear"
                        : "bg-transparent border border-pear/40 text-pear hover:bg-pear hover:text-bg"
                    }`}
                  >
                    ✓ Support
                  </button>
                  <button
                    onClick={() => handleVote(tripleId, "oppose")}
                    className={`flex-1 h-9 rounded-lg flex items-center justify-center text-[12px] font-semibold gap-1 transition-all duration-200 ${
                      vote === "oppose"
                        ? "bg-red text-white border border-red"
                        : "bg-transparent border border-red/40 text-red hover:bg-red hover:text-white"
                    }`}
                  >
                    ✕ Oppose
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit votes */}
        {isConnected && Object.keys(votes).length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              className="bg-pear font-bold text-[14px] px-8 py-3.5 rounded-xl shadow-[0_0_24px_rgba(212,255,71,0.2)] hover:shadow-[0_0_32px_rgba(212,255,71,0.3)] transition-all duration-300"
              style={{ color: "#06070f" }}
            >
              Submit {Object.keys(votes).length} vote{Object.keys(votes).length > 1 ? "s" : ""} on-chain
            </button>
          </div>
        )}
        {/* Save */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%",
            borderRadius: "12px",
            fontWeight: 700,
            fontSize: "15px",
            background: saving ? "rgba(212,255,71,0.4)" : "#d4ff47",
            color: saving ? "rgba(6,7,15,0.5)" : "#06070f",
            cursor: saving ? "wait" : "pointer",
            boxShadow: saving ? "none" : "0 0 24px rgba(212,255,71,0.2)",
            transition: "all 0.3s ease",
          }}
        >
          {saving ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <span style={{ width: "16px", height: "16px", border: "2px solid rgba(6,7,15,0.3)", borderTopColor: "#06070f", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
              Saving on-chain...
            </span>
          ) : (
            "Save atom"
          )}
        </Button>
      </div>
    </>
  );
}
