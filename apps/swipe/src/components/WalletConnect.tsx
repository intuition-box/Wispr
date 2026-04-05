
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useBalance, intuitionChain } from "@wispr/wallet";
import { QRCodeSVG } from "qrcode.react";

export function WalletConnect() {
  const { address, isConnected, loading, error, connect, disconnect } =
    useWalletConnection();

  const { data: balance } = useBalance({
    address: address as `0x${string}` | undefined,
    chainId: intuitionChain.id,
    query: { enabled: isConnected && !!address },
  });

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-3">
        <div className="w-5 h-5 border-2 border-pear border-t-transparent rounded-full animate-spin" />
        <span className="text-[13px] text-ink-muted">Connecting...</span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={connect}
          className="flex items-center gap-2 bg-pear text-ink-inverse font-semibold text-[14px] px-7 py-3.5 rounded-2xl shadow-glow hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
        >
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

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  const formattedBalance = balance
    ? `${parseFloat(balance.formatted).toFixed(2)} ${balance.symbol}`
    : "0 TRUST";

  return (
    <div className="flex flex-col items-center gap-3 bg-surface rounded-2xl p-4 border border-line w-full max-w-[320px]">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-ink-muted uppercase tracking-wide">
            Connected
          </span>
          <span className="text-[13px] text-ink font-mono font-medium">
            {truncatedAddress}
          </span>
        </div>
        <button
          onClick={disconnect}
          className="text-[12px] text-ink-muted hover:text-red transition-colors bg-transparent"
        >
          Disconnect
        </button>
      </div>
      <div className="w-full h-px bg-line" />
      <div className="flex items-center gap-2">
        <span className="text-[18px] font-bold text-ink">{formattedBalance}</span>
      </div>
      {balance && parseFloat(balance.formatted) === 0 && address && (
        <div className="flex flex-col items-center gap-3 pt-2">
          <p className="text-[12px] text-ink-muted text-center">
            Send TRUST to this address to get started
          </p>
          <div className="bg-white rounded-xl p-3">
            <QRCodeSVG value={address} size={160} />
          </div>
          <span className="text-[11px] text-ink-muted font-mono break-all text-center px-2">
            {address}
          </span>
        </div>
      )}
    </div>
  );
}
