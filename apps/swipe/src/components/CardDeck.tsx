
import { AnimatePresence } from "motion/react";
import type { QuestionNode, SwipeDirection } from "@/types/swipe";
import { SwipeCard } from "./SwipeCard";

interface CardDeckProps {
  currentQuestion: QuestionNode;
  nextQuestion: QuestionNode | null;
  onSwipe: (direction: SwipeDirection) => void;
}

export function CardDeck({
  currentQuestion,
  nextQuestion,
  onSwipe,
}: CardDeckProps) {
  return (
    <div className="relative w-full max-w-[380px] h-[240px] mx-auto my-2">
      {/* Next card peeking behind */}
      {nextQuestion && (
        <SwipeCard
          key={nextQuestion.id}
          question={nextQuestion}
          onSwipe={() => {}}
          isFront={false}
        />
      )}

      {/* Current card on top */}
      <AnimatePresence mode="popLayout">
        <SwipeCard
          key={currentQuestion.id}
          question={currentQuestion}
          onSwipe={onSwipe}
          isFront
        />
      </AnimatePresence>
    </div>
  );
}
