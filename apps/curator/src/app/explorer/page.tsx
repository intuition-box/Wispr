"use client";

import Link from "next/link";
import { useDepositsFeed, type FeedDeposit } from "@/hooks/useDepositsFeed";

export default function ExplorerPage() {
  const { deposits, loading } = useDepositsFeed();

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 page-header backdrop-blur-xl px-5 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Explorer</h1>
            <p className="text-sm text-text-secondary mt-1">
              Live feed — whispers from the community
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
            <span className="text-[12px] text-text-muted">Live</span>
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
        <div className="flex flex-col px-5 py-4">
          {deposits.map((deposit, i) => (
            <FeedItem key={deposit.id} deposit={deposit} isNew={i === 0 && deposit.timeAgo === "just now"} />
          ))}
        </div>
      )}
    </>
  );
}

function FeedItem({ deposit, isNew }: { deposit: FeedDeposit; isNew: boolean }) {
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3.5 border-b border-border/40 transition-all duration-500 ${
        isNew ? "bg-pear/5" : "hover:bg-surface/50"
      }`}
    >
      {/* Pear icon */}
      <span className="text-lg mt-0.5 shrink-0">🍐</span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-text-primary leading-relaxed">
          <span className="font-bold text-pear">{deposit.sender}</span>
          {" vouched for "}
          <Link
            href={`/curate/${deposit.componentSlug}`}
            className="font-bold text-text-primary hover:text-accent transition-colors"
          >
            {deposit.componentName}
          </Link>
          {" in "}
          <span className="font-semibold text-accent">{deposit.context}</span>
        </p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-[12px] font-semibold text-pear">{deposit.amount} $Trust</span>
          <span className="text-[11px] text-text-muted">{deposit.timeAgo}</span>
          <a
            href={`https://explorer.intuition.systems/tx/${deposit.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-text-muted hover:text-accent transition-colors font-mono"
          >
            {deposit.txHash}
          </a>
        </div>
      </div>
    </div>
  );
}
