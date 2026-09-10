"use client";

import { confidenceStyle } from "@/lib/flashcards/confidence";
import type { FlashcardItem, Rating } from "@/lib/flashcards/types";

export default function Flashcard({
  item,
  flipped,
  onFlip,
  rating,
  size = "large",
}: {
  item: FlashcardItem;
  flipped: boolean;
  onFlip: () => void;
  rating: Rating | null;
  size?: "large" | "small";
}) {
  const style = confidenceStyle(rating);
  const isLarge = size === "large";

  return (
    <button
      type="button"
      onClick={onFlip}
      className={`!p-0 w-full ${isLarge ? "h-64" : "h-40"} rounded-2xl border-4 ${style.border} ${style.bg} shadow-md flex flex-col items-center justify-center gap-3 transition-colors`}
    >
      <span className={isLarge ? "text-6xl" : "text-4xl"}>{item.icon}</span>
      {!flipped ? (
        <div className="text-center px-3">
          <p className={`font-bold ${isLarge ? "text-xl" : "text-base"} text-gray-900`}>
            {item.frontTitle}
          </p>
          <p className="text-xs text-gray-400 mt-1">{item.frontSubtitle}</p>
        </div>
      ) : (
        <div className="text-center px-3">
          <p className={`font-bold ${isLarge ? "text-2xl" : "text-lg"} text-gray-900`}>
            {item.backTitle}
          </p>
          <p className="text-xs text-gray-400 mt-1">{item.backSubtitle}</p>
        </div>
      )}
    </button>
  );
}
