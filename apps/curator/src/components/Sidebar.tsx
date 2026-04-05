"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@wispr/ui";
import { useWalletConnection } from "@wispr/wallet";
import { Compass, PlusCircle, BarChart3, TrendingUp, MessageCircle, ExternalLink, Wallet, Menu, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const NAV_ITEMS: { href: string; icon: LucideIcon | "🍐"; label: string; external: boolean }[] = [
  { href: "/explorer", icon: Compass, label: "Explorer", external: false },
  { href: "/curate", icon: "🍐", label: "Wispear", external: false },
  { href: "/curate/new", icon: PlusCircle, label: "Add New", external: false },
  { href: "/activity", icon: BarChart3, label: "Activity", external: false },
  { href: "/dashboard", icon: TrendingUp, label: "Dashboard", external: false },
  { href: "/chat", icon: MessageCircle, label: "Chat", external: true },
];

function PearIconSmall({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="60 20 200 230" className={className} role="img" aria-label="Wispear">
      <defs>
        <linearGradient id="pearGradNav" x1="0%" y1="0%" x2="40%" y2="100%">
          <stop offset="0%" stopColor="#d4ff47" />
          <stop offset="40%" stopColor="#55e292" />
          <stop offset="100%" stopColor="#1990ff" />
        </linearGradient>
      </defs>
      <g transform="translate(20, -10)">
        <path d="M 152 75 C 152 45 178 40 188 45 C 183 62 163 72 152 75 Z" fill="#d4ff47" />
        <path d="M 148 76 C 145 52 122 47 112 52 C 117 68 137 73 148 76 Z" fill="#aaff2b" />
        <path d="M 150 75 C 165 75 175 95 180 120 C 185 145 215 155 215 185 C 215 215 185 235 150 235 C 115 235 85 215 85 185 C 85 155 115 145 120 120 C 125 95 135 75 150 75 Z" fill="url(#pearGradNav)" />
      </g>
    </svg>
  );
}

function SidebarLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -10 920 280" className="h-16" role="img" aria-label="Wispear">
      <defs>
        <linearGradient id="pearGradSidebar" x1="0%" y1="0%" x2="40%" y2="100%">
          <stop offset="0%" stopColor="#d4ff47" />
          <stop offset="40%" stopColor="#55e292" />
          <stop offset="100%" stopColor="#1990ff" />
        </linearGradient>
        <filter id="ringGlowSidebar" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur1" />
          <feGaussianBlur stdDeviation="2" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="baseLightSidebar" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <g transform="translate(20, 0)">
        <g transform="translate(0, 220)">
          <ellipse cx="150" cy="0" rx="70" ry="16" fill="#00ffff" opacity="0.4" filter="url(#baseLightSidebar)" />
          <ellipse cx="150" cy="0" rx="60" ry="14" fill="none" stroke="#00ffff" strokeWidth="4" filter="url(#ringGlowSidebar)" />
          <ellipse cx="150" cy="0" rx="56" ry="12" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
        </g>
        <g transform="translate(0, -10)">
          <path d="M 152 75 C 152 45 178 40 188 45 C 183 62 163 72 152 75 Z" fill="#d4ff47" />
          <path d="M 148 76 C 145 52 122 47 112 52 C 117 68 137 73 148 76 Z" fill="#aaff2b" />
          <path d="M 150 75 C 165 75 175 95 180 120 C 185 145 215 155 215 185 C 215 215 185 235 150 235 C 115 235 85 215 85 185 C 85 155 115 145 120 120 C 125 95 135 75 150 75 Z" fill="url(#pearGradSidebar)" />
        </g>
      </g>
      <text x="450" y="205" textAnchor="middle" fontFamily="'Montserrat', 'Inter', sans-serif" fontSize="85" fontWeight="900" fill="#ffffff" letterSpacing="-2">
        wis<tspan fill="#00ffff">p</tspan>ear<tspan fill="#00ffff">.ai</tspan>
      </text>
    </svg>
  );
}

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { address, isConnected, disconnect, connect } = useWalletConnection();

  return (
    <>
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
                onClick={onNavigate}
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
              onClick={onNavigate}
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
      {isConnected && address ? (
        <div
          onClick={disconnect}
          className="group flex items-center gap-2.5 px-3 py-3 rounded-full mt-3 hover:bg-red-soft transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-pear/20 border border-border-light flex items-center justify-center text-sm font-bold text-accent shrink-0 group-hover:from-red/20 group-hover:to-red/10 group-hover:text-red group-hover:border-red/30 transition-all">
            {address.slice(2, 4).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-semibold text-text-primary truncate group-hover:hidden">
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
            <div className="text-xs text-text-muted truncate group-hover:hidden">Connected</div>
            <div className="text-sm font-semibold text-red hidden group-hover:block">
              Disconnect wallet
            </div>
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
    </>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-surface-2/90 backdrop-blur-xl border-b border-border">
        <div className="flex items-center gap-2">
          <PearIconSmall className="h-8 w-8" />
          <h1 className="text-sm font-black tracking-tighter" style={{ fontFamily: "'Montserrat', 'Inter', sans-serif" }}>
            wis<span style={{ color: "#00ffff" }}>p</span>ear<span style={{ color: "#00ffff" }}>.ai</span>
          </h1>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-hover transition-colors"
        >
          <Menu className="w-5 h-5 text-text-primary" />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="absolute right-0 top-0 h-full w-[280px] bg-surface-2 border-l border-border flex flex-col px-3 py-5 animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-3 mb-4">
              <span className="text-sm font-bold text-text-primary">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-hover transition-colors"
              >
                <X className="w-4 h-4 text-text-primary" />
              </button>
            </div>
            <NavContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[260px] shrink-0 sticky top-0 h-screen flex-col border-r border-border px-3 py-5">
        <div className="px-3 mb-4">
          <SidebarLogo />
        </div>
        <NavContent />
      </aside>
    </>
  );
}
