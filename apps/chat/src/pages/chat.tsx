import { useState, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlueprintCard } from "@/components/blueprint-card";
import { ImproveChoiceCard } from "@/components/improve-choice-card";
import type { Blueprint } from "@/lib/mock-blueprint";

interface Message {
  role: "user" | "agent";
  content?: string;
  blueprint?: Blueprint;
  improveChoice?: Blueprint;
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        body: JSON.stringify({ message: text }),
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
    setMessages((prev) => [
      ...prev,
      { role: "agent", improveChoice: blueprint },
    ]);
    scrollToBottom();
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
    <main className="flex flex-col h-screen max-w-3xl mx-auto">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 pt-12 pb-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-2xl font-bold tracking-tight">Wispear</h1>
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
                {msg.blueprint && (
                  <BlueprintCard
                    blueprint={msg.blueprint}
                    onImprove={() => handleImprove(msg.blueprint!)}
                  />
                )}
                {msg.improveChoice && (
                  <ImproveChoiceCard
                    blueprint={msg.improveChoice}
                    onSwapTool={(id) => handleSwapTool(msg.improveChoice!, id)}
                    onAddNew={() => handleAddNew(msg.improveChoice!)}
                  />
                )}
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

        <div ref={messagesEndRef} />
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
