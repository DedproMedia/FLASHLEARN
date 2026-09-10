"use client";

import { useState } from "react";
import Flashcard from "./Flashcard";
import ConfidenceRater from "./ConfidenceRater";
import type { FlashcardItem, ProgressMap, Rating } from "@/lib/flashcards/types";

export default function BrowseDeck({
  deck,
  progress,
  onRate,
}: {
  deck: FlashcardItem[];
  progress: ProgressMap;
  onRate: (id: string, rating: Rating) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!deck.length) {
    return (
      <p className="text-gray-500 text-center py-12">
        No cards in this group yet — pick a different filter.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {deck.map((item) => {
        const rating = progress[item.id]?.rating ?? null;
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="flex flex-col gap-2">
            <Flashcard
              item={item}
              flipped={isOpen}
              onFlip={() => setOpenId(isOpen ? null : item.id)}
              rating={rating}
              size="small"
            />
            {isOpen && (
              <ConfidenceRater
                selected={rating}
                onRate={(r) => onRate(item.id, r)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
