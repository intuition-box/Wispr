"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, brand } from "@wispr/ui";

const NAV_ITEMS = [
  { href: "/explorer", icon: "🔍", label: "Explorer" },
  { href: "/battle", icon: "⚔️", label: "Battle" },
  { href: "/onboarding", icon: "⚙️", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] shrink-0 sticky top-0 h-screen flex flex-col border-r border-border px-3 py-5">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 mb-4">
        <Logo variant="icon" theme="dark" width={32} height={35} />
        <span className="text-lg font-extrabold text-text-primary tracking-tight" style={{ fontFamily: "'Montserrat', 'Inter', sans-serif" }}>
          {brand.name}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 mt-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3.5 px-3.5 py-3 rounded-full text-[15px] transition-colors hover:bg-hover ${
              pathname === item.href
                ? "font-bold text-text-primary"
                : "font-medium text-text-secondary"
            }`}
          >
            <span className="w-6 h-6 flex items-center justify-center text-lg shrink-0">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Character */}
      <div className="mt-auto flex justify-center px-3 py-3">
        <img
          src="/character.png"
          alt={brand.name}
          className="w-28 opacity-60 hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      {/* Profile */}
      <div className="flex items-center gap-2.5 px-3 py-3 rounded-full mt-3 hover:bg-hover transition-colors cursor-pointer">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-purple/20 border border-border-light flex items-center justify-center text-sm font-bold text-accent shrink-0">
          SC
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="text-sm font-semibold text-text-primary truncate">
            sam.eth
          </div>
          <div className="text-xs text-text-muted truncate">0x1a2b...9f3c</div>
        </div>
      </div>
    </aside>
  );
}
