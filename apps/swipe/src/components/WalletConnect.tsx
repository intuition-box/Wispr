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
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-text-muted">Connecting wallet...</span>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 bg-green/10 text-green px-4 py-2 rounded-lg text-sm font-medium">
          <span className="w-2 h-2 bg-green rounded-full" />
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <button
          onClick={onDisconnect}
          className="text-xs text-text-muted hover:text-text-secondary transition-colors bg-transparent border-none"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onConnect}
        className="bg-accent text-text-white font-semibold text-sm px-6 py-3 rounded-xl border-none shadow-card hover:shadow-md transition-shadow"
      >
        Connect Wallet
      </button>
      {error && (
        <span className="text-xs text-red text-center max-w-[280px]">
          {error}
        </span>
      )}
    </div>
  );
}
