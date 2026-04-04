"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useWalletConnection, WalletConnect } from "@wispr/wallet";
import { useAtoms, type OnChainAtom } from "@/hooks/useAtoms";

const TYPE_ICONS: Record<string, string> = {
  mcp: "🔌",
  skill: "🧠",
  model: "🤖",
  api: "⚡",
  sdk: "⚡",
  package: "📦",
  agent: "🛠️",
};

type Vote = "support" | "oppose" | null;

export default function CuratePage() {
  const { isConnected } = useWalletConnection();
  const { atoms, loading, error } = useAtoms();
  const searchParams = useSearchParams();
  const [votes, setVotes] = useState<Record<string, Vote>>({});

  // Extract pre-selected context from blueprint URL param
  const preSelectedContext = useMemo(() => {
    const raw = searchParams.get("blueprint");
    if (!raw) return null;
    try {
      const items = JSON.parse(atob(raw));
      const ctx = items.find((i: any) => i.nestedTriple?.object)?.nestedTriple?.object;
      return ctx ?? null;
    } catch {
      return null;
    }
  }, [searchParams]);

  const [activeContext, setActiveContext] = useState<string | null>(preSelectedContext);

  // Extract unique contexts from all atoms
  const allContexts = useMemo(() => {
    const ctxSet = new Set<string>();
    atoms.forEach((atom) => {
      atom.contexts.forEach((ctx) => ctxSet.add(ctx));
    });
    return Array.from(ctxSet).sort();
  }, [atoms]);

  // Filter atoms by selected context
  const filteredAtoms = useMemo(() => {
    if (!activeContext) return atoms;
    return atoms.filter((atom) => atom.contexts.includes(activeContext));
  }, [atoms, activeContext]);

  const handleVote = (termId: string, vote: Vote) => {
    setVotes((prev) => ({
      ...prev,
      [termId]: prev[termId] === vote ? null : vote,
    }));
  };

  const supportCount = Object.values(votes).filter((v) => v === "support").length;
  const opposeCount = Object.values(votes).filter((v) => v === "oppose").length;

  const toSlug = (atom: OnChainAtom) =>
    atom.name.toLowerCase().replace(/[\s+]/g, "-").replace(/[^a-z0-9-]/g, "");

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

        {/* Context filter bubbles */}
        <div className={`flex flex-wrap gap-2 mb-5 ${!isConnected ? "blur-sm" : ""}`}>
          <button
            onClick={() => setActiveContext(null)}
            className={`text-[12px] font-semibold px-4 py-1.5 rounded-full border transition-all duration-200 ${
              activeContext === null
                ? "bg-pear text-bg border-pear"
                : "bg-transparent text-text-secondary border-border hover:border-border-light hover:text-text-primary"
            }`}
          >
            All
          </button>
          {allContexts.map((ctx) => (
            <button
              key={ctx}
              onClick={() => setActiveContext(activeContext === ctx ? null : ctx)}
              className={`text-[12px] font-semibold px-4 py-1.5 rounded-full border transition-all duration-200 ${
                activeContext === ctx
                  ? "bg-accent text-bg border-accent"
                  : "bg-transparent text-text-secondary border-border hover:border-border-light hover:text-text-primary"
              }`}
            >
              {ctx.replace(/-/g, " ")}
            </button>
          ))}
        </div>

        {/* Summary + Add new */}
        <div className={`flex items-center justify-between mb-5 ${!isConnected ? "blur-sm" : ""}`}>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-muted">
              {filteredAtoms.length} component{filteredAtoms.length !== 1 ? "s" : ""}
            </span>
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

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-pear/30 border-t-pear rounded-full animate-spin" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <span className="text-2xl">⚠️</span>
            <p className="text-sm text-text-secondary">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredAtoms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <span className="text-2xl">🔍</span>
            <p className="text-sm text-text-secondary">No components found for this context</p>
          </div>
        )}

        {/* Components grid */}
        {!loading && !error && filteredAtoms.length > 0 && (
          <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ${!isConnected ? "blur-sm pointer-events-none" : ""}`}>
            {filteredAtoms.map((atom) => {
              const vote = votes[atom.term_id] ?? null;
              const typeIcon = TYPE_ICONS[atom.componentType ?? ""] ?? "📦";

              return (
                <div
                  key={atom.term_id}
                  className={`bg-surface rounded-xl border p-4 flex flex-col gap-3 transition-all duration-200 ${
                    vote === "support"
                      ? "border-pear/40 shadow-[0_0_16px_rgba(212,255,71,0.1)]"
                      : vote === "oppose"
                      ? "border-red/30 opacity-60"
                      : "border-border hover:border-border-light"
                  }`}
                >
                  {/* Name + icon + type pill */}
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{typeIcon}</span>
                    <span className="text-[14px] font-bold text-text-primary truncate flex-1">{atom.name}</span>
                    {atom.componentType && (
                      <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-pear-soft text-pear border border-pear/20">
                        {atom.componentType}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-[12px] text-text-secondary leading-relaxed line-clamp-2">
                    {atom.description}
                  </p>

                  {/* Contexts + trust */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {atom.contexts.map((ctx) => (
                        <span
                          key={ctx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-soft text-accent border border-accent/20"
                        >
                          {ctx.replace(/-/g, " ")}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-semibold text-amber">★ {atom.totalMarketCap}</span>
                      <span className="text-[10px] text-text-muted">{atom.positionCount} stakers</span>
                    </div>
                  </div>

                  {/* View details */}
                  <Link
                    href={`/curate/${toSlug(atom)}`}
                    className="text-[12px] font-semibold text-accent hover:text-text-primary transition-colors"
                  >
                    View details →
                  </Link>

                  {/* Vote buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleVote(atom.term_id, "support")}
                      className={`flex-1 h-9 rounded-lg flex items-center justify-center text-[12px] font-semibold gap-1 transition-all duration-200 ${
                        vote === "support"
                          ? "bg-pear text-bg border border-pear"
                          : "bg-transparent border border-pear/40 text-pear hover:bg-pear hover:text-bg"
                      }`}
                    >
                      ✓ Support
                    </button>
                    <button
                      onClick={() => handleVote(atom.term_id, "oppose")}
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
        )}

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
      </div>
    </>
  );
}
