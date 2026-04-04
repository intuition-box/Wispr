import { forwardRef } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import type { SwipeDirection } from "@/types/swipe";
import type { ComponentInfo } from "@/data/componentCatalog";

const SWIPE_THRESHOLD = 100;

const TYPE_BADGE_STYLE: Record<string, string> = {
  mcp: "bg-accent-soft text-accent",
  skill: "bg-pear-soft text-pear",
  model: "bg-red-soft text-red",
  sdk: "bg-green-soft text-green",
  api: "bg-accent-soft text-accent",
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

    const badgeStyle = TYPE_BADGE_STYLE[component.type] ?? "bg-accent-soft text-accent";

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
        className={`absolute inset-0 flex flex-col items-center justify-center p-8 select-none touch-pan-y rounded-3xl bg-card border border-line shadow-md noise ${
          isFront ? "cursor-grab active:cursor-grabbing" : "opacity-40"
        }`}
      >
        {isFront && (
          <motion.div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-green/5 rounded-3xl"
              style={{ opacity: likeOpacity }}
            />
            <motion.span
              className="absolute top-6 right-5 text-[13px] font-black tracking-widest px-3 py-1.5 rounded-xl border-[2.5px] text-green border-green"
              style={{ opacity: likeOpacity, rotate: 12 }}
            >
              USEFUL
            </motion.span>

            <motion.div
              className="absolute inset-0 bg-red/5 rounded-3xl"
              style={{ opacity: dislikeOpacity }}
            />
            <motion.span
              className="absolute top-6 left-5 text-[13px] font-black tracking-widest px-3 py-1.5 rounded-xl border-[2.5px] text-red border-red"
              style={{ opacity: dislikeOpacity, rotate: -12 }}
            >
              SKIP
            </motion.span>
          </motion.div>
        )}

        <div className="relative z-10 flex flex-col items-center gap-4 max-w-[300px]">
          <span className="text-3xl">{component.typeEmoji}</span>

          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase ${badgeStyle}`}
          >
            {component.type}
          </span>

          <h3 className="text-[18px] font-bold text-ink text-center leading-tight">
            {component.name}
          </h3>

          <p className="text-[13px] text-ink-secondary text-center leading-[1.5]">
            {component.description}
          </p>
        </div>

        {isFront && (
          <span className="relative z-10 mt-5 text-[11px] text-ink-muted tracking-wide uppercase">
            Swipe or tap below
          </span>
        )}
      </motion.div>
    );
  }
);
