"use client";

import { useMemo, useState } from "react";
import { SUBJECTS, getSubject, getSubjectItems } from "@/lib/flashcards/subjects";
import type { SubjectId } from "@/lib/flashcards/types";
import { useProgress } from "@/lib/flashcards/useProgress";
import GroupFilter from "@/components/flashcards/GroupFilter";
import StudyMode from "@/components/flashcards/StudyMode";
import BrowseDeck from "@/components/flashcards/BrowseDeck";
import Dashboard from "@/components/flashcards/Dashboard";

type Tab = "study" | "browse" | "dashboard";

const TABS: { id: Tab; label: string }[] = [
  { id: "study", label: "Learning Mode" },
  { id: "browse", label: "Browse Deck" },
  { id: "dashboard", label: "Dashboard" },
];

export default function FlashcardsPage() {
  const [subjectId, setSubjectId] = useState<SubjectId>("capitals");
  const [tab, setTab] = useState<Tab>("study");
  const [group, setGroup] = useState<string>("All");
  const { progress, hydrated, rate } = useProgress(subjectId);

  const subject = getSubject(subjectId);
  const items = useMemo(() => getSubjectItems(subjectId), [subjectId]);
  const deck = useMemo(
    () => (group === "All" ? items : items.filter((i) => i.group === group)),
    [items, group]
  );

  function handleSubjectChange(id: SubjectId) {
    if (id === subjectId) return;
    setSubjectId(id);
    setGroup("All");
    setTab("study");
  }

  if (!hydrated) {
    return <p className="text-center text-gray-400 py-12">Loading your deck…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => handleSubjectChange(s.id)}
            className={`!px-4 !py-2 rounded-lg text-sm font-semibold ${
              subjectId === s.id
                ? "!bg-indigo-600 !text-white"
                : "!bg-gray-100 !text-gray-600 hover:!bg-gray-200"
            }`}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`!px-4 !py-2 rounded-lg text-sm font-semibold ${
                tab === t.id
                  ? "!bg-black !text-white"
                  : "!bg-gray-100 !text-gray-600 hover:!bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab !== "dashboard" && (
          <GroupFilter groups={subject.groups} value={group} onChange={setGroup} />
        )}
      </div>

      {tab === "study" && (
        <StudyMode key={`${subjectId}:${group}`} deck={deck} progress={progress} onRate={rate} />
      )}
      {tab === "browse" && <BrowseDeck deck={deck} progress={progress} onRate={rate} />}
      {tab === "dashboard" && (
        <Dashboard items={items} groups={subject.groups} progress={progress} />
      )}
    </div>
  );
}
