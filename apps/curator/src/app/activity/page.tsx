"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@wispr/ui";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConversationSummary {
  id: string;
  sessionId: string;
  createdAt: number;
  messageCount: number;
  preview: string;
  goodCount: number;
  badCount: number;
}

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  model: string | null;
  latencyMs: number | null;
  createdAt: number;
}

interface BlueprintComponent {
  id: string;
  componentId: string;
  componentType: string;
  componentName: string;
  intuitionAtomId: string | null;
  intuitionTripleId: string | null;
  trustScoreAtTime: number | null;
  position: number;
  adopted: number;
}

interface Blueprint {
  id: string;
  conversationId: string;
  intent: string;
  createdAt: number;
}

interface IntuitionAtom {
  termId: string;
  label: string;
  vaultTermId: string | null;
  positionCount: number;
  marketCap: string;
  triples: {
    tripleTermId: string;
    predicate: string;
    object: string;
    vaultTermId: string | null;
    counterVaultTermId: string | null;
    forCount: number;
    againstCount: number;
  }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimeAgo(unixSec: number): string {
  const diff = Math.floor(Date.now() / 1000) - unixSec;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const TYPE_STYLE: Record<string, { bg: string; color: string }> = {
  mcp:     { bg: "rgba(25,144,255,0.12)",  color: "var(--color-accent)" },
  model:   { bg: "rgba(168,85,247,0.12)",  color: "var(--color-purple)" },
  llm:     { bg: "rgba(168,85,247,0.12)",  color: "var(--color-purple)" },
  skill:   { bg: "rgba(212,255,71,0.12)",  color: "var(--color-pear)" },
  api:     { bg: "rgba(34,197,94,0.12)",   color: "var(--color-green)" },
  package: { bg: "rgba(255,204,111,0.12)", color: "var(--color-amber)" },
  agent:   { bg: "rgba(25,144,255,0.12)",  color: "var(--color-accent)" },
};

function typeStyle(t: string) {
  return TYPE_STYLE[t] ?? { bg: "rgba(255,255,255,0.06)", color: "var(--color-text-secondary)" };
}

/** Try to extract and parse a JSON blueprint from the assistant message content. */
function parseBlueprintFromContent(content: string): Record<string, any> | null {
  const match = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/(\{[\s\S]*\})/);
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch { return null; }
}

// ─── Blueprint Message ────────────────────────────────────────────────────────

function BlueprintMessage({ content, latencyMs, model }: { content: string; latencyMs: number | null; model: string | null }) {
  const bp = parseBlueprintFromContent(content);

  if (!bp) {
    return (
      <div
        className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
        style={{ background: "var(--color-surface-2)", color: "var(--color-text-primary)", border: "1px solid var(--color-border)" }}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>
      </div>
    );
  }

  const components: any[] = bp.stack?.components ?? [];
  const flow: string = bp.stack?.flow ?? "";

  return (
    <div
      className="w-full rounded-2xl overflow-hidden text-sm"
      style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
    >
      {/* Blueprint header */}
      <div className="px-4 pt-4 pb-3 border-b border-border/60">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-bold text-text-primary">{bp.title ?? "Blueprint"}</p>
            {bp.domains?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {bp.domains.map((d: string) => (
                  <span key={d} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(212,255,71,0.1)", color: "var(--color-pear)" }}>{d}</span>
                ))}
              </div>
            )}
          </div>
          {bp.resolvedIn && (
            <span className="text-[10px] text-text-muted shrink-0 mt-0.5">{bp.resolvedIn}</span>
          )}
        </div>
      </div>

      {/* Components */}
      {components.length > 0 && (
        <div className="px-4 py-3 flex flex-col gap-2">
          {components.map((c: any, i: number) => {
            const s = typeStyle(c.type ?? "package");
            return (
              <div key={c.id ?? i} className="flex items-center gap-2.5">
                <span className="text-xs text-text-muted w-4 shrink-0">{i + 1}.</span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase shrink-0"
                  style={{ background: s.bg, color: s.color }}
                >
                  {c.type}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{c.name}</p>
                  {c.description && <p className="text-[11px] text-text-muted truncate">{c.description}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Flow */}
      {flow && (
        <div className="px-4 py-2 border-t border-border/60">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Flow</p>
          <p className="text-xs text-text-secondary">{flow}</p>
        </div>
      )}

      {/* LLMs */}
      {bp.llms?.length > 0 && (
        <div className="px-4 py-2 border-t border-border/60 flex flex-wrap gap-1.5">
          {bp.llms.map((l: any, i: number) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(168,85,247,0.12)", color: "var(--color-purple)" }}>
              {l.model}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      {(latencyMs || model) && (
        <div className="px-4 py-2 border-t border-border/60">
          <p className="text-[10px] text-text-muted opacity-50">
            {latencyMs ? `${(latencyMs / 1000).toFixed(1)}s` : ""}{latencyMs && model ? " · " : ""}{model ?? ""}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Deposit Buttons ──────────────────────────────────────────────────────────

function DepositButtons({ componentName }: { componentName: string }) {
  const [atom, setAtom] = useState<IntuitionAtom | null | "loading">("loading");

  useEffect(() => {
    fetch(`/api/intuition/lookup?name=${encodeURIComponent(componentName)}`)
      .then((r) => r.json())
      .then((data) => setAtom(data.atom ?? null))
      .catch(() => setAtom(null));
  }, [componentName]);

  const isLoading = atom === "loading";
  const forUrl = atom && atom !== "loading"
    ? `https://app.intuition.systems/explore?a=${atom.triples[0]?.vaultTermId ?? atom.vaultTermId ?? atom.termId}`
    : null;
  const againstUrl = atom && atom !== "loading" && atom.triples[0]?.counterVaultTermId
    ? `https://app.intuition.systems/explore?a=${atom.triples[0].counterVaultTermId}`
    : null;

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {forUrl ? (
        <a href={forUrl} target="_blank" rel="noopener noreferrer" title="Deposit $TRUST — confirm"
          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base transition-all hover:scale-110 active:scale-95"
          style={{ background: "rgba(34,197,94,0.15)", color: "var(--color-green)", border: "1px solid rgba(34,197,94,0.35)" }}>
          ↑
        </a>
      ) : (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base opacity-25"
          style={{ background: "rgba(34,197,94,0.15)", color: "var(--color-green)", border: "1px solid rgba(34,197,94,0.35)" }}>
          {isLoading ? <span className="text-xs animate-pulse">·</span> : "↑"}
        </div>
      )}

      {againstUrl ? (
        <a href={againstUrl} target="_blank" rel="noopener noreferrer" title="Deposit against — contest"
          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base transition-all hover:scale-110 active:scale-95"
          style={{ background: "rgba(239,68,68,0.15)", color: "var(--color-red)", border: "1px solid rgba(239,68,68,0.35)" }}>
          ↓
        </a>
      ) : (
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base opacity-25"
          style={{ background: "rgba(239,68,68,0.15)", color: "var(--color-red)", border: "1px solid rgba(239,68,68,0.35)" }}>
          {isLoading ? <span className="text-xs animate-pulse">·</span> : "↓"}
        </div>
      )}

    </div>
  );
}

// ─── Chat Modal ───────────────────────────────────────────────────────────────

function ChatModal({ conversationId, onClose }: { conversationId: string; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [components, setComponents] = useState<BlueprintComponent[]>([]);
  const [tab, setTab] = useState<"chat" | "stack">("chat");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/conversations/${conversationId}`)
      .then((r) => r.json())
      .then((data) => {
        setMsgs(data.messages ?? []);
        setBlueprint(data.blueprint ?? null);
        setComponents(data.components ?? []);
      });
  }, [conversationId]);

  useEffect(() => {
    if (tab === "chat") bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, tab]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(6,7,15,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="flex flex-col w-full max-w-2xl rounded-2xl border border-border overflow-hidden"
        style={{ background: "var(--color-surface)", maxHeight: "88vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-text-primary">Conversation</span>
            <span className="text-xs text-text-muted font-mono">{conversationId.slice(0, 8)}…</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg overflow-hidden border border-border">
              {(["chat", "stack"] as const).map((t) => (
                <Button key={t} variant={tab === t ? "primary" : "ghost"} size="sm"
                  onClick={() => setTab(t)}
                  style={{
                    borderRadius: 0,
                    border: "none",
                    fontSize: "12px",
                    fontWeight: 600,
                    padding: "4px 12px",
                    ...(tab === t
                      ? { background: "var(--color-accent)", color: "#fff" }
                      : { background: "transparent", color: "var(--color-text-secondary)" }),
                  }}
                >
                  {t === "chat" ? "💬 Chat" : "🔧 Stack"}
                </Button>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}
              style={{ borderRadius: "8px", border: "none", color: "var(--color-text-muted)", padding: "4px 8px", minWidth: "28px" }}>
              ✕
            </Button>
          </div>
        </div>

        {/* Chat tab */}
        {tab === "chat" && (
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
            {msgs.length === 0 && (
              <p className="text-sm text-text-muted text-center py-8">No messages.</p>
            )}
            {msgs.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "system" ? (
                  <details className="w-full group">
                    <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg w-fit"
                      style={{ color: "var(--color-text-muted)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      System prompt
                    </summary>
                    <div className="mt-2 rounded-xl px-4 py-3 text-xs leading-relaxed font-mono whitespace-pre-wrap break-words"
                      style={{ background: "rgba(255,255,255,0.03)", color: "var(--color-text-muted)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      {msg.content}
                    </div>
                  </details>
                ) : msg.role === "user" ? (
                  <div
                    className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                    style={{ background: "var(--color-accent)", color: "#fff" }}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                ) : (
                  <BlueprintMessage content={msg.content} latencyMs={msg.latencyMs} model={msg.model} />
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Stack tab */}
        {tab === "stack" && (
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
            {blueprint && (
              <div className="p-3 rounded-xl border border-border/60" style={{ background: "var(--color-surface-2)" }}>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Intent</p>
                <p className="text-sm text-text-primary font-medium leading-relaxed">"{blueprint.intent}"</p>
              </div>
            )}

            {components.length === 0 && (
              <p className="text-sm text-text-muted text-center py-8">No components recorded.</p>
            )}

            {components.map((comp) => {
              const style = typeStyle(comp.componentType);
              return (
                <div key={comp.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border"
                  style={{ background: "var(--color-surface-2)" }}
                >
                  <span className="text-xs font-bold text-text-muted w-5 shrink-0">{comp.position + 1}.</span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0"
                    style={{ background: style.bg, color: style.color }}
                  >
                    {comp.componentType}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{comp.componentName}</p>
                    <p className="text-[11px] text-text-muted font-mono truncate">{comp.componentId}</p>
                  </div>
                  <DepositButtons componentName={comp.componentName} />
                </div>
              );
            })}

            {components.length > 0 && (
              <p className="text-xs text-text-muted text-center pt-1">
                ↑ confirm · ↓ contest · on-chain deposits on Intuition (chain 1155)
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Activity Page ────────────────────────────────────────────────────────────

export default function ActivityPage() {
  const [convos, setConvos] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/conversations")
      .then((r) => r.json())
      .then((data) => { setConvos(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function handleClose() {
    setOpenId(null);
    fetch("/api/conversations").then((r) => r.json()).then(setConvos);
  }

  return (
    <>
      <div className="sticky top-0 z-10 bg-bg/65 backdrop-blur-xl border-b border-border px-5 py-3">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Activity</h1>
        <p className="text-sm text-text-primary mt-1">
          Agent exchanges · Deposit $TRUST on Intuition to validate stacks
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-sm text-text-muted animate-pulse">Loading…</div>
        </div>
      ) : convos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="text-4xl opacity-30">⚡</div>
          <p className="text-sm text-text-muted">No activity yet.</p>
          <p className="text-xs text-text-muted opacity-60">Wispr chat exchanges will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
          {convos.map((convo) => (
            <div key={convo.id} onClick={() => setOpenId(convo.id)}
              className="bg-bg p-5 flex flex-col gap-3 cursor-pointer group rounded-xl border border-border transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:border-accent/30"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 group-hover:scale-110 transition-all duration-300"
                  style={{ background: "rgba(212,255,71,0.1)", border: "1px solid rgba(212,255,71,0.2)" }}
                >
                  ⚡
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-mono text-text-muted truncate">{convo.id.slice(0, 12)}…</div>
                  <div className="text-xs text-text-muted mt-0.5">{formatTimeAgo(convo.createdAt)} · {convo.messageCount} msg</div>
                </div>
              </div>

              <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                {convo.preview || <span className="italic text-text-muted">No content</span>}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-xs text-text-muted">{new Date(convo.createdAt * 1000).toLocaleDateString("en-US")}</span>
                <span className="text-xs text-accent group-hover:translate-x-0.5 transition-transform duration-200">Review →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {openId && <ChatModal conversationId={openId} onClose={handleClose} />}
    </>
  );
}
