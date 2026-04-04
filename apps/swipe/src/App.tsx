import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { InstallBanner } from "./components/InstallBanner";

const SwipePage = lazy(() => import("./pages/SwipePage"));

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/swipe"
          element={
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen bg-bg">
                  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
              <SwipePage />
            </Suspense>
          }
        />
      </Routes>
      <InstallBanner />
    </>
  );
}
