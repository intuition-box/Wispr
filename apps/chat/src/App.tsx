import { Routes, Route, Navigate } from "react-router-dom";
import ChatPage from "./pages/chat";
import BlueprintPage from "./pages/blueprint";
import SwipePage from "./pages/swipe";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" replace />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/blueprint" element={<BlueprintPage />} />
      <Route path="/swipe" element={<SwipePage />} />
    </Routes>
  );
}
