
import type { SwipeDirection } from "@/types/swipe";

interface SwipeButtonsProps {
  onSwipe: (direction: SwipeDirection) => void;
}

export function SwipeButtons({ onSwipe }: SwipeButtonsProps) {
  return (
    <div className="flex gap-14 justify-center mt-4">
      <div className="flex flex-col items-center gap-2">
        <span className="text-[11px] text-ink-muted tracking-wide">Disagree</span>
        <button
          onClick={() => onSwipe("dislike")}
          className="w-[64px] h-[64px] rounded-full text-[24px] flex items-center justify-center bg-red-soft text-red shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
          aria-label="Disagree"
        >
          ✕
        </button>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-[11px] text-ink-muted tracking-wide">Agree</span>
        <button
          onClick={() => onSwipe("like")}
          className="w-[64px] h-[64px] rounded-full text-[24px] flex items-center justify-center bg-green-soft text-green shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
          aria-label="Agree"
        >
          ✓
        </button>
      </div>
    </div>
  );
}
