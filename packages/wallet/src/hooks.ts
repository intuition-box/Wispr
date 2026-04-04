"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { CHAIN_CONFIG, MULTIVAULT_ABI } from "./config";

// Use generic types to avoid ethers ESM/CJS dual-package type conflicts
export interface WalletConnection {
  provider: any;
  signer: any;
  multiVault: any;
  address: string;
}

export function useWalletConnection() {
  const { primaryWallet, setShowAuthFlow, handleLogOut } = useDynamicContext();

  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const buildingRef = useRef(false);
  const builtForRef = useRef<string | null>(null);

  const address = primaryWallet?.address ?? null;
  const isConnected = !!primaryWallet?.isConnected;

  useEffect(() => {
    if (!isConnected || !primaryWallet) {
      if (!isConnected) {
        setWallet(null);
        builtForRef.current = null;
      }
      return;
    }

    if (builtForRef.current === address || buildingRef.current) return;

    buildingRef.current = true;
    setLoading(true);

    (async () => {
      try {
        const { ethers } = await import("ethers");

        // Get the EIP-1193 compatible provider from Dynamic wallet
        const dynamicWallet = primaryWallet as any;
        const walletProvider = typeof dynamicWallet.getWalletClient === "function"
          ? await dynamicWallet.getWalletClient()
          : null;

        if (!walletProvider) {
          throw new Error("Could not get wallet provider");
        }

        const provider = new ethers.BrowserProvider(walletProvider);

        // Ensure wallet is on Intuition chain (1155)
        let needsChainSwitch = false;
        try {
          const network = await provider.getNetwork();
          needsChainSwitch = Number(network.chainId) !== CHAIN_CONFIG.CHAIN_ID;
        } catch {
          needsChainSwitch = true;
        }

        if (needsChainSwitch) {
          try {
            await provider.send("wallet_addEthereumChain", [
              {
                chainId: CHAIN_CONFIG.CHAIN_ID_HEX,
                chainName: CHAIN_CONFIG.CHAIN_NAME,
                rpcUrls: [CHAIN_CONFIG.RPC_URL],
                nativeCurrency: CHAIN_CONFIG.NATIVE_CURRENCY,
              },
            ]);
          } catch {
            try {
              await provider.send("wallet_switchEthereumChain", [
                { chainId: CHAIN_CONFIG.CHAIN_ID_HEX },
              ]);
            } catch {
              /* already on chain or user rejected */
            }
          }
        }

        const freshProvider = needsChainSwitch
          ? new ethers.BrowserProvider(walletProvider)
          : provider;

        const signer = await freshProvider.getSigner();
        const addr = await signer.getAddress();

        const multiVault = new ethers.Contract(
          CHAIN_CONFIG.MULTIVAULT,
          MULTIVAULT_ABI,
          signer
        );

        setWallet({ provider: freshProvider, signer, multiVault, address: addr });
        builtForRef.current = address;
        setError("");
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Connection failed");
      } finally {
        setLoading(false);
        buildingRef.current = false;
      }
    })();
  }, [isConnected, address, primaryWallet]);

  const connect = useCallback(() => {
    setError("");
    setShowAuthFlow(true);
  }, [setShowAuthFlow]);

  const disconnect = useCallback(async () => {
    try {
      await handleLogOut();
    } catch {
      /* ignore */
    }
    setWallet(null);
    builtForRef.current = null;
  }, [handleLogOut]);

  return {
    wallet,
    address,
    isConnected,
    loading,
    error,
    connect,
    disconnect,
  };
}
