import { useState, useMemo, useCallback } from "react";
import type { Role } from "@wispr/ontology";
import type { WalletConnection } from "@/hooks/useWalletConnection";
import type { SwipeDirection } from "@/types/swipe";
import { getRecommendations } from "@/data/componentCatalog";
import { depositVotes, type Vote } from "@/lib/depositVotes";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; txHash: string; explorerUrl: string }
  | { status: "error"; message: string };

export function useComponentVoting(role: Role) {
  const recommendation = useMemo(() => getRecommendations(role), [role]);
  const { useCase, components } = recommendation;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const currentComponent = currentIndex < components.length ? components[currentIndex] : null;
  const nextComponent = currentIndex + 1 < components.length ? components[currentIndex + 1] : null;
  const isComplete = currentIndex >= components.length;
  const progress = components.length > 0 ? currentIndex / components.length : 0;

  const swipe = useCallback(
    (direction: SwipeDirection) => {
      if (!currentComponent) return;
      setVotes((prev) => [
        ...prev,
        {
          component: currentComponent,
          direction: direction === "like" ? "for" : "against",
        },
      ]);
      setCurrentIndex((i) => i + 1);
    },
    [currentComponent]
  );

  const submit = useCallback(
    async (wallet: WalletConnection) => {
      const forVotes = votes.filter((v) => v.direction === "for");
      if (forVotes.length === 0) {
        setSubmitState({
          status: "error",
          message: "No components marked as useful",
        });
        return;
      }

      setSubmitState({ status: "submitting" });
      try {
        const result = await depositVotes(wallet, forVotes, useCase);
        setSubmitState({
          status: "success",
          txHash: result.txHash,
          explorerUrl: result.explorerUrl,
        });
      } catch (e: unknown) {
        setSubmitState({
          status: "error",
          message: e instanceof Error ? e.message : "Vote submission failed",
        });
      }
    },
    [votes, useCase]
  );

  return {
    useCase,
    components,
    currentComponent,
    nextComponent,
    currentIndex,
    isComplete,
    progress,
    votes,
    submitState,
    swipe,
    submit,
  };
}
