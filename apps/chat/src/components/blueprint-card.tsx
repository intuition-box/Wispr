"use client";

import { useState, useEffect } from "react";
import {
  Copy,
  Check,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Blueprint, BlueprintComponent } from "@/lib/mock-blueprint";


const categoryColors: Record<string, string> = {
  "content-automation": "border-blue-500/40 text-blue-400",
  "social-media": "border-pink-500/40 text-pink-400",
  "content-generation": "border-violet-500/40 text-violet-400",
  "content-creation": "border-amber-500/40 text-amber-400",
  "defi": "border-green-500/40 text-green-400",
  "web3-building": "border-cyan-500/40 text-cyan-400",
};

function categoryStyle(context?: string) {
  if (!context) return "border-muted-foreground/30 text-muted-foreground";
  return categoryColors[context] ?? "border-muted-foreground/30 text-muted-foreground";
}

function ComponentCard({
  component,
}: {
  component: BlueprintComponent;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-4 space-y-2">
      <div className="flex items-start gap-3">
        {/* Image */}
        {component.imageUrl ? (
          <img
            src={component.imageUrl}
            alt={component.name}
            className="h-9 w-9 rounded-lg object-cover shrink-0 mt-0.5"
          />
        ) : (
          <div className="h-9 w-9 rounded-lg bg-white/[0.06] shrink-0 mt-0.5" />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-pear bg-pear/10 border border-pear/20 rounded px-1.5 py-0.5">
                {component.type}
              </span>
              <h4 className="font-semibold text-sm leading-tight">
                {component.name}
              </h4>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Users className="h-3.5 w-3.5" />
              {component.curatorCount} wispearers
            </div>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5">
            {component.description}
          </p>

          <div className="flex items-center mt-2">
            <span
              className={`text-[11px] font-medium border rounded-full px-2 py-0.5 ${categoryStyle(component.context)}`}
            >
              {component.context
                ? component.context.charAt(0).toUpperCase() +
                  component.context.slice(1).replace(/-/g, " ")
                : "General"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlueprintCard({
  blueprint,
  onCurate,
}: {
  blueprint: Blueprint;
  onCurate?: () => void;
}) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [bordered, setBordered] = useState(false);
  const [showCtas, setShowCtas] = useState(false);

  const [copied, setCopied] = useState(false);

  const n = blueprint.stack.components.length;

  useEffect(() => {
    // Reveal cards one by one
    if (visibleCount < n) {
      const delay = visibleCount === 0 ? 400 : 300;
      const timer = setTimeout(() => setVisibleCount((c) => c + 1), delay);
      return () => clearTimeout(timer);
    }

    // All cards visible → show border
    if (!bordered) {
      const timer = setTimeout(() => setBordered(true), 300);
      return () => clearTimeout(timer);
    }

    // Border visible → show CTAs
    if (!showCtas) {
      const timer = setTimeout(() => setShowCtas(true), 300);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, bordered, showCtas, n]);

  return (
    <div className="space-y-5 w-full">
      {/* ── Header ── */}
      <div className="animate-fade-slide-up">
        <div className="block sm:flex sm:items-start sm:justify-between sm:gap-3">
          <div>
            <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-heading)" }}>
              {blueprint.title}
            </h3>
          </div>
          <div className="flex gap-1.5 mt-2 sm:mt-0 sm:shrink-0">
            {blueprint.domains.map((d) => (
              <Badge
                key={d}
                variant="outline"
                className="text-[10px] px-2 py-0.5"
              >
                {d}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* ── Intro text ── */}
      <p className="text-sm text-muted-foreground animate-fade-slide-up" style={{ animationDelay: "200ms" }}>
        Here&apos;s the stack that gets you there:
      </p>

      {/* ── Timeline with cards ── */}
      <div
        className={`rounded-2xl p-4 transition-all duration-500 ${
          bordered
            ? "border border-pear/20"
            : "border border-transparent"
        }`}
      >
        <div className="relative">
          {blueprint.stack.components.map((comp, i) => {
            const isLast = i === n - 1;
            const isVisible = i < visibleCount;

            return (
              <div
                key={comp.id}
                className={`relative pl-6 ${
                  isVisible ? "animate-fade-slide-up" : "opacity-0 h-0 overflow-hidden"
                }`}
              >
                {/* Timeline line */}
                {!isLast && isVisible && (
                  <div className="absolute left-[5px] top-[14px] bottom-0 w-px bg-pear/30" />
                )}

                {/* Timeline dot */}
                {isVisible && (
                  <div className="absolute left-0 top-[6px] h-[11px] w-[11px] rounded-full border-2 border-pear/50 bg-background" />
                )}

                {/* Card */}
                <div className={isLast ? "" : "pb-4"}>
                  <ComponentCard component={comp} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CTAs ── */}
      <div
        className={`flex gap-2.5 transition-opacity duration-500 ${
          showCtas ? "opacity-100" : "opacity-0"
        }`}
      >
        <Button
          variant="outline"
          className="flex-1 gap-2 text-sm"
          size="sm"
          disabled={!showCtas}
          onClick={() => {
            navigator.clipboard.writeText(blueprint.systemPrompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-trust-high" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? "Copied!" : "Copy to my agent"}
        </Button>
        <Button
          className="flex-1 gap-2 text-sm bg-accent hover:bg-accent/90 text-accent-foreground"
          size="sm"
          disabled={!showCtas}
          onClick={onCurate}
        >
          <Users className="h-3.5 w-3.5" />
          Curate
        </Button>
      </div>
    </div>
  );
}
