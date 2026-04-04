"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlueprintCard } from "@/components/blueprint-card";
import { mockBlueprintW4, mockBlueprintP3 } from "@/lib/mock-blueprint";
import type { Blueprint } from "@/lib/mock-blueprint";

// Simulate agent response — picks blueprint based on keywords
function matchBlueprint(input: string): Blueprint {
  const lower = input.toLowerCase();
  if (
    lower.includes("defi") ||
    lower.includes("rebalance") ||
    lower.includes("portfolio") ||
    lower.includes("swap")
  ) {
    return mockBlueprintP3;
  }
  return mockBlueprintW4;
}

interface Message {
  role: "user" | "agent";
  content?: string;
  blueprint?: Blueprint;
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  function submit() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    // Simulate agent thinking delay
    setTimeout(() => {
      const blueprint = matchBlueprint(text);
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          blueprint,
        },
      ]);
      setLoading(false);
    }, 1500);
  }

  return (
    <main className="flex flex-col h-screen max-w-3xl mx-auto">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 pt-12 pb-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-2xl font-bold tracking-tight">Wispr</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Describe what you want to build.
            </p>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() =>
                  setInput(
                    "I want to automatically turn my Notion notes into Twitter threads every week"
                  )
                }
                className="text-xs text-muted-foreground bg-secondary hover:bg-secondary/80 rounded-lg px-3 py-2 transition-colors"
              >
                Notion → Twitter threads
              </button>
              <button
                onClick={() =>
                  setInput(
                    "I want an agent that automatically rebalances my DeFi portfolio"
                  )
                }
                className="text-xs text-muted-foreground bg-secondary hover:bg-secondary/80 rounded-lg px-3 py-2 transition-colors"
              >
                DeFi portfolio rebalancer
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i}>
            {msg.role === "user" ? (
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5 max-w-lg">
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {msg.content && (
                  <p className="text-sm text-muted-foreground">{msg.content}</p>
                )}
                {msg.blueprint && <BlueprintCard blueprint={msg.blueprint} />}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Composing blueprint…
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-border px-4 py-3">
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
  );
}
