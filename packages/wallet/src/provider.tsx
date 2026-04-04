"use client";

import { type ReactNode } from "react";
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { wagmiConfig } from "./wagmi";
import { intuitionChain } from "./config";

const queryClient = new QueryClient();

const intuitionNetwork = {
  chainId: intuitionChain.id,
  networkId: intuitionChain.id,
  name: intuitionChain.name,
  vanityName: "Intuition",
  shortName: "intuition",
  chainName: intuitionChain.name,
  rpcUrls: intuitionChain.rpcUrls.default.http.slice(),
  privateCustomerRpcUrls: intuitionChain.rpcUrls.default.http.slice(),
  blockExplorerUrls: [intuitionChain.blockExplorers?.default?.url].filter(
    Boolean,
  ) as string[],
  nativeCurrency: intuitionChain.nativeCurrency,
  testnet: false,
  iconUrls: [],
};

interface WalletProviderProps {
  children: ReactNode;
  environmentId?: string;
}

export function WalletProvider({ children, environmentId }: WalletProviderProps) {
  const envId = environmentId ?? process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID ?? "36dd1aa9-d136-4506-ad6b-12535d4a3ce3";

  return (
    <DynamicContextProvider
      settings={{
        environmentId: envId,
        walletConnectors: [EthereumWalletConnectors],
        overrides: { evmNetworks: [intuitionNetwork] },
      }}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}

export { DynamicWidget };
