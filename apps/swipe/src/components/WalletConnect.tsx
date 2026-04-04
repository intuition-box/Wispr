"use client";

interface WalletConnectProps {
  isConnected: boolean;
  address: string | null;
  loading: boolean;
  error: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletConnect({
  isConnected,
  address,
  loading,
  error,
  onConnect,
  onDisconnect,
}: WalletConnectProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="w-7 h-7 border-2 border-pear border-t-transparent rounded-full animate-spin" />
        <span className="text-[13px] text-ink-muted">Connecting wallet...</span>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2.5 bg-green-soft border border-green/15 px-5 py-2.5 rounded-full">
          <span className="w-2 h-2 bg-green rounded-full animate-pulse-soft" />
          <span className="text-[13px] font-semibold text-green font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={onDisconnect}
          className="text-[12px] text-ink-muted hover:text-ink-secondary transition-colors bg-transparent"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={onConnect}
        className="flex items-center gap-2 bg-pear text-ink-inverse font-semibold text-[14px] px-7 py-3.5 rounded-2xl shadow-glow hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
      >
        <span>🔗</span>
        Connect Wallet
      </button>
      {error && (
        <span className="text-[12px] text-red text-center max-w-[280px]">
          {error}
        </span>
      )}
    </div>
  );
}
