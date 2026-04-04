"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Users,
  ArrowRight,
  Download,
  MessageSquareWarning,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Blueprint, BlueprintComponent } from "@/lib/mock-blueprint";

// --- Trust score color ---

function trustColor(score: number) {
  if (score >= 8.5) return "text-trust-high";
  if (score >= 7) return "text-trust-mid";
  return "text-trust-low";
}

// --- Category badge colors (based on context name) ---

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

// --- Copy button ---

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 transition-colors shrink-0"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-trust-high" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          Copy
        </>
      )}
    </button>
  );
}

// --- Component card ---

function ComponentCard({ component }: { component: BlueprintComponent }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-border/50 bg-card/60 p-4 gap-3">
      {/* Top: category badge + trust score */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <span
            className={`text-[11px] font-medium border rounded-full px-2 py-0.5 ${categoryStyle(component.context)}`}
          >
            {component.context
              ? component.context.charAt(0).toUpperCase() + component.context.slice(1).replace(/-/g, " ")
              : component.type}
          </span>
          <span className={`text-lg font-bold leading-none ${trustColor(component.trustScore)}`}>
            {component.trustScore.toFixed(1)}
          </span>
        </div>

        {/* Name + description */}
        <h4 className="font-semibold text-sm leading-tight">{component.name}</h4>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {component.description}
        </p>
      </div>

      {/* Bottom: curators + type */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {component.curatorCount} curators
        </div>
        <span>{component.type}</span>
      </div>
    </div>
  );
}

// --- Main Blueprint Card ---

export function BlueprintCard({ blueprint }: { blueprint: Blueprint }) {
  const avgTrust =
    blueprint.stack.components.reduce((sum, c) => sum + c.trustScore, 0) /
    blueprint.stack.components.length;

  const flowSteps = blueprint.stack.flow
    .split("→")
    .map((s) => s.trim());

  const mcpConfigJson = Object.keys(blueprint.mcpConfig).length > 0
    ? JSON.stringify({ mcpServers: blueprint.mcpConfig }, null, 2)
    : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-5 w-full">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-base">{blueprint.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {blueprint.stack.components.length} components · resolved in{" "}
            {blueprint.resolvedIn} · avg. trust {avgTrust.toFixed(1)}
          </p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          {blueprint.domains.map((d) => (
            <Badge key={d} variant="outline" className="text-[10px] px-2 py-0.5">
              {d}
            </Badge>
          ))}
        </div>
      </div>

      {/* ── Component grid ── */}
      <div className="grid grid-cols-2 gap-2.5">
        {blueprint.stack.components.map((c, i) => {
          const isLast =
            blueprint.stack.components.length % 2 !== 0 &&
            i === blueprint.stack.components.length - 1;
          return (
            <div key={c.id} className={isLast ? "col-span-2" : ""}>
              <ComponentCard component={c} />
            </div>
          );
        })}
      </div>

      {/* ── Flux d'exécution ── */}
      <div className="rounded-xl border border-border/50 bg-card/60 p-4">
        <h4 className="text-xs font-semibold text-muted-foreground mb-2.5">
          Execution flow
        </h4>
        <ul className="space-y-1.5">
          {flowSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
              <span>
                {step}
                {i < flowSteps.length - 1 && (
                  <ArrowRight className="inline h-3 w-3 mx-1 text-muted-foreground" />
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── System prompt ── */}
      <div className="rounded-xl border border-border/50 bg-card/60 p-4">
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-semibold text-muted-foreground">
            System prompt
          </h4>
          <CopyBtn text={blueprint.systemPrompt} />
        </div>
        <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
          {blueprint.systemPrompt}
        </pre>
      </div>

      {/* ── MCP Config ── */}
      {mcpConfigJson && (
        <div className="rounded-xl border border-border/50 bg-card/60 p-4">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-semibold text-muted-foreground">
              MCP Config
            </h4>
            <CopyBtn text={mcpConfigJson} />
          </div>
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
            {mcpConfigJson}
          </pre>
        </div>
      )}

      {/* ── Install command ── */}
      <div className="rounded-xl border border-border/50 bg-card/60 p-4">
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="text-xs font-semibold text-muted-foreground">
            Install command
          </h4>
          <CopyBtn text={blueprint.installCommand} />
        </div>
        <code className="text-xs text-muted-foreground font-mono">
          {blueprint.installCommand}
        </code>
      </div>

      {/* ── CTAs ── */}
      <div className="flex gap-2.5">
        <Button variant="outline" className="flex-1 gap-2 text-sm" size="sm">
          <Download className="h-3.5 w-3.5" />
          Publish on-chain
        </Button>
        <Button className="flex-1 gap-2 text-sm bg-violet-600 hover:bg-violet-700" size="sm">
          <MessageSquareWarning className="h-3.5 w-3.5" />
          Something's off — improve
        </Button>
      </div>
    </div>
  );
}
