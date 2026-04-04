import type { Metadata, Viewport } from "next";
import { AppKitProvider } from "@/components/AppKitProvider";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Wispr Profile",
  description: "Discover your AI profile in 60 seconds",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wispr",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#4A9BF4",
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
