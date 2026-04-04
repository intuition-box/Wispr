"use client";

import { Logo } from "@wispr/ui";

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <div className="relative bg-gradient-to-br from-hero-from via-hero-via to-hero-to overflow-hidden noise">
      {/* Decorative glow orbs */}
      <div className="absolute -right-20 -top-20 w-[300px] h-[300px] rounded-full bg-pear/5 blur-3xl" />
      <div className="absolute -left-32 top-24 w-[200px] h-[200px] rounded-full bg-accent/8 blur-3xl" />

      <div className="relative z-10 px-7 pt-14 pb-14">
        <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
          <span className="inline-flex items-center gap-1.5 bg-pear/8 text-pear text-[11px] font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full mb-5 border border-pear/15">
            <span className="w-1.5 h-1.5 bg-pear rounded-full" />
            Intuition Protocol
          </span>
        </div>

        {/* Pear icon + wordmark */}
        <div className="animate-fade-up flex items-center gap-3 mb-5" style={{ animationDelay: '60ms' }}>
          <Logo variant="icon" theme="dark" width={48} height={53} />
          <Logo variant="wordmark" theme="dark" width={180} height={34} />
        </div>

        {/* Slogan */}
        <p className="animate-fade-up text-[13px] text-ink-muted italic tracking-wide mb-6" style={{ animationDelay: '100ms' }}>
          Collective wisdom, whispered to your agent.
        </p>

        <h1 className="animate-fade-up" style={{ animationDelay: '140ms' }}>
          <span className="block font-display text-[40px] leading-[1.05] text-ink tracking-[-0.02em] font-bold">
            Discover your
          </span>
          <span className="block font-display text-[40px] leading-[1.05] tracking-[-0.02em] mt-1 font-bold bg-gradient-to-r from-pear via-cyan to-accent bg-clip-text text-transparent">
            AI profile
          </span>
        </h1>

        <p className="animate-fade-up text-[15px] text-ink-secondary leading-[1.6] max-w-[280px] mt-5 mb-8" style={{ animationDelay: '220ms' }}>
          8 questions. 60 seconds. Uncover your role and AI maturity level, then mint it on-chain.
        </p>

        <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
          <button
            onClick={onStart}
            className="group flex items-center gap-2 bg-pear text-ink-inverse font-semibold text-[14px] pl-6 pr-5 py-3.5 rounded-2xl shadow-glow hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm animate-glow-pulse"
          >
            Get started
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">&rarr;</span>
          </button>
        </div>
      </div>

      {/* Pear logo watermark */}
      <div className="absolute right-[-20px] bottom-[20px] opacity-15 pointer-events-none">
        <Logo variant="icon" theme="dark" width={200} height={220} />
      </div>

      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-bg rounded-t-[32px]" />
    </div>
  );
}
