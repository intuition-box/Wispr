"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlueprintCard } from "@/components/blueprint-card";
import { LoadingTips } from "@/components/loading-tips";
import type { Blueprint } from "@/lib/mock-blueprint";

// Pear icon SVG (dark theme) — reused from packages/ui Logo
function PearIconSmall({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="60 20 200 230" className={className} role="img" aria-label="Wispear">
      <defs>
        <linearGradient id="pearGradNav" x1="0%" y1="0%" x2="40%" y2="100%">
          <stop offset="0%" stopColor="#d4ff47" />
          <stop offset="40%" stopColor="#55e292" />
          <stop offset="100%" stopColor="#1990ff" />
        </linearGradient>
      </defs>
      <g transform="translate(20, -10)">
        <path d="M 152 75 C 152 45 178 40 188 45 C 183 62 163 72 152 75 Z" fill="#d4ff47" />
        <path d="M 148 76 C 145 52 122 47 112 52 C 117 68 137 73 148 76 Z" fill="#aaff2b" />
        <path d="M 150 75 C 165 75 175 95 180 120 C 185 145 215 155 215 185 C 215 215 185 235 150 235 C 115 235 85 215 85 185 C 85 155 115 145 120 120 C 125 95 135 75 150 75 Z" fill="url(#pearGradNav)" />
      </g>
    </svg>
  );
}

interface Message {
  role: "user" | "agent";
  content?: string;
  blueprint?: Blueprint;
}

function getOrCreateSessionId(): string {
  const key = "wispr_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const sessionId = useRef<string>("");
  const conversationId = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    sessionId.current = getOrCreateSessionId();
  }, []);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0 || loading;

  function scrollToBottom() {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  async function submit() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    scrollToBottom();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId.current,
          conversationId: conversationId.current,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const blueprint = await res.json();
      setMessages((prev) => [...prev, { role: "agent", blueprint }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: `Error: ${(err as Error).message}` },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }

  function handleImprove(blueprint: Blueprint) {
    const curatorUrl = process.env.NEXT_PUBLIC_CURATOR_URL ?? "http://localhost:3001";
    const payload = blueprint.stack.components.map((c) => {
      const baseTripleId = `T1-${c.id}`;
      return {
        component: {
          id: c.id,
          name: c.name,
          description: c.description,
          url: c.url,
        },
        baseTriple: {
          id: baseTripleId,
          subject: c.id,
          predicate: "is-best-of",
          object: c.type,
          label: `${c.name} is-best-of ${c.type}`,
        },
        nestedTriple: c.context
          ? {
              subjectTriple: baseTripleId,
              predicate: "in-context-of",
              object: c.context,
              label: `(${c.name} is-best-of ${c.type}) in-context-of ${c.context}`,
            }
          : null,
        trustScore: c.trustScore,
        curatorCount: c.curatorCount,
      };
    });
    const data = btoa(JSON.stringify(payload));
    window.open(`${curatorUrl}/curate?blueprint=${data}`, "_blank");
  }

  function handleSwapTool(blueprint: Blueprint, componentId: string) {
    const comp = blueprint.stack.components.find((c) => c.id === componentId);
    const toolName = comp?.name ?? componentId;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: `I want to replace ${toolName}` },
      {
        role: "agent",
        content: `Noted! Replacing ${toolName} — this will be published on-chain once the feature is live.`,
      },
    ]);
    scrollToBottom();
  }

  function handleAddNew(blueprint: Blueprint) {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: "I want to add a new tool" },
      {
        role: "agent",
        content: "Noted! Adding a new tool — this will be published on-chain once the feature is live.",
      },
    ]);
    scrollToBottom();
  }

  return (
    <div className="relative h-screen">
      {hasMessages && (
        <div className="hidden sm:flex fixed top-4 left-6 flex-col items-center z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -10 920 280" className="h-16" role="img" aria-label="Wispear">
            <defs>
              <linearGradient id="pearGradFixed" x1="0%" y1="0%" x2="40%" y2="100%">
                <stop offset="0%" stopColor="#d4ff47" />
                <stop offset="40%" stopColor="#55e292" />
                <stop offset="100%" stopColor="#1990ff" />
              </linearGradient>
              <filter id="ringGlowFixed" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur1" />
                <feGaussianBlur stdDeviation="2" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="baseLightFixed" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="12" />
              </filter>
            </defs>
            <g transform="translate(20, 0)">
              <g transform="translate(0, 220)">
                <ellipse cx="150" cy="0" rx="70" ry="16" fill="#00ffff" opacity="0.4" filter="url(#baseLightFixed)" />
                <ellipse cx="150" cy="0" rx="60" ry="14" fill="none" stroke="#00ffff" strokeWidth="4" filter="url(#ringGlowFixed)" />
                <ellipse cx="150" cy="0" rx="56" ry="12" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
              </g>
              <g transform="translate(0, -10)">
                <path d="M 152 75 C 152 45 178 40 188 45 C 183 62 163 72 152 75 Z" fill="#d4ff47" />
                <path d="M 148 76 C 145 52 122 47 112 52 C 117 68 137 73 148 76 Z" fill="#aaff2b" />
                <path d="M 150 75 C 165 75 175 95 180 120 C 185 145 215 155 215 185 C 215 215 185 235 150 235 C 115 235 85 215 85 185 C 85 155 115 145 120 120 C 125 95 135 75 150 75 Z" fill="url(#pearGradFixed)" />
              </g>
            </g>
            <text x="450" y="205" textAnchor="middle" fontFamily="'Montserrat', 'Inter', sans-serif" fontSize="85" fontWeight="900" fill="#ffffff" letterSpacing="-2">
              wis<tspan fill="#00ffff">p</tspan>ear<tspan fill="#00ffff">.ai</tspan>
            </text>
          </svg>
        </div>
      )}

{/* Mobile top bar (blueprint page only) */}
      {hasMessages && <div className="sm:hidden flex items-center gap-3 px-4 py-3 border-b border-border/50">
        <PearIconSmall className="h-8 w-8" />
        <h1 className="text-sm font-black tracking-tighter" style={{ fontFamily: "var(--font-heading)" }}>
          wis<span className="text-[#00ffff]">p</span>ear<span className="text-[#00ffff]">.ai</span>
        </h1>
      </div>}

    <main className="flex flex-col h-full sm:h-screen max-w-3xl mx-auto px-4 sm:px-6">

      {/* ── Messages area ── */}
      <div className="flex-1 overflow-y-auto pt-4 sm:pt-24 pb-4 space-y-8">
        {/* ── Empty state ── */}
        {!hasMessages && (
          <div className="flex flex-col items-center h-full text-center">
            {/* Combined logo */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -10 920 280" className="h-36 sm:h-64 md:h-80" role="img" aria-label="Wispear">
              <defs>
                <linearGradient id="pearGradHome" x1="0%" y1="0%" x2="40%" y2="100%">
                  <stop offset="0%" stopColor="#d4ff47" />
                  <stop offset="40%" stopColor="#55e292" />
                  <stop offset="100%" stopColor="#1990ff" />
                </linearGradient>
                <filter id="ringGlowHome" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur1" />
                  <feGaussianBlur stdDeviation="2" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur1" />
                    <feMergeNode in="blur2" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="baseLightHome" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="12" />
                </filter>
              </defs>
              <g transform="translate(20, 0)">
                <g transform="translate(0, 220)">
                  <ellipse cx="150" cy="0" rx="70" ry="16" fill="#00ffff" opacity="0.4" filter="url(#baseLightHome)" />
                  <ellipse cx="150" cy="0" rx="60" ry="14" fill="none" stroke="#00ffff" strokeWidth="4" filter="url(#ringGlowHome)" />
                  <ellipse cx="150" cy="0" rx="56" ry="12" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
                </g>
                <g transform="translate(0, -10)">
                  <path d="M 152 75 C 152 45 178 40 188 45 C 183 62 163 72 152 75 Z" fill="#d4ff47" />
                  <path d="M 148 76 C 145 52 122 47 112 52 C 117 68 137 73 148 76 Z" fill="#aaff2b" />
                  <path d="M 150 75 C 165 75 175 95 180 120 C 185 145 215 155 215 185 C 215 215 185 235 150 235 C 115 235 85 215 85 185 C 85 155 115 145 120 120 C 125 95 135 75 150 75 Z" fill="url(#pearGradHome)" />
                </g>
              </g>
              <text x="450" y="205" textAnchor="middle" fontFamily="'Montserrat', 'Inter', sans-serif" fontSize="85" fontWeight="900" fill="#ffffff" letterSpacing="-2">
                wis<tspan fill="#00ffff">p</tspan>ear<tspan fill="#00ffff">.ai</tspan>
              </text>
            </svg>

            <p className="hidden sm:block text-lg text-muted-foreground mt-2 max-w-md px-4" style={{ fontFamily: "var(--font-heading)" }}>
              Collective wisdom, whispered to your agent.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-12 sm:mt-6 w-full max-w-md px-4">
              <button
                onClick={() =>
                  setInput(
                    "I want to automatically turn my Notion notes into Twitter threads every week"
                  )
                }
                className="text-sm text-muted-foreground bg-secondary hover:bg-secondary/80 rounded-lg px-4 py-3 transition-colors flex items-center justify-center text-center min-h-[60px]"
              >
                Notion → Twitter threads
              </button>
              <button
                onClick={() =>
                  setInput(
                    "I want an agent that automatically rebalances my DeFi portfolio"
                  )
                }
                className="text-sm text-muted-foreground bg-secondary hover:bg-secondary/80 rounded-lg px-4 py-3 transition-colors flex items-center justify-center text-center min-h-[60px]"
              >
                DeFi portfolio rebalancer
              </button>
              <button
                onClick={() =>
                  setInput(
                    "I want my GitHub pull requests to receive automatic reviews as soon as they're opened"
                  )
                }
                className="text-sm text-muted-foreground bg-secondary hover:bg-secondary/80 rounded-lg px-4 py-3 transition-colors flex items-center justify-center text-center min-h-[60px]"
              >
                Auto PR reviews
              </button>
              <button
                onClick={() =>
                  setInput(
                    "I want to receive every morning only job offers that match my profile"
                  )
                }
                className="text-sm text-muted-foreground bg-secondary hover:bg-secondary/80 rounded-lg px-4 py-3 transition-colors flex items-center justify-center text-center min-h-[60px]"
              >
                Job matching emails
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i}>
            {msg.role === "user" ? (
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5 max-w-[85%] sm:max-w-lg">
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {msg.content && (
                  <p className="text-sm text-muted-foreground">{msg.content}</p>
                )}
                {msg.blueprint && (
                  <BlueprintCard blueprint={msg.blueprint} />
                )}
              </div>
            )}
          </div>
        ))}

        {loading && <LoadingTips />}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input bar ── */}
      <div className="border-t border-border px-2 sm:px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            className="flex-1 resize-none bg-secondary rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="I want to build..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            disabled={loading}
          />
          <Button
            size="icon"
            className="h-10 w-10 rounded-xl shrink-0"
            onClick={submit}
            disabled={loading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
    </div>
  );
}

