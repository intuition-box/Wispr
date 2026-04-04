"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useWalletConnection, WalletConnect } from "@wispr/wallet";
import { ATOMS, getAtom } from "@/data/atoms";

interface BlueprintComponent {
  id: string;
  name: string;
  type: string;
  typeIcon: string;
  description: string;
  trustScore: string;
  curatorCount: number;
  reasoning: string;
}

// Parse components from URL or fallback to demo data
function useComponents(): { intent: string; components: BlueprintComponent[] } {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const intentParam = searchParams.get("intent");
    const componentsParam = searchParams.get("components");

    if (componentsParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(componentsParam));
        return { intent: intentParam ?? "Your blueprint", components: parsed };
      } catch { /* fallback */ }
    }

    // Demo: show all deployed atoms as if they came from chat
    const demoComponents: BlueprintComponent[] = Object.values(ATOMS).map((atom) => ({
      id: atom.id,
      name: atom.name,
      type: atom.type,
      typeIcon: atom.typeIcon,
      description: atom.description,
      trustScore: "1.2k",
      curatorCount: 14,
      reasoning: `Recommended for ${atom.contexts[0] ?? "this use case"}`,
    }));

    return {
      intent: "Notion → Twitter automated pipeline with brand voice",
      components: demoComponents.slice(0, 6),
    };
  }, [searchParams]);
}

type Vote = "like" | "dislike" | null;

export default function CuratePage() {
  const { isConnected } = useWalletConnection();
  const { intent, components } = useComponents();
  const [votes, setVotes] = useState<Record<string, Vote>>({});

  const handleVote = (id: string, vote: Vote) => {
    setVotes((prev) => ({
      ...prev,
      [id]: prev[id] === vote ? null : vote,
    }));
  };

  const likeCount = Object.values(votes).filter((v) => v === "like").length;
  const dislikeCount = Object.values(votes).filter((v) => v === "dislike").length;

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 page-header backdrop-blur-xl px-5 py-5">
        <h1 className="page-title">Curate</h1>
        <p className="text-sm text-text-secondary mt-1">
          {intent}
        </p>
      </div>

      <div className="relative w-full px-5 py-6">
        {/* Wallet gate */}
        {!isConnected && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-bg/70 backdrop-blur-sm">
            <span className="text-4xl">🔒</span>
            <h2 className="text-xl font-bold text-text-primary">Connect your wallet</h2>
            <p className="text-sm text-text-secondary max-w-[300px] text-center">
              Connect your wallet to vote on components and curate this blueprint.
            </p>
            <WalletConnect />
          </div>
        )}

        {/* Vote summary + Add new */}
        <div className={`flex items-center justify-between mb-5 ${!isConnected ? "blur-sm" : ""}`}>
          <div className="flex items-center gap-4">
            {likeCount > 0 && (
              <span className="text-sm font-semibold text-pear">✓ {likeCount} supported</span>
            )}
            {dislikeCount > 0 && (
              <span className="text-sm font-semibold text-red">✕ {dislikeCount} opposed</span>
            )}
          </div>
          <a
            href="/curate/new"
            className="text-[13px] font-semibold text-accent hover:text-text-primary transition-colors"
          >
            + Add new component
          </a>
        </div>

        {/* Components grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ${!isConnected ? "blur-sm pointer-events-none" : ""}`}>
          {components.map((comp) => {
            const vote = votes[comp.id] ?? null;
            const atom = getAtom(comp.id);

            return (
              <div
                key={comp.id}
                className={`bg-surface rounded-xl border p-5 flex flex-col gap-3 transition-all duration-200 ${
                  vote === "like"
                    ? "border-pear/40 shadow-[0_0_16px_rgba(212,255,71,0.1)]"
                    : vote === "dislike"
                    ? "border-red/30 opacity-60"
                    : "border-border hover:border-border-light"
                }`}
              >
                {/* Top */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-lg shrink-0">
                    {comp.typeIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-text-primary truncate">{comp.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider bg-accent-soft text-accent border-accent/20">
                        {comp.type}
                      </span>
                    </div>
                    <p className="text-[12px] text-text-secondary mt-1 leading-relaxed line-clamp-2">
                      {comp.description}
                    </p>
                  </div>
                </div>

                {/* Reasoning */}
                <p className="text-[11px] text-text-muted italic leading-relaxed">
                  &ldquo;{comp.reasoning}&rdquo;
                </p>

                {/* Trust + Vote */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-bold text-amber flex items-center gap-1">
                      ★ {comp.trustScore}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      {comp.curatorCount} curators
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVote(comp.id, "like")}
                      className={`px-3 h-8 rounded-lg flex items-center justify-center text-[12px] font-semibold gap-1 transition-all duration-200 ${
                        vote === "like"
                          ? "bg-pear text-bg border border-pear"
                          : "bg-transparent border border-pear/40 text-pear hover:bg-pear hover:text-bg"
                      }`}
                    >
                      ✓ Support
                    </button>
                    <button
                      onClick={() => handleVote(comp.id, "dislike")}
                      className={`px-3 h-8 rounded-lg flex items-center justify-center text-[12px] font-semibold gap-1 transition-all duration-200 ${
                        vote === "dislike"
                          ? "bg-red text-white border border-red"
                          : "bg-transparent border border-red/40 text-red hover:bg-red hover:text-white"
                      }`}
                    >
                      ✕ Oppose
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit votes */}
        {isConnected && Object.keys(votes).length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              className="bg-pear text-bg font-bold text-[14px] px-8 py-3.5 rounded-xl shadow-[0_0_24px_rgba(212,255,71,0.2)] hover:shadow-[0_0_32px_rgba(212,255,71,0.3)] transition-all duration-300"
            >
              Submit {Object.keys(votes).length} vote{Object.keys(votes).length > 1 ? "s" : ""} on-chain
            </button>
          </div>
        )}
      </div>
    </>
  );
}
