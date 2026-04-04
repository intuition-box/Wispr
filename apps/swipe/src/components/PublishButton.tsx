"use client";

interface PublishButtonProps {
  status: "idle" | "publishing" | "success" | "error";
  txHash?: string;
  explorerUrl?: string;
  errorMessage?: string;
  onPublish: () => void;
}

export function PublishButton({
  status,
  txHash,
  explorerUrl,
  errorMessage,
  onPublish,
}: PublishButtonProps) {
  if (status === "publishing") {
    return (
      <div className="flex flex-col items-center gap-3 py-2">
        <div className="w-7 h-7 border-2 border-pear border-t-transparent rounded-full animate-spin" />
        <span className="text-[13px] text-ink-muted">Publishing on-chain...</span>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 bg-green-soft rounded-2xl p-5 border border-green/10">
        <div className="flex items-center gap-2 text-green font-bold text-[14px]">
          <span>✓</span> Published on-chain!
        </div>
        {explorerUrl && (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-accent hover:underline font-medium"
          >
            View on Explorer →
          </a>
        )}
        {txHash && (
          <span className="text-[11px] text-ink-muted font-mono bg-bg rounded-lg px-3 py-1.5">
            {txHash.slice(0, 10)}...{txHash.slice(-8)}
          </span>
        )}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center gap-3">
        <span className="text-[12px] text-red text-center max-w-[280px]">
          {errorMessage ?? "Something went wrong"}
        </span>
        <button
          onClick={onPublish}
          className="text-[13px] text-accent hover:underline font-semibold bg-transparent"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onPublish}
      className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold text-[14px] px-7 py-3.5 rounded-2xl shadow-glow-accent hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
    >
      <span>⛓️</span>
      Publish on-chain
    </button>
  );
}
