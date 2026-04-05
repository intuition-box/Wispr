"use client";

import { useEffect, useState } from "react";
import { gqlFetch } from "@/lib/graphql";

export interface StakingEvent {
  curator: string;
  action: "Stake" | "Unstake";
  amount: string;
  tx: string;
  txFull: string;
  time: string;
}

const POSITIONS_QUERY = `
  query GetPositions($termId: String!) {
    positions(
      where: { term_id: { _eq: $termId }, curve_id: { _eq: "1" } }
      order_by: { updated_at: desc }
      limit: 20
    ) {
      account {
        id
        label
      }
      shares
      assets
      updated_at
    }
  }
`;

function truncateAddress(addr: string): string {
  if (addr.length <= 13) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatTrust(raw: string | null | undefined): string {
  if (!raw) return "0";
  const n = Number(raw);
  if (isNaN(n)) return "0";
  const eth = n / 1e18;
  if (eth >= 1000) return `${(eth / 1000).toFixed(1)}k`;
  if (eth >= 1) return eth.toFixed(1);
  if (eth >= 0.01) return eth.toFixed(2);
  return eth.toFixed(4);
}

export function useStakingHistory(termId: string | null) {
  const [events, setEvents] = useState<StakingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!termId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchHistory() {
      try {
        const data = await gqlFetch<{ positions: any[] }>(POSITIONS_QUERY, {
          termId,
        });

        if (cancelled) return;

        const parsed: StakingEvent[] = data.positions.map((p: any) => ({
          curator: p.account?.label ?? truncateAddress(p.account?.id ?? ""),
          action: "Stake" as const,
          amount: formatTrust(p.assets),
          tx: truncateAddress(p.account?.id ?? ""),
          txFull: p.account?.id ?? "",
          time: formatRelativeTime(p.updated_at),
        }));

        setEvents(parsed);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to fetch staking history:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchHistory();
    return () => {
      cancelled = true;
    };
  }, [termId]);

  return { events, loading, error };
}
