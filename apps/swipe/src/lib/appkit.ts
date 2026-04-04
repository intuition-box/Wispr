"use client";

import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";

// Intuition L3 chain definition
export const intuitionChain = {
  id: 1155,
  name: "Intuition",
  nativeCurrency: { name: "TRUST", symbol: "TRUST", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.intuition.systems/http"] },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://explorer.intuition.systems" },
  },
} as const;

export const CHAIN_CONFIG = {
  CHAIN_ID: 1155,
  CHAIN_ID_HEX: "0x483",
  CHAIN_NAME: "Intuition",
  RPC_URL: "https://rpc.intuition.systems/http",
  NATIVE_CURRENCY: { name: "TRUST", symbol: "TRUST", decimals: 18 },
  MULTIVAULT: "0x6E35cF57A41fA15eA0EaE9C33e751b01A784Fe7e",
  EXPLORER: "https://explorer.intuition.systems",
} as const;

export const MULTIVAULT_ABI = [
  "function getTripleCost() view returns (uint256)",
  "function getAtomCost() view returns (uint256)",
  "function createAtom(bytes atomData) payable returns (uint256)",
  "function createTriple(uint256 subjectId, uint256 predicateId, uint256 objectId) payable returns (uint256)",
  "function calculateAtomId(bytes data) pure returns (bytes32)",
  "function isTermCreated(bytes32 id) view returns (bool)",
] as const;

let initialized = false;

export function initAppKit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ?? "";

  createAppKit({
    adapters: [new EthersAdapter()],
    metadata: {
      name: "Wispr Profile",
      description: "Discover and publish your AI profile on-chain",
      url: window.location.origin,
      icons: [`${window.location.origin}/icons/icon-192.png`],
    },
    projectId,
    networks: [intuitionChain],
    defaultNetwork: intuitionChain,
    features: { analytics: false },
    themeMode: "light",
    themeVariables: {
      "--w3m-accent": "#4A9BF4",
      "--w3m-border-radius-master": "3px",
    },
  });
}
