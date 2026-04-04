import type { Metadata, Viewport } from "next";
import { AppKitProvider } from "@/components/AppKitProvider";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "WisPear — Discover your AI profile",
  description: "Collective wisdom, whispered to your agent. Discover your role and AI maturity level in 60 seconds.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WisPear",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0c0e22",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppKitProvider>
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
        </AppKitProvider>
      </body>
    </html>
  );
}
