
interface SwipeHintProps {
  direction: "like" | "dislike";
  opacity: number;
}

export function SwipeHint({ direction, opacity }: SwipeHintProps) {
  const isLike = direction === "like";

  return (
    <span
      className={`absolute top-5 text-base font-extrabold tracking-wide px-3.5 py-1.5 rounded-lg pointer-events-none border-2 ${
        isLike
          ? "right-4 text-green border-green rotate-[15deg]"
          : "left-4 text-red border-red -rotate-[15deg]"
      }`}
      style={{ opacity }}
    >
      {isLike ? "YES" : "NO"}
    </span>
  );
}
