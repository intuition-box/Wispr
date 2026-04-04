import { defineChain } from "viem";

export const intuitionChain = defineChain({
  id: 1155,
  name: "Intuition",
  nativeCurrency: { name: "TRUST", symbol: "TRUST", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.intuition.systems/http"] },
    public: { http: ["https://rpc.intuition.systems/http"] },
  },
  blockExplorers: {
    default: { name: "Intuition Explorer", url: "https://explorer.intuition.systems" },
  },
  contracts: {
    multicall3: {
      address: "0x31E7C4ef16e1c3c149D2F0a62517d621bDa6D037",
      blockCreated: 117543,
    },
  },
});

export const CHAIN_CONFIG = {
  CHAIN_ID: 1155,
  CHAIN_ID_HEX: "0x483" as const,
  CHAIN_NAME: "Intuition",
  RPC_URL: "https://rpc.intuition.systems/http",
  NATIVE_CURRENCY: { name: "TRUST", symbol: "TRUST", decimals: 18 },
  MULTIVAULT: "0x6E35cF57A41fA15eA0EaE9C33e751b01A784Fe7e" as const,
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
