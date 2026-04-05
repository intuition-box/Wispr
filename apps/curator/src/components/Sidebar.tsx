"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, brand } from "@wispr/ui";
import { useWalletConnection, useWalletBalance } from "@wispr/wallet";
import { QRCodeSVG } from "qrcode.react";
import { Compass, PlusCircle, BarChart3, TrendingUp, MessageCircle, Settings, ExternalLink, Wallet, Copy, Check, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const NAV_ITEMS: { href: string; icon: LucideIcon | "🍐"; label: string; external: boolean }[] = [
  { href: "/explorer", icon: Compass, label: "Explorer", external: false },
  { href: "/curate", icon: "🍐", label: "Wispear", external: false },
  { href: "/curate/new", icon: PlusCircle, label: "Add New", external: false },
  { href: "/activity", icon: BarChart3, label: "Activity", external: false },
  { href: "/dashboard", icon: TrendingUp, label: "Dashboard", external: false },
  { href: "/chat", icon: MessageCircle, label: "Chat", external: true },
  { href: "/onboarding", icon: Settings, label: "Settings", external: false },
];

export function Sidebar() {
  const pathname = usePathname();
  const { address, isConnected, disconnect, connect } = useWalletConnection();
  const { value } = useWalletBalance(address ?? null);
  const [qrOpen, setQrOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setQrOpen(false);
      }
    }
    if (qrOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [qrOpen]);

  function copyAddress() {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <aside className="w-[260px] shrink-0 sticky top-0 h-screen flex flex-col border-r border-border px-3 py-5">
      {/* Logo */}
      <div className="px-3 mb-4">
        <Logo variant="combined" theme="dark" width={200} height={62} />
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 mt-2">
        {NAV_ITEMS.map((item) => {
          const isExternal = "external" in item && item.external;
          const isActive = pathname === item.href;
          const className = `flex items-center gap-3.5 px-3.5 py-3 rounded-full text-[15px] transition-colors hover:bg-hover ${
            isActive
              ? "font-bold text-text-primary"
              : "font-medium text-text-secondary"
          }`;

          if (isExternal) {
            const chatUrl = process.env.NEXT_PUBLIC_CHAT_URL ?? "https://wispear.ai/chat";
            return (
              <a
                key={item.href}
                href={chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {typeof item.icon === "string" ? (
                  <span className="w-5 h-5 flex items-center justify-center text-base shrink-0">{item.icon}</span>
                ) : (
                  <item.icon className="w-5 h-5 shrink-0" style={{ color: isActive ? "#1990ff" : "#8888a0" }} />
                )}
                <span>{item.label}</span>
                <ExternalLink className="ml-auto w-3.5 h-3.5 text-text-muted" />
              </a>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={className}
            >
              {typeof item.icon === "string" ? (
                <span className="w-5 h-5 flex items-center justify-center text-base shrink-0">{item.icon}</span>
              ) : (
                <item.icon className="w-5 h-5 shrink-0" style={{ color: isActive ? "#1990ff" : "#8888a0" }} />
              )}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto" />

      {/* Wallet */}
      <div className="relative">
        {/* QR Popover */}
        {qrOpen && address && (
          <div
            ref={popoverRef}
            className="absolute bottom-full left-0 mb-2 w-[240px] rounded-2xl border border-border bg-surface p-4 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-text-primary">Receive TRUST</span>
              <button onClick={() => setQrOpen(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-center rounded-xl bg-white p-3">
              <QRCodeSVG value={address} size={160} />
            </div>
            <button
              onClick={copyAddress}
              className="mt-3 flex items-center gap-2 w-full justify-center rounded-lg bg-surface-2 px-3 py-2 text-xs text-text-secondary hover:bg-hover transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-pear" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : `${address.slice(0, 6)}...${address.slice(-4)}`}
            </button>
            <button
              onClick={() => { setQrOpen(false); disconnect(); }}
              className="mt-2 w-full text-center text-xs text-red hover:underline"
            >
              Disconnect
            </button>
          </div>
        )}

        {isConnected && address ? (
          <div
            onClick={() => setQrOpen((o) => !o)}
            className="group flex items-center gap-2.5 px-3 py-3 rounded-full mt-3 hover:bg-hover transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-pear/20 border border-border-light flex items-center justify-center text-sm font-bold text-accent shrink-0">
              {address.slice(2, 4).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-semibold text-text-primary truncate">
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>
              <div className="text-sm font-bold text-pear truncate">{Math.floor(value)} TRUST</div>
            </div>
          </div>
        ) : (
          <div
            onClick={connect}
            className="flex items-center gap-2.5 px-3 py-3 rounded-full mt-3 hover:bg-hover transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-surface-2 border border-border flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 text-text-secondary" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-semibold text-text-primary truncate">
                Connect wallet
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
