import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { WalletProvider } from "@wispr/wallet";
import { App } from "./App";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <WalletProvider>
        <main className="min-h-screen flex flex-col">
          <App />
        </main>
      </WalletProvider>
    </BrowserRouter>
  </StrictMode>,
);
