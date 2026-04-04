"use client";

import dynamic from "next/dynamic";

const SwipeFlow = dynamic(() => import("@/components/SwipeFlow"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-bg-app">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function SwipePage() {
  return <SwipeFlow />;
}
