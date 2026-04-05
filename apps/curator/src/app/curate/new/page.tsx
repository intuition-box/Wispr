"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@wispr/ui";
import { useWalletConnection, WalletConnect } from "@wispr/wallet";
import { getAllContexts, getTermId } from "@/lib/termIds";

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

const GRAPHQL_URL = "https://mainnet.intuition.sh/v1/graphql";

export default function NewAtomPage() {
  const router = useRouter();
  const { wallet, isConnected } = useWalletConnection();
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [step, setStep] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<string | null>(null);
  const [context, setContext] = useState<string | null>(null);
  const [autonomy, setAutonomy] = useState<string | null>(null);

  const existingContexts = getAllContexts();
  const isValid = name.trim() && type && description.trim() && context;

  const handleSave = async () => {
    if (!isValid || !wallet?.multiVault || !wallet.address) return;

    setSaving(true);
    setError(null);
    setTxHash(null);

    try {
      const { ethers } = await import("ethers");

      // Step 1: Pin metadata via Intuition GraphQL
      setStep("Pinning metadata...");
      const pinRes = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `mutation PinThing($name: String!, $description: String!, $image: String!, $url: String) {
            pinThing(thing: { name: $name, description: $description, image: $image, url: $url }) { uri }
          }`,
          variables: {
            name,
            description,
            image: "https://via.placeholder.com/256x256.png?text=WisPear",
            url: url || null,
          },
        }),
      });
      const pinData = await pinRes.json();
      const uri = pinData.data?.pinThing?.uri;
      if (!uri) throw new Error("Failed to pin metadata");

      // Step 2: Create atom on-chain
      setStep("Creating atom on-chain...");
      const hexData = ethers.hexlify(ethers.toUtf8Bytes(uri));
      const atomCost = await wallet.multiVault.getAtomCost();

      const atomTx = await wallet.multiVault.createAtoms(
        [hexData],
        [atomCost],
        { value: atomCost },
      );
      await atomTx.wait();

      const atomId = await wallet.multiVault.calculateAtomId(hexData);

      // Step 3: Create base triple (component → is-best-of → type)
      setStep("Creating type classification...");
      const typeTermId = getTermId(type!);
      const isBestOfId = getTermId("is-best-of");

      if (!typeTermId || !isBestOfId) throw new Error("Missing predicate or type atom on-chain");

      const tripleCost = await wallet.multiVault.getTripleCost();

      const t1Tx = await wallet.multiVault.createTriples(
        [atomId],
        [isBestOfId],
        [typeTermId],
        [tripleCost],
        { value: tripleCost },
      );
      await t1Tx.wait();

      const t1Id = await wallet.multiVault.calculateTripleId(atomId, isBestOfId, typeTermId);

      // Step 4: Create nested triple (T1 → in-context-of → context)
      setStep("Setting context...");
      const contextTermId = getTermId(context!);
      const inContextOfId = getTermId("in-context-of");

      if (!contextTermId || !inContextOfId) throw new Error("Missing context or predicate atom on-chain");

      const t2Tx = await wallet.multiVault.createTriples(
        [t1Id],
        [inContextOfId],
        [contextTermId],
        [tripleCost],
        { value: tripleCost },
      );

      setTxHash(t2Tx.hash);
      await t2Tx.wait();

      setStep("Published!");
      setDone(true);
      setSaving(false);

      const slug = name.toLowerCase().replace(/\+/g, "plus").replace(/[\s.]/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
      setTimeout(() => router.push(`/curate/${slug}`), 2000);
    } catch (err: unknown) {
      console.error("Create failed:", err);
      setError(err instanceof Error ? err.message.split("(")[0].trim() : "Transaction failed");
      setSaving(false);
    }
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

          {/* Right — Type, Context, Autonomy */}
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
              <label className="text-sm font-semibold text-text-primary">Context</label>
              <p className="text-[12px] text-text-muted -mt-1">What is this component best for?</p>
              <div className="flex flex-wrap gap-2">
                {existingContexts.map((ctx) => (
                  <button
                    key={ctx}
                    onClick={() => setContext(context === ctx ? null : ctx)}
                    className={`text-[12px] font-semibold px-4 py-1.5 rounded-full border transition-all duration-200 ${
                      context === ctx
                        ? "bg-accent text-bg border-accent"
                        : "bg-transparent text-text-secondary border-border hover:border-border-light hover:text-text-primary"
                    }`}
                  >
                    {ctx.replace(/-/g, " ")}
                  </button>
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

        {/* Progress / Error / Success */}
        {saving && step && (
          <div className="flex items-center gap-2 text-[13px] text-pear bg-pear/10 rounded-lg px-4 py-3 border border-pear/20">
            <span className="w-4 h-4 border-2 border-pear/40 border-t-pear rounded-full animate-spin shrink-0" />
            <span>{step}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-[13px] text-red-400 bg-red-400/10 rounded-lg px-4 py-3 border border-red-400/20">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {txHash && !saving && (
          <div className="flex items-center gap-2 text-[13px] text-pear bg-pear/10 rounded-lg px-4 py-3 border border-pear/20">
            <span>✓</span>
            <span>
              Published on-chain!{" "}
              <a
                href={`https://explorer.intuition.systems/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View tx ↗
              </a>
            </span>
          </div>
        )}

        {/* Save */}
        <div className={!isConnected ? "blur-sm pointer-events-none" : ""}>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSave}
            disabled={saving || done || !isValid || !isConnected}
            style={{
              width: "100%",
              borderRadius: "12px",
              padding: "16px 24px",
              fontSize: "15px",
              fontWeight: 700,
              background: !isValid ? "#2d2d52" : (saving || done) ? "rgba(212, 255, 71, 0.4)" : "#d4ff47",
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
                {step}
              </span>
            ) : (
              "🍐 Whisper your wisdom"
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
