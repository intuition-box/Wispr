"use client";

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const pct = Math.min(Math.max(progress, 0), 1) * 100;

  return (
    <div className="w-full max-w-[400px] h-1.5 bg-line-strong rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-pear to-accent rounded-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
