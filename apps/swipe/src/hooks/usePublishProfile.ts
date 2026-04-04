"use client";

import { useState, useCallback } from "react";
import type { Profile } from "@wispr/ontology";
import type { WalletConnection } from "./useWalletConnection";
import { publishProfile } from "@/lib/intuition";

type PublishState =
  | { status: "idle" }
  | { status: "publishing" }
  | { status: "success"; txHash: string; explorerUrl: string }
  | { status: "error"; message: string };

export function usePublishProfile() {
  const [state, setState] = useState<PublishState>({ status: "idle" });

  const publish = useCallback(
    async (wallet: WalletConnection, profile: Profile) => {
      setState({ status: "publishing" });
      try {
        const result = await publishProfile(wallet, profile);
        setState({
          status: "success",
          txHash: result.txHash,
          explorerUrl: result.explorerUrl,
        });
      } catch (e: unknown) {
        setState({
          status: "error",
          message: e instanceof Error ? e.message : "Publication failed",
        });
      }
    },
    []
  );

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, publish, reset };
}
