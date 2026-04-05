"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, brand } from "@wispr/ui";
import { useWalletConnection } from "@wispr/wallet";

const NAV_ITEMS = [
  { href: "/explorer", icon: "🧭", label: "Explorer", external: false },
  { href: "/curate", icon: "🍐", label: "Wispear", external: false },
  { href: "/curate/new", icon: "➕", label: "Add New", external: false },
  { href: "/activity", icon: "📊", label: "Activity", external: false },
  { href: "/dashboard", icon: "📈", label: "Dashboard", external: false },
  { href: "/chat", icon: "💬", label: "Chat", external: true },
  { href: "/onboarding", icon: "⚙️", label: "Settings", external: false },
];

export function Sidebar() {
  const pathname = usePathname();
  const { address, isConnected, disconnect, connect } = useWalletConnection();

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
                <span className="w-6 h-6 flex items-center justify-center shrink-0" style={{ color: isActive ? "#1990ff" : "#8888a0" }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                <span className="ml-auto text-[10px] text-text-muted">↗</span>
              </a>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={className}
            >
              <span className="w-6 h-6 flex items-center justify-center text-lg shrink-0">
                {item.icon}
              </span>
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
          <div className="w-10 h-10 rounded-full bg-surface-2 border border-border flex items-center justify-center text-lg shrink-0">
            🔗
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-semibold text-text-primary truncate">
              Connect wallet
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
