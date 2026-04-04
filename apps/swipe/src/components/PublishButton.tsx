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
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-amber border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-text-muted">
          Publishing on-chain...
        </span>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-green font-semibold text-sm">
          <span>&#10003;</span> Published on-chain!
        </div>
        {explorerUrl && (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent hover:underline"
          >
            View on Explorer &rarr;
          </a>
        )}
        {txHash && (
          <span className="text-xs text-text-muted font-mono">
            {txHash.slice(0, 10)}...{txHash.slice(-8)}
          </span>
        )}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center gap-3">
        <span className="text-xs text-red text-center max-w-[280px]">
          {errorMessage ?? "Something went wrong"}
        </span>
        <button
          onClick={onPublish}
          className="text-sm text-accent hover:underline bg-transparent border-none"
        >
          Try again
        </button>
      </div>
    );
  }

  // idle
  return (
    <button
      onClick={onPublish}
      className="bg-amber/90 text-text-primary font-semibold text-sm px-6 py-3 rounded-xl border-none shadow-card hover:shadow-md transition-shadow"
    >
      Publish on-chain
    </button>
  );
}
