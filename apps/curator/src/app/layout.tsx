import type { Metadata } from "next";
import { WalletProvider } from "@wispr/wallet";
import { Sidebar } from "../components/Sidebar";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "WisPear",
  description: "Stake $TRUST on the tools you vouch for",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
