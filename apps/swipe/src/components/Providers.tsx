"use client";

import { type ReactNode } from "react";
import { AppKitProvider } from "./AppKitProvider";
import { InstallBanner } from "./InstallBanner";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AppKitProvider>
      {children}
      <InstallBanner />
    </AppKitProvider>
  );
}
