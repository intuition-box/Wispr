import { forwardRef } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import type { SwipeDirection } from "@/types/swipe";
import type { ComponentInfo } from "@/data/componentCatalog";

const SWIPE_THRESHOLD = 100;

const TYPE_COLORS: Record<string, { badge: string; strip: string }> = {
  mcp: {
    badge: "bg-accent-soft text-accent shadow-[inset_0_1px_0_rgba(25,144,255,0.12)]",
    strip: "bg-gradient-to-r from-accent/40 via-accent/20 to-transparent",
  },
  skill: {
    badge: "bg-pear-soft text-pear shadow-[inset_0_1px_0_rgba(170,255,43,0.12)]",
    strip: "bg-gradient-to-r from-pear/40 via-pear/20 to-transparent",
  },
  model: {
    badge: "bg-[rgba(168,85,247,0.10)] text-[#c084fc] shadow-[inset_0_1px_0_rgba(168,85,247,0.12)]",
    strip: "bg-gradient-to-r from-[#a855f7]/40 via-[#a855f7]/20 to-transparent",
  },
  sdk: {
    badge: "bg-green-soft text-green shadow-[inset_0_1px_0_rgba(34,197,94,0.12)]",
    strip: "bg-gradient-to-r from-green/40 via-green/20 to-transparent",
  },
  api: {
    badge: "bg-[rgba(255,204,111,0.10)] text-amber shadow-[inset_0_1px_0_rgba(255,204,111,0.12)]",
    strip: "bg-gradient-to-r from-amber/40 via-amber/20 to-transparent",
  },
};

interface ComponentSwipeCardProps {
  component: ComponentInfo & { typeEmoji: string };
  onSwipe: (direction: SwipeDirection) => void;
  isFront: boolean;
}

export const ComponentSwipeCard = forwardRef<HTMLDivElement, ComponentSwipeCardProps>(
  function ComponentSwipeCard({ component, onSwipe, isFront }, ref) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-12, 12]);
    const likeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
    const dislikeOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);
    const scale = useTransform(
      x,
      [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
      [0.97, 1, 0.97]
    );

    function handleDragEnd(
      _: unknown,
      info: { offset: { x: number } }
    ) {
      if (info.offset.x > SWIPE_THRESHOLD) onSwipe("like");
      else if (info.offset.x < -SWIPE_THRESHOLD) onSwipe("dislike");
    }

    const colors = TYPE_COLORS[component.type] ?? TYPE_COLORS.mcp;

    return (
      <motion.div
        ref={ref}
        drag={isFront ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        style={{
          x,
          rotate,
          scale: isFront ? scale : 0.95,
          zIndex: isFront ? 2 : 1,
          y: isFront ? 0 : 8,
        }}
        exit={{
          x: x.get() > 0 ? 400 : -400,
          opacity: 0,
          rotate: x.get() > 0 ? 20 : -20,
          transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`absolute inset-0 flex flex-col select-none touch-pan-y rounded-3xl bg-card border border-line shadow-md noise overflow-hidden ${
          isFront ? "cursor-grab active:cursor-grabbing" : "opacity-40"
        }`}
      >
        {/* Type accent strip at top */}
        <div className={`h-[3px] w-full ${colors.strip}`} />

        {isFront && (
          <motion.div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden z-20">
            <motion.div
              className="absolute inset-0 bg-green/5"
              style={{ opacity: likeOpacity }}
            />
            <motion.span
              className="absolute top-5 right-4 text-[11px] font-black tracking-[0.15em] px-3 py-1.5 rounded-lg border-2 text-green border-green bg-green/10"
              style={{ opacity: likeOpacity, rotate: 12 }}
            >
              AGREE
            </motion.span>

            <motion.div
              className="absolute inset-0 bg-red/5"
              style={{ opacity: dislikeOpacity }}
            />
            <motion.span
              className="absolute top-5 left-4 text-[11px] font-black tracking-[0.15em] px-3 py-1.5 rounded-lg border-2 text-red border-red bg-red/10"
              style={{ opacity: dislikeOpacity, rotate: -12 }}
            >
              DISAGREE
            </motion.span>
          </motion.div>
        )}

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[28px] leading-none">{component.typeEmoji}</span>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-[0.12em] uppercase ${colors.badge}`}
            >
              {component.type}
            </span>
          </div>

          <h3 className="text-[20px] font-display font-bold text-ink text-center leading-tight">
            {component.name}
          </h3>

          <p className="text-[13px] text-ink-secondary text-center leading-[1.55] max-w-[280px]">
            {component.description}
          </p>
        </div>

        {isFront && (
          <div className="relative z-10 pb-5 text-center">
            <span className="text-[10px] text-ink-muted/60 tracking-[0.1em] uppercase">
              Swipe or tap below
            </span>
          </div>
        )}
      </motion.div>
    );
  }
);
