
import { forwardRef } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import type { QuestionNode, SwipeDirection } from "@/types/swipe";

const SWIPE_THRESHOLD = 100;

interface SwipeCardProps {
  question: QuestionNode;
  onSwipe: (direction: SwipeDirection) => void;
  isFront: boolean;
}

export const SwipeCard = forwardRef<HTMLDivElement, SwipeCardProps>(
  function SwipeCard({ question, onSwipe, isFront }, ref) {
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
            {/* Like overlay */}
            <motion.div
              className="absolute inset-0 bg-green/5 rounded-3xl"
              style={{ opacity: likeOpacity }}
            />
            <motion.span
              className="absolute top-6 right-5 text-[15px] font-black tracking-widest px-4 py-2 rounded-xl border-[2.5px] text-green border-green"
              style={{ opacity: likeOpacity, rotate: 12 }}
            >
              YES
            </motion.span>

            {/* Dislike overlay */}
            <motion.div
              className="absolute inset-0 bg-red/5 rounded-3xl"
              style={{ opacity: dislikeOpacity }}
            />
            <motion.span
              className="absolute top-6 left-5 text-[15px] font-black tracking-widest px-4 py-2 rounded-xl border-[2.5px] text-red border-red"
              style={{ opacity: dislikeOpacity, rotate: -12 }}
            >
              NO
            </motion.span>
          </motion.div>
        )}

        <p className="relative z-10 text-[19px] font-semibold leading-[1.4] text-center text-ink max-w-[280px]">
          {question.text}
        </p>

        {isFront && (
          <span className="relative z-10 mt-6 text-[11px] text-ink-muted tracking-wide uppercase">
            Swipe or tap below
          </span>
        )}
      </motion.div>
    );
  }
);
