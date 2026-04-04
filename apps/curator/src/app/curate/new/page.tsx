"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@wispr/ui";
import { useWalletConnection, WalletConnect } from "@wispr/wallet";

const TYPES = [
  { value: "mcp", icon: "🔌", label: "MCP" },
  { value: "skill", icon: "🧠", label: "Skill" },
  { value: "package", icon: "📦", label: "Package" },
  { value: "api", icon: "⚡", label: "API" },
  { value: "model", icon: "🤖", label: "Model" },
  { value: "agent", icon: "🛠️", label: "Agent" },
];

const AUTONOMY = [
  { value: "low", label: "Low", description: "Needs human approval" },
  { value: "medium", label: "Medium", description: "Semi-autonomous" },
  { value: "high", label: "High", description: "Fully autonomous" },
];

export default function NewAtomPage() {
  const router = useRouter();
  const { isConnected } = useWalletConnection();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("Chainlink Data Feeds");
  const [url, setUrl] = useState("https://docs.chain.link/data-feeds");
  const [description, setDescription] = useState("Real-time on-chain price oracles for crypto assets. Provides tamper-proof, decentralized price data for DeFi protocols.");
  const [type, setType] = useState<string | null>("api");
  const [autonomy, setAutonomy] = useState<string | null>("high");

  const isValid = name.trim() && type && description.trim();

  const handleSave = () => {
    if (!isValid) return;
    setSaving(true);
    setTimeout(() => {
      router.push("/curate/chainlink-data-feeds");
    }, 800);
  };

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 page-header backdrop-blur-xl px-5 py-5">
        <h1 className="page-title">Add New</h1>
        <p className="text-sm text-text-secondary mt-1">
          Add a new component to the knowledge graph
        </p>
      </div>

      <div className="relative w-full px-5 py-8 flex flex-col gap-7">
        {/* Wallet gate */}
        {!isConnected && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-bg/70 backdrop-blur-sm">
            <span className="text-4xl">🔒</span>
            <h2 className="text-xl font-bold text-text-primary">Connect your wallet</h2>
            <p className="text-sm text-text-secondary max-w-[300px] text-center">
              Connect your wallet to create and publish atoms on-chain.
            </p>
            <WalletConnect />
          </div>
        )}

        {/* Two columns */}
        <div className={`flex gap-6 ${!isConnected ? "blur-sm pointer-events-none" : ""}`}>
          {/* Left — Name, URL, Description */}
          <div className="flex-1 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-primary">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. MCP Notion"
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary text-[15px] outline-none transition-colors focus:border-border-light placeholder:text-text-muted"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-primary">URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-accent text-[15px] outline-none transition-colors focus:border-border-light placeholder:text-text-muted"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-primary">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this component do?"
                maxLength={280}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary text-[15px] outline-none resize-none transition-colors focus:border-border-light placeholder:text-text-muted"
              />
              <span className="text-[11px] text-text-muted text-right">{description.length}/280</span>
            </div>
          </div>

          {/* Right — Type, Autonomy */}
          <div className="flex-1 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-primary">Type</label>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <Button
                    key={t.value}
                    variant={type === t.value ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setType(t.value)}
                    style={{
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.2s ease",
                      ...(type === t.value
                        ? { background: "#d4ff47", color: "#06070f", border: "1px solid #d4ff47", boxShadow: "0 0 16px rgba(212, 255, 71, 0.2)" }
                        : { background: "transparent", color: "#8888a0", border: "1px solid #2d2d52" }
                      ),
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>{t.icon}</span>
                    {t.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-text-primary">Autonomy level</label>
              <div className="flex flex-col gap-2">
                {AUTONOMY.map((a) => (
                  <Button
                    key={a.value}
                    variant={autonomy === a.value ? "primary" : "ghost"}
                    size="md"
                    onClick={() => setAutonomy(a.value)}
                    style={{
                      width: "100%",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      transition: "all 0.2s ease",
                      ...(autonomy === a.value
                        ? { background: "#1990ff", color: "#fff", border: "1px solid #1990ff", boxShadow: "0 0 16px rgba(25, 144, 255, 0.25)" }
                        : { background: "transparent", color: "#8888a0", border: "1px solid #2d2d52" }
                      ),
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: 700, color: autonomy === a.value ? "#fff" : "#e8e8ec" }}>{a.label}</span>
                    <span style={{ fontSize: "12px", opacity: 0.7 }}>{a.description}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className={!isConnected ? "blur-sm pointer-events-none" : ""}>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSave}
            disabled={saving || !isValid || !isConnected}
            style={{
              width: "100%",
              borderRadius: "12px",
              padding: "16px 24px",
              fontSize: "15px",
              fontWeight: 700,
              background: !isValid ? "#2d2d52" : saving ? "rgba(212, 255, 71, 0.4)" : "#d4ff47",
              color: !isValid ? "#4a4a6a" : "#06070f",
              border: "none",
              boxShadow: !isValid || saving ? "none" : "0 0 24px rgba(212, 255, 71, 0.2)",
              transition: "all 0.3s ease",
              cursor: !isValid || saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <span className="w-4 h-4 border-2 border-bg/40 border-t-bg rounded-full animate-spin" style={{ display: "inline-block" }} />
                Saving on-chain...
              </span>
            ) : (
              "Save atom"
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
