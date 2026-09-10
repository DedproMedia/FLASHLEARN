export type SubjectId = "capitals" | "planets";

export interface Subject {
  id: SubjectId;
  label: string;
  icon: string;
  groupLabel: string;
  groups: string[];
}

// A single flashcard, generic across subjects. "group" is the filter axis
// for a subject (continent for capitals, planet for the solar system).
export interface FlashcardItem {
  id: string;
  subject: SubjectId;
  group: string;
  icon: string;
  frontTitle: string;
  frontSubtitle: string;
  backTitle: string;
  backSubtitle: string;
}

// 1-5, or null when the card has never been rated.
export type Rating = 1 | 2 | 3 | 4 | 5;

export interface CardProgress {
  rating: Rating | null;
  timesReviewed: number;
  lastReviewed: number | null;
}

export type ProgressMap = Record<string, CardProgress>;

export const DEFAULT_PROGRESS: CardProgress = {
  rating: null,
  timesReviewed: 0,
  lastReviewed: null,
};
