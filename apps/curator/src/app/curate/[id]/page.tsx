"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@wispr/ui";
import { useWalletConnection } from "@wispr/wallet";
import { getAtom, ATOMS } from "@/data/atoms";
import { getTermId, getContextsByTermId, getNestedTripleId } from "@/lib/termIds";
import { StakeModal } from "@/components/StakeModal";
import { useStakingHistory } from "@/hooks/useStakingHistory";

const TRENDING = Object.values(ATOMS).slice(0, 5).map((a, i) => ({
  name: a.name,
  type: a.type.toUpperCase(),
  trust: ["2.4k", "1.8k", "1.7k", "1.4k", "1.1k"][i],
  change: ["+12%", "+8%", "+21%", "+5%", "+15%"][i],
}));

const TOP_CURATORS = [
  { name: "bob.eth", totalStaked: "4.2k", atoms: 18, avatar: "B" },
  { name: "buildr.eth", totalStaked: "3.8k", atoms: 14, avatar: "B" },
  { name: "alice.eth", totalStaked: "2.9k", atoms: 22, avatar: "A" },
  { name: "nodo.eth", totalStaked: "1.6k", atoms: 9, avatar: "N" },
  { name: "frank.eth", totalStaked: "1.1k", atoms: 7, avatar: "F" },
];

export default function AtomDetailPage() {
  const params = useParams();
  const atomId = params.id as string;
  const atom = getAtom(atomId);

  const { wallet, isConnected, connect } = useWalletConnection();
  const atomTermId = getTermId(atomId);
  const contexts = atomTermId ? getContextsByTermId(atomTermId) : [];
  const nestedTripleId = atomTermId && contexts[0] ? getNestedTripleId(atomTermId, contexts[0]) : null;
  const stakeTermId = nestedTripleId ?? atomTermId;
  const { events: stakingEvents, loading: historyLoading } = useStakingHistory(stakeTermId);

  const [showShare, setShowShare] = useState(false);
  const [showStake, setShowStake] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!atom) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <span className="text-4xl">🔍</span>
        <h2 className="text-xl font-bold text-text-primary">Atom not found</h2>
        <p className="text-sm text-text-secondary">No on-chain data for &quot;{atomId}&quot;</p>
        <Link href="/explorer" className="text-sm text-accent hover:underline">← Back to Explorer</Link>
      </div>
    );
  }

  return (
    <>
      {/* Header — atom name as page title */}
      <div className="sticky top-0 z-10 page-header backdrop-blur-xl px-5 py-5">
        <Link href="/curate" className="text-xs text-text-muted hover:text-pear transition-colors mb-2 inline-block">
          ← Back to Curate
        </Link>
        <h1 className="page-title">{atom.name}</h1>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6 px-5 py-8">

        {/* Left — Main content */}
        <div className="flex-1 min-w-0 flex flex-col gap-8">
          {/* Description + pills + URL */}
          <div className="flex flex-col gap-3">
            <p className="text-[14px] text-text-secondary leading-relaxed">
              {atom.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-pear-soft text-pear border border-pear/20">
                {atom.type}
              </span>
              {atom.contexts.map((ctx) => (
                <span key={ctx} className="text-[11px] font-semibold px-3 py-1 rounded-full bg-accent-soft text-accent border border-accent/20">
                  {ctx.replace(/-/g, " ")}
                </span>
              ))}
            </div>
            <a
              href={atom.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-accent hover:text-pear transition-colors"
            >
              {atom.url} ↗
            </a>
          </div>

          {/* Chart + Stats side by side */}
          <div className="flex gap-4">
            {/* Chart */}
            <div className="flex-1 min-w-0 flex flex-col">
              <h3 className="text-sm font-semibold text-text-primary mb-3">$TRUST staked over time</h3>
              <div className="bg-surface rounded-xl border border-border p-4 transition-all duration-200 hover:border-border-light flex-1 flex items-center">
                <svg viewBox="0 0 500 160" className="w-full h-full">
                  <defs>
                    <linearGradient id="trustGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d4ff47" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#d4ff47" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 1, 2, 3].map((i) => (
                    <line key={i} x1="40" y1={20 + i * 40} x2="490" y2={20 + i * 40} stroke="#2d2d52" strokeWidth="1" />
                  ))}
                  <text x="32" y="24" textAnchor="end" fill="#4a4a6a" fontSize="10">2.4k</text>
                  <text x="32" y="64" textAnchor="end" fill="#4a4a6a" fontSize="10">1.8k</text>
                  <text x="32" y="104" textAnchor="end" fill="#4a4a6a" fontSize="10">1.2k</text>
                  <text x="32" y="144" textAnchor="end" fill="#4a4a6a" fontSize="10">600</text>
                  <path d="M 50 130 C 80 125 100 120 130 110 C 160 100 180 95 210 85 C 240 78 260 70 290 55 C 320 45 350 38 380 30 C 410 25 440 22 470 20 L 470 150 L 50 150 Z" fill="url(#trustGrad)" />
                  <path d="M 50 130 C 80 125 100 120 130 110 C 160 100 180 95 210 85 C 240 78 260 70 290 55 C 320 45 350 38 380 30 C 410 25 440 22 470 20" fill="none" stroke="#d4ff47" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="470" cy="20" r="4" fill="#d4ff47" />
                  <circle cx="470" cy="20" r="8" fill="#d4ff47" opacity="0.2">
                    <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <text x="50" y="155" fill="#4a4a6a" fontSize="10">Apr 1</text>
                  <text x="170" y="155" fill="#4a4a6a" fontSize="10">Apr 2</text>
                  <text x="290" y="155" fill="#4a4a6a" fontSize="10">Apr 3</text>
                  <text x="440" y="155" fill="#4a4a6a" fontSize="10">Now</text>
                </svg>
              </div>
            </div>

            {/* Stats column */}
            <div className="w-[160px] shrink-0 flex flex-col gap-2">
              {[
                { label: "Autonomy", value: atom.autonomy, color: "text-amber" },
                { label: "Type", value: atom.type.toUpperCase(), color: "text-white" },
                { label: "Contexts", value: String(atom.contexts.length), color: "text-white" },
                { label: "Bundles", value: String(atom.usedIn.length), color: "text-pear" },
              ].map((s) => (
                <div key={s.label} className="bg-surface rounded-xl border border-border p-3 text-center transition-all duration-200 hover:border-border-light hover:-translate-y-0.5 flex-1 flex flex-col justify-center">
                  <div className={`text-base font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] text-text-secondary mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                if (!isConnected) {
                  connect();
                } else {
                  setShowStake(true);
                }
              }}
              style={{
                flex: 1,
                borderRadius: "12px",
                background: "#d4ff47",
                color: "#06070f",
                border: "none",
                fontWeight: 700,
                fontSize: "14px",
                boxShadow: "0 0 24px rgba(212, 255, 71, 0.2)",
                transition: "all 0.3s ease",
              }}
            >
              {!isConnected ? "Connect Wallet" : "🍐 Express your WisPear"}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setShowShare(true)}
              style={{
                borderRadius: "12px",
                background: "transparent",
                color: "#e8e8ec",
                border: "1px solid #2d2d52",
                fontWeight: 600,
                fontSize: "14px",
                transition: "all 0.3s ease",
              }}
            >
              Share ↗
            </Button>
          </div>

          {/* Contexts + Bundles */}
          <div className="flex gap-6">
            <div className="flex-1">
              <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">Contexts</h3>
              <div className="flex flex-wrap gap-1.5">
                {atom.contexts.map((ctx) => (
                  <span key={ctx} className="text-[11px] px-2.5 py-1 rounded-md bg-surface border border-border text-text-secondary hover:border-border-light hover:text-text-primary transition-all duration-200 cursor-pointer">
                    {ctx}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">Used in bundles</h3>
              <div className="flex flex-wrap gap-1.5">
                {atom.usedIn.map((bundle) => (
                  <span key={bundle.id} className="text-[11px] px-2.5 py-1 rounded-md bg-surface border border-border text-text-secondary hover:border-border-light hover:text-text-primary transition-all duration-200 cursor-pointer">
                    {bundle.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Staking history table */}
          <div>
            <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">Staking history</h3>
            <div className="bg-surface rounded-xl border border-border overflow-hidden">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-2.5">Curator</th>
                    <th className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-2.5">Action</th>
                    <th className="text-right text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-2.5">Amount</th>
                    <th className="text-right text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-2.5">Tx</th>
                    <th className="text-right text-[11px] font-semibold text-text-muted uppercase tracking-wider px-4 py-2.5">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {historyLoading && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center">
                        <div className="w-5 h-5 border-2 border-pear/30 border-t-pear rounded-full animate-spin mx-auto" />
                      </td>
                    </tr>
                  )}
                  {!historyLoading && stakingEvents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-text-muted text-[13px]">
                        No staking activity yet
                      </td>
                    </tr>
                  )}
                  {!historyLoading && stakingEvents.map((row, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-none hover:bg-hover/50 transition-colors">
                      <td className="px-4 py-2.5 text-text-primary font-medium">{row.curator}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          row.action === "Stake" ? "bg-pear-soft text-pear" : "bg-red-soft text-red"
                        }`}>
                          {row.action}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right text-pear font-semibold">{row.amount} $T</td>
                      <td className="px-4 py-2.5 text-right">
                        <a href={`https://explorer.intuition.systems/address/${row.txFull}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-pear transition-colors font-mono text-[12px]">
                          {row.tx}
                        </a>
                      </td>
                      <td className="px-4 py-2.5 text-right text-text-muted">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right — Sidebar */}
        <aside className="w-[300px] shrink-0 hidden lg:flex flex-col gap-6 sticky top-14 self-start">
          {/* Trending atoms */}
          <div className="bg-surface rounded-xl border border-border p-4">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <span className="text-base">🔥</span> Trending
            </h3>
            <div className="flex flex-col gap-2.5">
              {TRENDING.map((item, i) => (
                <Link
                  key={item.name}
                  href={`/curate/${Object.keys(ATOMS)[i]}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-hover transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                >
                  <span className="text-[12px] font-bold text-text-muted w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-text-primary truncate">{item.name}</div>
                    <div className="text-[11px] text-text-muted">{item.type}</div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-[12px] font-bold text-pear">★ {item.trust}</span>
                    <span className="text-[10px] font-semibold text-green">{item.change}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Curators */}
          <div className="bg-surface rounded-xl border border-border p-4">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <span className="text-base">👑</span> Top Curators
            </h3>
            <div className="flex flex-col gap-2.5">
              {TOP_CURATORS.map((curator) => (
                <div key={curator.name} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-hover transition-all duration-200 cursor-pointer hover:-translate-y-0.5">
                  <div className="w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center text-[11px] font-bold text-pear shrink-0">
                    {curator.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-text-primary truncate">{curator.name}</div>
                    <div className="text-[11px] text-text-muted">{curator.atoms} atoms staked</div>
                  </div>
                  <span className="text-[12px] font-bold text-pear shrink-0">{curator.totalStaked}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Stake Modal */}
      {showStake && wallet && stakeTermId && (
        <StakeModal
          wallet={wallet}
          termId={stakeTermId}
          atomName={atom.name}
          atomType={atom.type}
          context={contexts[0]}
          onClose={() => setShowStake(false)}
        />
      )}

      {/* Share Modal */}
      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowShare(false)}>
          <div className="bg-surface border border-border rounded-2xl p-6 w-[400px] max-w-[90vw] flex flex-col gap-5 shadow-[0_16px_48px_rgba(0,0,0,0.4)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">Share this atom</h2>
              <button onClick={() => setShowShare(false)} className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:border-border-light transition-all">✕</button>
            </div>
            <div className="flex gap-2">
              <input type="text" readOnly value={shareUrl} className="flex-1 px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-text-secondary text-[13px] font-mono outline-none truncate" />
              <button onClick={handleCopy} className={`px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200 active:scale-95 ${copied ? "bg-green-soft text-green border border-green/20" : "bg-pear text-bg hover:shadow-[0_0_12px_rgba(212,255,71,0.2)]"}`}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[12px] text-text-muted uppercase tracking-wider">Share on</span>
              <div className="grid grid-cols-2 gap-2">
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just staked $TRUST on ${atom.name} via @wispear_ai 🍐⛓️\n\nDiscover AI agent components backed by real experts.\n\n`)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-surface-2 border border-border text-text-primary text-[14px] font-medium hover:border-border-light hover:-translate-y-0.5 transition-all duration-200">
                  <span className="text-lg">𝕏</span> Twitter / X
                </a>
                <a href={`https://warpcast.com/~/compose?text=${encodeURIComponent(`I just staked $TRUST on ${atom.name} via @wispear 🍐⛓️`)}&embeds[]=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-surface-2 border border-border text-text-primary text-[14px] font-medium hover:border-border-light hover:-translate-y-0.5 transition-all duration-200">
                  <span className="text-lg">🟪</span> Farcaster
                </a>
                <a href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out ${atom.name} on WisPear — backed by curators 🍐`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-surface-2 border border-border text-text-primary text-[14px] font-medium hover:border-border-light hover:-translate-y-0.5 transition-all duration-200">
                  <span className="text-lg">✈️</span> Telegram
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-surface-2 border border-border text-text-primary text-[14px] font-medium hover:border-border-light hover:-translate-y-0.5 transition-all duration-200">
                  <span className="text-lg">🔗</span> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
