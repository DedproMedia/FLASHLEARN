"use client";

import { useCallback, useMemo, useState } from "react";
import Flashcard from "./Flashcard";
import ConfidenceRater from "./ConfidenceRater";
import { learningWeight } from "@/lib/flashcards/confidence";
import type { FlashcardItem, ProgressMap, Rating } from "@/lib/flashcards/types";

function pickWeighted(deck: FlashcardItem[], progress: ProgressMap, avoidId?: string): FlashcardItem {
  const pool = deck.length > 1 && avoidId ? deck.filter((c) => c.id !== avoidId) : deck;
  const weights = pool.map((c) => learningWeight(progress[c.id]?.rating ?? null));
  const total = weights.reduce((sum, w) => sum + w, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

export default function StudyMode({
  deck,
  progress,
  onRate,
}: {
  deck: FlashcardItem[];
  progress: ProgressMap;
  onRate: (id: string, rating: Rating) => void;
}) {
  const [current, setCurrent] = useState<FlashcardItem | null>(() =>
    deck.length ? pickWeighted(deck, progress) : null
  );
  const [flipped, setFlipped] = useState(false);
  const [seenCount, setSeenCount] = useState(0);

  const currentRating = useMemo(
    () => (current ? progress[current.id]?.rating ?? null : null),
    [current, progress]
  );

  const next = useCallback(() => {
    setCurrent((prev) => pickWeighted(deck, progress, prev?.id));
    setFlipped(false);
  }, [deck, progress]);

  const handleRate = useCallback(
    (rating: Rating) => {
      if (!current) return;
      onRate(current.id, rating);
      setSeenCount((n) => n + 1);
      setTimeout(next, 350);
    },
    [current, onRate, next]
  );

  if (!deck.length || !current) {
    return (
      <p className="text-gray-500 text-center py-12">
        No cards in this group yet — pick a different filter.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
      <p className="text-sm text-gray-400">
        Learning mode — cards you&apos;re less confident about show up more often. Reviewed{" "}
        {seenCount} this session.
      </p>
      <Flashcard
        item={current}
        flipped={flipped}
        onFlip={() => setFlipped((f) => !f)}
        rating={currentRating}
      />
      {flipped ? (
        <ConfidenceRater onRate={handleRate} />
      ) : (
        <p className="text-sm text-gray-400">Tap the card to reveal the answer</p>
      )}
      <button
        type="button"
        onClick={next}
        className="!bg-transparent !text-gray-400 text-sm underline !p-0"
      >
        Skip card
      </button>
    </div>
  );
}
