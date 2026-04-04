import { Plus } from "lucide-react";
import type { Blueprint } from "@/lib/mock-blueprint";

const TYPE_ICON: Record<string, string> = {
  tool: "🔌",
  skill: "🧠",
  model: "🤖",
  package: "📦",
};

interface ImproveChoiceCardProps {
  blueprint: Blueprint;
  onSwapTool: (componentId: string) => void;
  onAddNew: () => void;
}

export function ImproveChoiceCard({
  blueprint,
  onSwapTool,
  onAddNew,
}: ImproveChoiceCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 w-full">
      <div>
        <h3 className="font-bold text-sm">How would you like to improve this blueprint?</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Choose a tool to replace, or add a completely new one.
        </p>
      </div>

      {/* Swap existing tool */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Swap an existing tool
        </h4>
        <div className="grid grid-cols-1 gap-1.5">
          {blueprint.stack.components.map((comp) => (
            <button
              key={comp.id}
              onClick={() => onSwapTool(comp.id)}
              className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/60 px-4 py-3 text-left hover:bg-secondary/50 transition-colors group"
            >
              <span className="text-base">{TYPE_ICON[comp.type] ?? "🔌"}</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground group-hover:text-foreground">
                  {comp.name}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  {comp.type}
                </span>
              </div>
              <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                Replace →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Add new tool */}
      <button
        onClick={onAddNew}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-secondary/30 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add a completely new tool
      </button>
    </div>
  );
}
