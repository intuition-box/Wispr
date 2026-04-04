"use client";

import { useState, useEffect, type ReactNode } from "react";
import { WalletProvider } from "@wispr/wallet";

export function ClientProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return <WalletProvider>{children}</WalletProvider>;
}
