import { createConfig, http } from "wagmi";
import { intuitionChain } from "./config";

export const wagmiConfig = createConfig({
  chains: [intuitionChain],
  multiInjectedProviderDiscovery: false,
  transports: {
    [intuitionChain.id]: http(intuitionChain.rpcUrls.default.http[0]),
  },
});
