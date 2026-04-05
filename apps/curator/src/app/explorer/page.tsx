"use client";

import Link from "next/link";
import { useDepositsFeed, type FeedDeposit } from "@/hooks/useDepositsFeed";

export default function ExplorerPage() {
  const { deposits, loading } = useDepositsFeed();

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 page-header backdrop-blur-xl px-4 sm:px-5 py-4 sm:py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Explorer</h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Live feed — whispers from the community
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green/10 border border-green/20">
            <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
            <span className="text-[12px] font-semibold text-green">Live</span>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-pear/30 border-t-pear rounded-full animate-spin" />
        </div>
      )}

      {/* Feed */}
      {!loading && (
        <div className="flex flex-col gap-3 px-4 sm:px-5 py-4">
          {deposits.map((deposit, i) => (
            <FeedCard
              key={deposit.id}
              deposit={deposit}
              isNew={i === 0 && deposit.timeAgo === "just now"}
            />
          ))}
        </div>
      )}
    </>
  );
}

function FeedCard({ deposit, isNew }: { deposit: FeedDeposit; isNew: boolean }) {
  const initials = deposit.sender.slice(0, 2).toUpperCase();

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-700 ${
        isNew
          ? "bg-pear/5 border-pear/30 shadow-[0_0_16px_rgba(212,255,71,0.08)]"
          : "bg-surface border-border hover:border-border-light"
      }`}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-pear/20 border border-border-light flex items-center justify-center text-[11px] font-bold text-pear shrink-0">
          {initials}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Main line */}
          <p className="text-[14px] text-text-primary leading-relaxed">
            <span className="font-bold text-pear">{deposit.sender}</span>
            <span className="text-text-secondary"> whispered trust in </span>
            <Link
              href={`/curate/${deposit.componentSlug}`}
              className="font-bold text-text-primary hover:text-accent transition-colors"
            >
              {deposit.componentName}
            </Link>
          </p>

          {/* Context + amount row */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-accent-soft text-accent border border-accent/20">
              {deposit.context}
            </span>
            <span className="text-[12px] font-bold text-pear">
              {deposit.amount} $Trust
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[11px] text-text-muted">{deposit.timeAgo}</span>
            <a
              href={`https://explorer.intuition.systems/tx/${deposit.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-text-muted hover:text-accent transition-colors font-mono hidden sm:inline"
            >
              {deposit.txHash} ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
