"use client";

import type { SwipePhase } from "@/types/swipe";

interface PhaseLabelProps {
  phase: SwipePhase;
}

const PHASE_CONFIG: Record<Exclude<SwipePhase, "result">, { step: string; label: string; emoji: string }> = {
  role: { step: "1/2", label: "Role Detection", emoji: "🎯" },
  maturity: { step: "2/2", label: "AI Maturity", emoji: "🧠" },
};

export function PhaseLabel({ phase }: PhaseLabelProps) {
  if (phase === "result") return null;
  const config = PHASE_CONFIG[phase];

  return (
    <div className="flex items-center gap-2">
      <span className="text-base">{config.emoji}</span>
      <span className="text-[13px] font-semibold text-ink">
        Step {config.step}
      </span>
      <span className="text-[13px] text-ink-muted">
        — {config.label}
      </span>
    </div>
  );
}
