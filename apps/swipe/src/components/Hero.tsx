"use client";

import Image from "next/image";

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <div className="relative bg-gradient-to-br from-hero-from via-[#DDD8C8] to-hero-to overflow-hidden noise">
      {/* Decorative circle */}
      <div className="absolute -right-20 -top-20 w-[300px] h-[300px] rounded-full bg-accent/5 blur-3xl" />

      <div className="relative z-10 px-7 pt-16 pb-14">
        <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
          <span className="inline-flex items-center gap-1.5 bg-ink/5 text-ink-secondary text-[11px] font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-green rounded-full" />
            Intuition Protocol
          </span>
        </div>

        <h1 className="animate-fade-up" style={{ animationDelay: '80ms' }}>
          <span className="block font-display text-[44px] leading-[1.0] text-ink tracking-[-0.02em]">
            Discover your
          </span>
          <span className="block font-display text-[44px] leading-[1.0] text-accent tracking-[-0.02em] mt-1">
            AI profile
          </span>
        </h1>

        <p className="animate-fade-up text-[15px] text-ink-secondary leading-[1.6] max-w-[280px] mt-5 mb-8" style={{ animationDelay: '160ms' }}>
          8 questions. 60 seconds. Uncover your role and AI maturity level, then mint it on-chain.
        </p>

        <div className="animate-fade-up" style={{ animationDelay: '240ms' }}>
          <button
            onClick={onStart}
            className="group flex items-center gap-2 bg-ink text-ink-inverse font-semibold text-[14px] pl-6 pr-5 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
          >
            Get started
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">&rarr;</span>
          </button>
        </div>
      </div>

      <Image
        src="/character.png"
        alt=""
        width={320}
        height={320}
        className="absolute right-[-30px] bottom-[-20px] w-[260px] h-[260px] object-contain mix-blend-multiply opacity-20 pointer-events-none"
        priority
      />

      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-bg rounded-t-[32px]" />
    </div>
  );
}
