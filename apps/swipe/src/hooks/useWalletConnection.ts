"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  useAppKitAccount,
  useAppKitProvider,
  useAppKit,
  useDisconnect,
} from "@reown/appkit/react";
import { CHAIN_CONFIG, MULTIVAULT_ABI } from "@/lib/appkit";

export interface WalletConnection {
  provider: import("ethers").BrowserProvider;
  signer: import("ethers").Signer;
  multiVault: import("ethers").Contract;
  address: string;
}

export function useWalletConnection() {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
  const { open } = useAppKit();
  const { disconnect: appKitDisconnect } = useDisconnect();

  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const buildingRef = useRef(false);
  const builtForRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address || !walletProvider) {
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
        const provider = new ethers.BrowserProvider(
          walletProvider as import("ethers").Eip1193Provider
        );

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
          ? new ethers.BrowserProvider(
              walletProvider as import("ethers").Eip1193Provider
            )
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
  }, [isConnected, address, walletProvider]);

  const connect = useCallback(() => {
    setError("");
    open();
  }, [open]);

  const disconnect = useCallback(async () => {
    try {
      await appKitDisconnect();
    } catch {
      /* ignore */
    }
    setWallet(null);
    builtForRef.current = null;
  }, [appKitDisconnect]);

  return {
    wallet,
    address: address ?? null,
    isConnected,
    loading,
    error,
    connect,
    disconnect,
  };
}
