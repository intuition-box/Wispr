"use client";

import { useEffect, type ReactNode } from "react";
import { initAppKit } from "@/lib/appkit";

export function AppKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initAppKit();
  }, []);

  return <>{children}</>;
}
