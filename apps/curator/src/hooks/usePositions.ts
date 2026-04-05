"use client";

import { useEffect, useState } from "react";
import { gqlFetch } from "@/lib/graphql";

export interface Position {
  id: string;
  name: string;
  type: "atom" | "triple";
  typeIcon: string;
  componentType: string | null;
  context: string | null;
  vote: "support" | "oppose";
  shares: string;
  sharePrice: string;
  currentValue: number;
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

const POSITIONS_QUERY = `
  query GetAccountPositions($address: String!) {
    account(id: $address) {
      positions(
        where: { shares: { _gt: "0" } }
        limit: 50
        order_by: { shares: desc }
      ) {
        id
        shares
        term {
          vaults(where: { curve_id: { _eq: "1" } }) {
            term_id
            position_count
            total_shares
            current_share_price
          }
          atom {
            term_id
            label
            value {
              thing { name description }
            }
            as_subject_triples {
              predicate { label }
              object { label }
            }
          }
          triple {
            term_id
            counter_term_id
            subject {
              term_id
              label
              value { thing { name } }
              as_subject_triples {
                predicate { label }
                object { label }
              }
            }
            predicate { label }
            object { label }
            counter_term {
              vaults(where: { curve_id: { _eq: "1" } }) {
                term_id
              }
            }
          }
        }
      }
    }
  }
`;

function weiToEth(raw: string): number {
  const n = Number(raw);
  if (isNaN(n)) return 0;
  return n / 1e18;
}

function extractComponentType(triples: any[]): string | null {
  const t = triples?.find(
    (t: any) => t.predicate?.label?.toLowerCase().replace(/[\s-]/g, "") === "isbestof"
  );
  return t?.object?.label?.toLowerCase() ?? null;
}

function parsePosition(raw: any): Position | null {
  const vault = raw.term?.vaults?.[0];
  if (!vault) return null;

  const shares = raw.shares || "0";
  const sharePrice = vault.current_share_price || "0";
  const currentValue = weiToEth(shares) * weiToEth(sharePrice);

  // Atom position
  if (raw.term?.atom) {
    const atom = raw.term.atom;
    const name = atom.value?.thing?.name ?? atom.label ?? "Unknown";
    const compType = extractComponentType(atom.as_subject_triples ?? []);
    return {
      id: raw.id,
      name,
      type: "atom",
      typeIcon: TYPE_ICONS[compType ?? ""] ?? "📦",
      componentType: compType,
      context: null,
      vote: "support",
      shares,
      sharePrice,
      currentValue,
    };
  }

  // Triple position
  if (raw.term?.triple) {
    const triple = raw.term.triple;
    const vaultTermId = vault.term_id?.toString();
    const counterTermId = triple.counter_term_id?.toString();
    const isOppose = counterTermId && vaultTermId === counterTermId;

    const subject = triple.subject;
    const name = subject?.value?.thing?.name ?? subject?.label ?? "Unknown";
    const compType = extractComponentType(subject?.as_subject_triples ?? []);
    const context = triple.object?.label ?? null;
    const predicate = triple.predicate?.label ?? "";

    return {
      id: raw.id,
      name: predicate.includes("context") ? `${name}` : `${name} — ${triple.predicate?.label ?? ""} ${triple.object?.label ?? ""}`,
      type: "triple",
      typeIcon: TYPE_ICONS[compType ?? ""] ?? "📦",
      componentType: compType,
      context: predicate.includes("context") ? context : null,
      vote: isOppose ? "oppose" : "support",
      shares,
      sharePrice,
      currentValue,
    };
  }

  return null;
}

const MOCK_POSITIONS: Position[] = [
  { id: "mock-1", name: "MCP Notion", type: "triple", typeIcon: "🔌", componentType: "mcp", context: "content-automation", vote: "support", shares: "0", sharePrice: "0", currentValue: 2.45 },
  { id: "mock-2", name: "Claude Sonnet 4.5", type: "triple", typeIcon: "🤖", componentType: "model", context: "content-generation", vote: "support", shares: "0", sharePrice: "0", currentValue: 1.82 },
  { id: "mock-3", name: "Chainlink Data Feeds", type: "triple", typeIcon: "⚡", componentType: "api", context: "defi", vote: "support", shares: "0", sharePrice: "0", currentValue: 3.10 },
  { id: "mock-4", name: "MCP GitHub", type: "triple", typeIcon: "🔌", componentType: "mcp", context: "code-analysis", vote: "support", shares: "0", sharePrice: "0", currentValue: 1.25 },
  { id: "mock-5", name: "1inch Fusion+ SDK", type: "triple", typeIcon: "⚡", componentType: "sdk", context: "defi", vote: "oppose", shares: "0", sharePrice: "0", currentValue: 0.75 },
  { id: "mock-6", name: "Safe SDK", type: "triple", typeIcon: "⚡", componentType: "sdk", context: "web3-building", vote: "support", shares: "0", sharePrice: "0", currentValue: 1.50 },
  { id: "mock-7", name: "LangChain", type: "triple", typeIcon: "⚡", componentType: "sdk", context: "ai-agents", vote: "support", shares: "0", sharePrice: "0", currentValue: 2.00 },
  { id: "mock-8", name: "Firecrawl MCP", type: "triple", typeIcon: "🔌", componentType: "mcp", context: "data-scraping", vote: "oppose", shares: "0", sharePrice: "0", currentValue: 0.30 },
];

export function usePositions(address: string | null) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setPositions(MOCK_POSITIONS);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchPositions() {
      setLoading(true);
      try {
        const data = await gqlFetch<{ account: { positions: any[] } | null }>(
          POSITIONS_QUERY,
          { address: address!.toLowerCase() }
        );

        if (cancelled) return;

        const rawPositions = data.account?.positions ?? [];
        const parsed = rawPositions
          .map(parsePosition)
          .filter((p): p is Position => p !== null);

        // Fall back to mock data if no real positions
        setPositions(parsed.length > 0 ? parsed : MOCK_POSITIONS);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to fetch positions:", err);
        setPositions(MOCK_POSITIONS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPositions();
    return () => { cancelled = true; };
  }, [address]);

  return { positions, loading, error };
}
