"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useWalletConnection, WalletConnect } from "@wispr/wallet";
import { useAtoms, type OnChainAtom } from "@/hooks/useAtoms";
import { getNestedTripleId } from "@/lib/termIds";
import { Lock, Plug, Brain, Bot, Zap, Package, Wrench, AlertTriangle, Search } from "lucide-react";

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  mcp: Plug,
  skill: Brain,
  model: Bot,
  api: Zap,
  sdk: Zap,
  package: Package,
  agent: Wrench,
};

type Vote = "support" | "oppose" | null;

export default function CuratePage() {
  const { wallet, isConnected } = useWalletConnection();
  const { atoms, loading, error } = useAtoms();
  const searchParams = useSearchParams();
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pearBounce, setPearBounce] = useState(false);

  // Auto-stop bounce animation after 3s
  useEffect(() => {
    if (!pearBounce) return;
    const t = setTimeout(() => setPearBounce(false), 3000);
    return () => clearTimeout(t);
  }, [pearBounce]);

  // Lock scroll when wallet not connected
  useEffect(() => {
    document.body.style.overflow = isConnected ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isConnected]);

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

  const DEFAULT_AMOUNT = 1;
  const STEP = 1;

  const handleVote = (termId: string, vote: Vote) => {
    setVotes((prev) => {
      const toggled = prev[termId] === vote ? null : vote;
      if (!toggled) {
        setAmounts((a) => { const n = { ...a }; delete n[termId]; return n; });
      } else if (!amounts[termId]) {
        setAmounts((a) => ({ ...a, [termId]: DEFAULT_AMOUNT }));
      }
      return { ...prev, [termId]: toggled };
    });
  };

  const adjustAmount = (termId: string, delta: number) => {
    setAmounts((prev) => {
      const current = prev[termId] ?? DEFAULT_AMOUNT;
      const next = Math.max(STEP, current + delta);
      return { ...prev, [termId]: next };
    });
  };

  const supportCount = Object.values(votes).filter((v) => v === "support").length;
  const opposeCount = Object.values(votes).filter((v) => v === "oppose").length;
  const totalVotes = supportCount + opposeCount;
  const totalAmount = Object.entries(votes)
    .filter(([, v]) => v)
    .reduce((sum, [id]) => sum + (amounts[id] ?? DEFAULT_AMOUNT), 0);

  const toSlug = (atom: OnChainAtom) =>
    atom.name.toLowerCase().replace(/\+/g, "plus").replace(/[\s.]/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");

  // Build the tagline based on active context
  const tagline = activeContext
    ? `Is this the best tool for ${activeContext.replace(/-/g, " ")}?`
    : "Is this the best tool for the job?";

  // Submit votes on-chain via multiVault batch deposit
  const handleSubmit = async () => {
    if (!wallet?.multiVault || !wallet.address || totalVotes === 0) return;

    setSubmitting(true);
    setTxHash(null);
    setSubmitError(null);

    try {
      const multiVault = wallet.multiVault;

      const { ethers } = await import("ethers");
      const bondingConfig = await multiVault.getBondingCurveConfig();
      const defaultCurveId = bondingConfig[1];

      const zeroBig = BigInt(0);
      const termIds: string[] = [];
      const curveIds: any[] = [];
      const assets: any[] = [];
      const minShares: any[] = [];

      for (const atom of atoms) {
        const vote = votes[atom.term_id];
        if (!vote) continue;

        const ctx = activeContext ?? atom.contexts[0];
        if (!ctx) continue;

        const nestedTripleId = getNestedTripleId(atom.term_id, ctx);
        if (!nestedTripleId) continue;

        let depositTermId = nestedTripleId;
        if (vote === "oppose") {
          depositTermId = await multiVault.getCounterIdFromTripleId(nestedTripleId);
        }

        const amt = amounts[atom.term_id] ?? DEFAULT_AMOUNT;
        termIds.push(depositTermId);
        curveIds.push(defaultCurveId);
        assets.push(ethers.parseEther(amt.toString()));
        minShares.push(zeroBig);
      }

      if (termIds.length === 0) return;

      const totalValue = assets.reduce((sum: any, a: any) => sum + a, zeroBig);

      const tx = await multiVault.depositBatch(
        wallet.address,
        termIds,
        curveIds,
        assets,
        minShares,
        { value: totalValue }
      );

      const receipt = await tx.wait();
      setTxHash(receipt.hash);
      setPearBounce(true);
      setVotes({});
      setCartOpen(false);
    } catch (err) {
      console.error("Submit votes failed:", err);
      setSubmitError(
        err instanceof Error ? err.message.split("(")[0].trim() : "Transaction failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 page-header backdrop-blur-xl px-4 sm:px-5 py-4 sm:py-5">
        <h1 className="page-title">Wispear</h1>
      </div>

      {/* Wallet connect — always visible */}
      {!isConnected && (
        <div className="px-4 sm:px-5 pt-4 pb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl bg-surface border border-border">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Lock className="w-7 h-7 shrink-0 text-text-secondary" />
              <div>
                <h2 className="text-base sm:text-lg font-bold text-text-primary">Connect</h2>
                <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
                  Connect to express your Wispear and stake $TRUST.
                </p>
              </div>
            </div>
            <WalletConnect />
          </div>
        </div>
      )}

      <div className="relative w-full px-4 sm:px-5 py-6">
        {/* Blur overlay when not connected */}
        {!isConnected && (
          <div className="absolute inset-0 z-20 bg-bg/60 backdrop-blur-sm rounded-xl pointer-events-auto" />
        )}

        {/* Tagline */}
        <h2 className="text-xl font-bold text-text-primary mb-4">
          {tagline}
        </h2>

        {/* Context filter bubbles */}
        <div className="flex flex-wrap gap-2 mb-5">
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

        {/* Summary */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-muted">
              {filteredAtoms.length} component{filteredAtoms.length !== 1 ? "s" : ""}
            </span>
            {supportCount > 0 && (
              <span className="text-sm font-semibold text-pear">✓ {supportCount} yes</span>
            )}
            {opposeCount > 0 && (
              <span className="text-sm font-semibold text-red">✕ {opposeCount} no</span>
            )}
          </div>
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
            <AlertTriangle className="w-6 h-6 text-amber" />
            <p className="text-sm text-text-secondary">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredAtoms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Search className="w-6 h-6 text-text-muted" />
            <p className="text-sm text-text-secondary">No components found for this context</p>
          </div>
        )}

        {/* Components grid */}
        {!loading && !error && filteredAtoms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredAtoms.map((atom) => {
              const vote = votes[atom.term_id] ?? null;
              const TypeIcon = TYPE_ICONS[atom.componentType ?? ""] ?? Package;

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
                    <TypeIcon className="w-5 h-5 text-text-secondary shrink-0" />
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

                  {/* Yes / No buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleVote(atom.term_id, "support")}
                      className={`flex-1 h-9 rounded-lg flex items-center justify-center text-[12px] font-semibold gap-1 transition-all duration-200 ${
                        vote === "support"
                          ? "bg-pear text-bg border border-pear"
                          : "bg-transparent border border-pear/40 text-pear hover:bg-pear hover:text-bg"
                      }`}
                    >
                      ✓ Yes
                    </button>
                    <button
                      onClick={() => handleVote(atom.term_id, "oppose")}
                      className={`flex-1 h-9 rounded-lg flex items-center justify-center text-[12px] font-semibold gap-1 transition-all duration-200 ${
                        vote === "oppose"
                          ? "bg-red text-white border border-red"
                          : "bg-transparent border border-red/40 text-red hover:bg-red hover:text-white"
                      }`}
                    >
                      ✕ No
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Pear Cart */}
      {isConnected && (totalVotes > 0 || txHash) && (
        <>
          {/* Pear button — pulses green on success */}
          <button
            onClick={() => { setCartOpen(!cartOpen); }}
            className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
              pearBounce
                ? "bg-pear shadow-[0_0_32px_rgba(212,255,71,0.5),0_0_64px_rgba(212,255,71,0.25)] scale-110 animate-bounce"
                : "bg-pear shadow-[0_4px_24px_rgba(212,255,71,0.3)] hover:shadow-[0_4px_32px_rgba(212,255,71,0.45)] hover:scale-105"
            }`}
          >
            {pearBounce ? (
              <span className="text-bg text-xl font-bold">✓</span>
            ) : (
              <>
                <span className="text-2xl">🍐</span>
                {totalVotes > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-white text-[11px] font-bold flex items-center justify-center">
                    {totalVotes}
                  </span>
                )}
              </>
            )}
          </button>

          {/* Cart dropdown */}
          {cartOpen && (
            <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[300px] max-w-[300px] bg-surface border border-border rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.4)] overflow-hidden">
              {/* Success state */}
              {txHash ? (
                <div className="p-5 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-pear/20 flex items-center justify-center">
                    <span className="text-2xl">🍐</span>
                  </div>
                  <span className="text-[14px] font-bold text-pear">Votes submitted!</span>
                  <a
                    href={`https://explorer.intuition.systems/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-accent hover:text-pear transition-colors underline"
                  >
                    View on-chain ↗
                  </a>
                  <button
                    onClick={() => { setTxHash(null); setCartOpen(false); }}
                    className="text-[12px] text-text-muted hover:text-text-primary mt-1 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <div>
                      <span className="text-[13px] font-bold text-text-primary">Your votes</span>
                      {activeContext && (
                        <span className="text-[11px] text-accent ml-2">
                          in {activeContext.replace(/-/g, " ")}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="text-text-muted hover:text-text-primary text-[12px] transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Vote list */}
                  <div className="max-h-[280px] overflow-y-auto">
                    {atoms
                      .filter((a) => votes[a.term_id])
                      .map((a) => {
                        const v = votes[a.term_id]!;
                        const Icon = TYPE_ICONS[a.componentType ?? ""] ?? Package;
                        const ctx = activeContext ?? a.contexts[0];
                        const amt = amounts[a.term_id] ?? DEFAULT_AMOUNT;
                        return (
                          <div
                            key={a.term_id}
                            className="flex flex-col gap-1.5 px-4 py-2.5 border-b border-border/50 last:border-none"
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className="w-4 h-4 text-text-secondary shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="text-[13px] text-text-primary font-medium truncate">{a.name}</div>
                                {ctx && (
                                  <div className="text-[10px] text-accent font-semibold truncate">
                                    {ctx.replace(/-/g, " ")}
                                  </div>
                                )}
                              </div>
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                  v === "support"
                                    ? "bg-pear-soft text-pear"
                                    : "bg-red-soft text-red"
                                }`}
                              >
                                {v === "support" ? "Yes" : "No"}
                              </span>
                              <button
                                onClick={() => {
                                  setVotes((prev) => { const n = { ...prev }; delete n[a.term_id]; return n; });
                                  setAmounts((prev) => { const n = { ...prev }; delete n[a.term_id]; return n; });
                                }}
                                className="text-text-muted hover:text-text-primary text-[11px] transition-colors shrink-0"
                              >
                                ✕
                              </button>
                            </div>
                            {/* +/- amount control */}
                            <div className="flex items-center gap-1.5 ml-7">
                              <button
                                onClick={() => adjustAmount(a.term_id, -STEP)}
                                className="w-6 h-6 rounded-md bg-surface-2 border border-border text-text-muted hover:text-text-primary hover:border-border-light text-[13px] font-bold flex items-center justify-center transition-all"
                              >
                                −
                              </button>
                              <span className="text-[12px] font-mono font-semibold text-pear min-w-[60px] text-center">
                                {amt} $T
                              </span>
                              <button
                                onClick={() => adjustAmount(a.term_id, STEP)}
                                className="w-6 h-6 rounded-md bg-surface-2 border border-border text-text-muted hover:text-text-primary hover:border-border-light text-[13px] font-bold flex items-center justify-center transition-all"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Error */}
                  {submitError && (
                    <div className="px-4 py-2 text-[12px] text-red-400 bg-red-400/10 border-t border-red-400/20">
                      <AlertTriangle className="w-3.5 h-3.5 inline-block mr-1" /> {submitError}
                    </div>
                  )}

                  {/* Submit */}
                  <div className="px-4 py-3 border-t border-border">
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full bg-pear font-bold text-[13px] px-4 py-2.5 rounded-xl shadow-[0_0_16px_rgba(212,255,71,0.2)] hover:shadow-[0_0_24px_rgba(212,255,71,0.3)] transition-all duration-200 disabled:opacity-50"
                      style={{ color: "#06070f" }}
                    >
                      {submitting
                        ? "Submitting..."
                        : `🍐 Submit ${totalVotes} vote${totalVotes > 1 ? "s" : ""} — ${totalAmount} $T`}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
