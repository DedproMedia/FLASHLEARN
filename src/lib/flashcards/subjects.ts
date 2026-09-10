import { CAPITALS_ITEMS, CAPITALS_SUBJECT } from "./capitals";
import { PLANETS_ITEMS, PLANETS_SUBJECT } from "./planets";
import type { FlashcardItem, Subject, SubjectId } from "./types";

export const SUBJECTS: Subject[] = [CAPITALS_SUBJECT, PLANETS_SUBJECT];

const ITEMS_BY_SUBJECT: Record<SubjectId, FlashcardItem[]> = {
  capitals: CAPITALS_ITEMS,
  planets: PLANETS_ITEMS,
};

export function getSubjectItems(subject: SubjectId): FlashcardItem[] {
  return ITEMS_BY_SUBJECT[subject];
}

export function getSubject(id: SubjectId): Subject {
  const subject = SUBJECTS.find((s) => s.id === id);
  if (!subject) throw new Error(`Unknown subject: ${id}`);
  return subject;
}
