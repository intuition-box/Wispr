"use client";

import { useState, useEffect, useRef } from "react";

export interface FeedDeposit {
  id: string;
  sender: string;
  componentName: string;
  componentSlug: string;
  context: string;
  amount: string;
  timeAgo: string;
  txHash: string;
}

const MOCK_SENDERS = [
  "bob.eth", "alice.eth", "nodo.eth", "buildr.eth", "frank.eth",
  "0xdev.eth", "pear-lover.eth", "agent-maxi.eth", "defi-chad.eth",
  "mcp-whale.eth", "curator42.eth", "wispr.eth",
];

const MOCK_COMPONENTS = [
  { name: "MCP Notion", slug: "mcp-notion", context: "content automation" },
  { name: "MCP Twitter", slug: "mcp-twitter", context: "social media" },
  { name: "Claude Sonnet 4.5", slug: "claude-sonnet-4-5", context: "content generation" },
  { name: "Chainlink Data Feeds", slug: "chainlink-data-feeds", context: "defi" },
  { name: "1inch Fusion+ SDK", slug: "1inch-fusion-plus-sdk", context: "defi" },
  { name: "Privy Embedded Wallet", slug: "privy-embedded-wallet", context: "web3 building" },
  { name: "Brand Voice Skill", slug: "brand-voice-skill", context: "content creation" },
  { name: "MCP GitHub", slug: "mcp-github", context: "code analysis" },
  { name: "Code Review Skill", slug: "code-review-skill", context: "code analysis" },
  { name: "Firecrawl MCP", slug: "firecrawl-mcp", context: "data scraping" },
  { name: "Embeddings Matching Skill", slug: "embeddings-matching-skill", context: "ai agents" },
  { name: "MCP Gmail", slug: "mcp-gmail", context: "automation" },
  { name: "Claude Haiku 4.5", slug: "claude-haiku-4-5", context: "batch processing" },
];

const MOCK_AMOUNTS = ["1", "2", "5", "0.5", "10", "3", "0.1", "20", "7", "15"];

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTxHash(): string {
  const hex = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 8; i++) hash += hex[Math.floor(Math.random() * 16)];
  return hash + "..." + hex.slice(0, 4);
}

function generateDeposit(): FeedDeposit {
  const comp = randomPick(MOCK_COMPONENTS);
  return {
    id: Math.random().toString(36).slice(2),
    sender: randomPick(MOCK_SENDERS),
    componentName: comp.name,
    componentSlug: comp.slug,
    context: comp.context,
    amount: randomPick(MOCK_AMOUNTS),
    timeAgo: "just now",
    txHash: randomTxHash(),
  };
}

// Generate initial batch of past deposits
function generateInitialDeposits(count: number): FeedDeposit[] {
  const times = ["1m ago", "2m ago", "5m ago", "8m ago", "12m ago", "18m ago", "25m ago", "32m ago", "45m ago", "1h ago", "2h ago", "3h ago"];
  return Array.from({ length: count }, (_, i) => ({
    ...generateDeposit(),
    timeAgo: times[Math.min(i, times.length - 1)],
  }));
}

export function useDepositsFeed() {
  const [deposits, setDeposits] = useState<FeedDeposit[]>(() => generateInitialDeposits(12));
  const [loading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Simulate live feed — new deposit every 3-6 seconds
    intervalRef.current = setInterval(() => {
      setDeposits((prev) => [generateDeposit(), ...prev].slice(0, 50));
    }, 3000 + Math.random() * 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { deposits, loading };
}
