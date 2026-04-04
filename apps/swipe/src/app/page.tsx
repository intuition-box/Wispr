"use client";

import { useRouter } from "next/navigation";
import { Hero } from "@/components/Hero";

const STEPS = [
  {
    icon: "👆",
    title: "Swipe",
    description: "Answer yes or no to adaptive questions about your work and AI tools.",
  },
  {
    icon: "✨",
    title: "Discover",
    description: "Get your personalized role and AI maturity level — instantly.",
  },
  {
    icon: "⛓️",
    title: "Publish",
    description: "Mint your profile as on-chain data via Intuition Protocol.",
  },
];

const ROLES = [
  { emoji: "🌐", label: "Full Stack Web3" },
  { emoji: "📜", label: "Smart Contract" },
  { emoji: "🎨", label: "Frontend" },
  { emoji: "⚙️", label: "Backend" },
  { emoji: "✏️", label: "Designer" },
  { emoji: "📋", label: "Product Manager" },
  { emoji: "🚀", label: "Founder" },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <Hero onStart={() => router.push("/swipe")} />

      {/* How it works */}
      <section className="px-7 pt-8 pb-10 max-w-[480px] mx-auto w-full">
        <h2 className="font-display text-[22px] text-ink mb-7 font-bold">How it works</h2>
        <div className="flex flex-col gap-4 stagger">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="animate-fade-up flex items-start gap-4 bg-card rounded-2xl p-4 shadow-xs border border-line"
            >
              <span className="text-xl w-10 h-10 rounded-xl bg-bg-raised flex items-center justify-center shrink-0">
                {step.icon}
              </span>
              <div className="pt-0.5">
                <h3 className="text-[14px] font-bold text-ink mb-0.5">
                  {step.title}
                </h3>
                <p className="text-[13px] text-ink-secondary leading-[1.5]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="px-7 pb-8 max-w-[480px] mx-auto w-full">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-[22px] text-ink font-bold">7 roles</h2>
          <span className="text-[12px] text-ink-muted">Which one are you?</span>
        </div>
        <div className="flex flex-wrap gap-2 stagger">
          {ROLES.map((role) => (
            <span
              key={role.label}
              className="animate-fade-up flex items-center gap-1.5 bg-card border border-line rounded-full px-3.5 py-2 text-[13px] font-medium text-ink shadow-xs hover:shadow-sm hover:border-pear/20 hover:-translate-y-px transition-all duration-200 cursor-default"
            >
              <span className="text-base">{role.emoji}</span>
              {role.label}
            </span>
          ))}
        </div>
      </section>

      {/* AI Levels */}
      <section className="px-7 pb-10 max-w-[480px] mx-auto w-full">
        <h2 className="font-display text-[22px] text-ink mb-4 font-bold">4 AI levels</h2>
        <div className="flex gap-2">
          {["Beginner", "Intermediate", "Advanced", "Expert"].map((level, i) => (
            <div
              key={level}
              className="flex-1 bg-card border border-line rounded-xl p-3 text-center shadow-xs"
            >
              <div className="text-lg mb-1">
                {["🌱", "🔧", "⚡", "🧠"][i]}
              </div>
              <span className="text-[11px] font-semibold text-ink-secondary">{level}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 px-7 py-5 max-w-[480px] mx-auto w-full">
        <div className="glass rounded-2xl p-4 border border-line shadow-lg">
          <button
            onClick={() => router.push("/swipe")}
            className="w-full bg-pear hover:bg-pear-hover text-ink-inverse font-semibold text-[15px] py-4 rounded-xl transition-all duration-300 shadow-glow hover:shadow-lg active:scale-[0.98]"
          >
            Start the quiz →
          </button>
          <p className="text-[11px] text-ink-muted text-center mt-2.5 tracking-wide">
            No account needed · Takes 60 seconds
          </p>
        </div>
      </div>
    </div>
  );
}
