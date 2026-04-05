"use client";

import { useRouter } from "next/navigation";
import { useAtoms, OnChainAtom } from "@/hooks/useAtoms";

// Map component type to icon
function typeIcon(type: string | null): string {
  switch (type?.toLowerCase()) {
    case "tool":
    case "mcp":
      return "\u{1F50C}"; // 🔌
    case "skill":
      return "\u{1F9E0}"; // 🧠
    case "model":
      return "\u{1F916}"; // 🤖
    case "sdk":
    case "api":
      return "\u26A1"; // ⚡
    default:
      return "\u{1F4E6}"; // 📦
  }
}

export default function ExplorerPage() {
  const router = useRouter();
  const { atoms, loading, error } = useAtoms();

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 page-header backdrop-blur-xl px-5 py-5">
        <h1 className="page-title">Explorer</h1>
        <p className="text-sm text-text-secondary mt-1">
          Components deployed on-chain — live from Intuition L3
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            <span className="text-sm text-text-secondary">
              Fetching on-chain data…
            </span>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3 text-center px-5">
            <span className="text-3xl">⚠️</span>
            <span className="text-sm text-text-secondary">
              Failed to load on-chain data
            </span>
            <span className="text-xs text-text-muted font-mono">{error}</span>
          </div>
        </div>
      )}

      {/* Atoms grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
          {atoms.map((atom) => (
            <div
              key={atom.term_id}
              onClick={() => {
                // Find the atom's slug from its data hash — use name as fallback
                const slug = atom.name
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "");
                router.push(`/curate/${slug}`);
              }}
              className="bg-bg p-5 flex flex-col gap-3 cursor-pointer group rounded-xl border border-border transition-colors duration-200 hover:border-border-light hover:bg-surface/50"
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent/15 to-purple/15 border border-accent/20 flex items-center justify-center text-lg shrink-0">
                  {typeIcon(atom.componentType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-text-primary truncate">
                    {atom.name}
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5">
                    {atom.componentType && (
                      <span className="uppercase">{atom.componentType}</span>
                    )}
                    {atom.contexts.length > 0 && (
                      <span>
                        {atom.componentType ? " · " : ""}
                        {atom.contexts[0]}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <div className="text-sm font-bold text-amber flex items-center gap-1">
                    <span>★</span> {atom.totalMarketCap}
                  </div>
                  {atom.positionCount > 0 && (
                    <div className="text-[10px] text-text-muted">
                      {atom.positionCount} staker{atom.positionCount > 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {atom.description && (
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                  {atom.description}
                </p>
              )}

              {/* Context chips */}
              {atom.contexts.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {atom.contexts.map((ctx) => (
                    <span
                      key={ctx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-text-secondary"
                    >
                      {ctx}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green rounded-full" />
                  On-chain · {atom.term_id}
                </span>
                <span className="text-[12px] font-semibold text-accent group-hover:text-text-primary transition-colors duration-200">
                  View details →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && atoms.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <span className="text-3xl">🔍</span>
            <span className="text-sm text-text-secondary">
              No components found on-chain
            </span>
          </div>
        </div>
      )}
    </>
  );
}
