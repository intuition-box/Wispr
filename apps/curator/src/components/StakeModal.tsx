"use client";

import { useState } from "react";
import { Button } from "@wispr/ui";
import type { WalletConnection } from "@wispr/wallet";
import { useWalletBalance } from "@wispr/wallet";

interface StakeModalProps {
  wallet: WalletConnection;
  termId: string;
  atomName: string;
  atomType?: string;
  context?: string;
  onClose: () => void;
}

export function StakeModal({ wallet, termId, atomName, atomType, context, onClose }: StakeModalProps) {
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState<"yes" | "no">("yes");
  const [staking, setStaking] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { formatted: balanceFormatted, value: balanceValue } = useWalletBalance(wallet.address ?? null);

  const handleStake = async () => {
    if (!wallet.multiVault || !wallet.address || !amount) return;

    setStaking(true);
    setError(null);
    setTxHash(null);

    try {
      const { ethers } = await import("ethers");
      const value = ethers.parseEther(amount);

      // If "no", deposit into the counter vault (against bonding curve)
      let depositTermId = termId;
      if (direction === "no") {
        depositTermId = await wallet.multiVault.getCounterIdFromTripleId(termId);
      }

      const tx = await wallet.multiVault.deposit(
        wallet.address,
        depositTermId,
        1,
        0,
        { value },
      );

      setTxHash(tx.hash);
      await tx.wait();
    } catch (err: unknown) {
      console.error("Stake failed:", err);
      setError(
        err instanceof Error ? err.message.split("(")[0].trim() : "Transaction failed",
      );
    } finally {
      setStaking(false);
    }
  };

  const contextLabel = context?.replace(/-/g, " ") ?? "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border rounded-2xl p-6 w-[440px] max-w-[90vw] flex flex-col gap-5 shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — pear + title on same line */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="text-xl">🍐</span> Whisper your $Trust
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:border-border-light transition-all"
          >
            ✕
          </button>
        </div>

        {/* Context */}
        {context && (
          <p className="text-[13px] text-text-secondary -mt-3">
            in context of <span className="font-semibold text-accent">{contextLabel}</span>
          </p>
        )}

        {/* Component card */}
        <div className="bg-surface-2 rounded-xl border border-border p-4 flex flex-col items-center gap-2">
          <span className="text-2xl font-bold text-text-primary">{atomName}</span>
          {atomType && (
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-pear-soft text-pear border border-pear/20 uppercase tracking-wider">
              {atomType}
            </span>
          )}
        </div>

        {/* Yes / No toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setDirection("yes")}
            className={`flex-1 h-10 rounded-lg flex items-center justify-center text-[13px] font-semibold gap-1.5 transition-all duration-200 ${
              direction === "yes"
                ? "bg-pear text-bg border border-pear"
                : "bg-transparent border border-pear/40 text-pear hover:bg-pear hover:text-bg"
            }`}
          >
            ✓ Yes
          </button>
          <button
            onClick={() => setDirection("no")}
            className={`flex-1 h-10 rounded-lg flex items-center justify-center text-[13px] font-semibold gap-1.5 transition-all duration-200 ${
              direction === "no"
                ? "bg-red text-white border border-red"
                : "bg-transparent border border-red/40 text-red hover:bg-red hover:text-white"
            }`}
          >
            ✕ No
          </button>
        </div>

        {/* Amount input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[12px] text-text-muted">Amount</span>
            <span className="text-[12px] text-text-muted">
              Balance: <span className={`font-semibold ${balanceValue > 0 ? "text-pear" : "text-text-muted"}`}>{balanceFormatted}</span>
            </span>
          </div>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="0.001"
              value={amount}
              placeholder="1 TRUST"
              onChange={(e) => setAmount(e.target.value)}
              disabled={staking}
              className="w-full px-3 py-3 pr-16 rounded-lg bg-surface-2 border border-border text-text-primary text-[16px] font-mono outline-none focus:border-pear transition-colors disabled:opacity-50 placeholder:text-text-muted/50"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-text-muted">
              $Trust
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-[13px] text-red-400 bg-red-400/10 rounded-lg px-3 py-2 border border-red-400/20">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {txHash && (
          <div className="flex items-center gap-2 text-[13px] text-pear bg-pear/10 rounded-lg px-3 py-2 border border-pear/20">
            <span>✓</span>
            <span>
              Whispered!{" "}
              <a
                href={`https://explorer.intuition.systems/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View on-chain ↗
              </a>
            </span>
          </div>
        )}

        {/* Confirm button */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleStake}
          disabled={staking || !amount || Number(amount) <= 0}
          style={{
            borderRadius: "12px",
            background: staking ? "#666" : "#d4ff47",
            color: "#06070f",
            border: "none",
            fontWeight: 700,
            fontSize: "14px",
            boxShadow: staking ? "none" : "0 0 24px rgba(212, 255, 71, 0.2)",
          }}
        >
          {staking ? "Whispering..." : `🍐 Express your Wispear — ${amount || "..."} $Trust`}
        </Button>

        <p className="text-[11px] text-text-muted text-center">
          Your stake signals trust to the community. Withdraw anytime.
        </p>
      </div>
    </div>
  );
}
