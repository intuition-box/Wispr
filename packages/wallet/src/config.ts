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
  // Read
  "function getTripleCost() view returns (uint256)",
  "function getAtomCost() view returns (uint256)",
  "function calculateAtomId(bytes data) pure returns (bytes32)",
  "function calculateTripleId(bytes32 subjectId, bytes32 predicateId, bytes32 objectId) pure returns (bytes32)",
  "function isTermCreated(bytes32 id) view returns (bool)",
  "function getBondingCurveConfig() view returns (address, uint256)",
  "function getCounterIdFromTripleId(bytes32 tripleId) pure returns (bytes32)",
  // Write — batch creation (V2)
  "function createAtoms(bytes[] atomDatas, uint256[] assets) payable returns (bytes32[])",
  "function createTriples(bytes32[] subjectIds, bytes32[] predicateIds, bytes32[] objectIds, uint256[] assets) payable returns (bytes32[])",
  // Write — deposit/redeem
  "function deposit(address receiver, bytes32 termId, uint256 curveId, uint256 minShares) payable returns (uint256)",
  "function depositBatch(address receiver, bytes32[] termIds, uint256[] curveIds, uint256[] assets, uint256[] minShares) payable returns (uint256[])",
  // Deposit & redeem (staking)
  "function deposit(address receiver, bytes32 termId, uint256 curveId, uint256 minShares) payable returns (uint256)",
  "function depositBatch(address receiver, bytes32[] termIds, uint256[] curveIds, uint256[] assets, uint256[] minShares) payable returns (uint256[])",
  "function redeem(address receiver, bytes32 termId, uint256 curveId, uint256 shares, uint256 minAssets) returns (uint256)",
  "function redeemBatch(address receiver, bytes32[] termIds, uint256[] curveIds, uint256[] shares, uint256[] minAssets) returns (uint256[])",
  "function previewDeposit(uint256 assets, bytes32 termId, uint256 curveId) view returns (uint256)",
  "function previewRedeem(uint256 shares, bytes32 termId, uint256 curveId) view returns (uint256)",
] as const;
