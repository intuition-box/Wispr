"use client";

import { useState, useEffect, useRef } from "react";

const TIPS = [
  "Trust scores are backed by on-chain stakes, not GitHub stars",
  "Every tool here has been validated by expert curators",
  "MCP servers let your agent talk to any API",
  "Curators stake $TRUST tokens on the tools they vouch for",
  "Your blueprint is assembled from a live knowledge graph",
  "Each component is ranked by real builder experience",
  "Wispear finds the best stack — so you don't have to",
  "The more curators agree, the higher the trust score",
];

const CHAR_DELAY = 40; // ms per character
const PAUSE_AFTER = 2000; // ms to wait after full tip before next

function PearIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="60 20 200 230"
      className="h-8 w-8 animate-pear-pulse shrink-0"
    >
      <defs>
        <linearGradient id="pearGradLoading" x1="0%" y1="0%" x2="40%" y2="100%">
          <stop offset="0%" stopColor="#d4ff47" />
          <stop offset="40%" stopColor="#55e292" />
          <stop offset="100%" stopColor="#1990ff" />
        </linearGradient>
      </defs>
      <g transform="translate(20, -10)">
        <path
          d="M 152 75 C 152 45 178 40 188 45 C 183 62 163 72 152 75 Z"
          fill="#d4ff47"
        />
        <path
          d="M 148 76 C 145 52 122 47 112 52 C 117 68 137 73 148 76 Z"
          fill="#aaff2b"
        />
        <path
          d="M 150 75 C 165 75 175 95 180 120 C 185 145 215 155 215 185 C 215 215 185 235 150 235 C 115 235 85 215 85 185 C 85 155 115 145 120 120 C 125 95 135 75 150 75 Z"
          fill="url(#pearGradLoading)"
        />
      </g>
    </svg>
  );
}

export function LoadingTips() {
  const [tipIndex, setTipIndex] = useState(
    () => Math.floor(Math.random() * TIPS.length)
  );
  const [charCount, setCharCount] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const currentTip = TIPS[tipIndex];

  useEffect(() => {
    if (charCount < currentTip.length) {
      // Still typing
      timeoutRef.current = setTimeout(() => {
        setCharCount((c) => c + 1);
      }, CHAR_DELAY);
    } else {
      // Finished typing — pause then move to next tip
      timeoutRef.current = setTimeout(() => {
        setTipIndex((prev) => (prev + 1) % TIPS.length);
        setCharCount(0);
      }, PAUSE_AFTER);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [charCount, currentTip]);

  return (
    <div className="flex items-start gap-3">
      <PearIcon />
      <p className="text-sm text-muted-foreground pt-1">
        {currentTip.slice(0, charCount)}
        <span className="inline-block w-px h-4 bg-muted-foreground/50 ml-0.5 animate-pulse align-text-bottom" />
      </p>
    </div>
  );
}
