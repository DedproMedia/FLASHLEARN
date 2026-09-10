"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { safeSupabaseBrowser } from "./supabaseClient";
import {
  DEFAULT_PROGRESS,
  type CardProgress,
  type ProgressMap,
  type Rating,
  type SubjectId,
} from "./types";

// The "capitals" subject predates the multi-subject app and keeps its original
// storage key so existing guests don't lose progress; other subjects get their
// own namespaced key.
function storageKey(subject: SubjectId): string {
  if (subject === "capitals") return "flashcards:capitals:progress:v1";
  return `flashcards:${subject}:progress:v1`;
}

interface ProgressRow {
  country_code: string;
  rating: number;
  times_reviewed: number;
  last_reviewed: string;
}

function loadLocalProgress(subject: SubjectId): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(storageKey(subject));
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function saveLocalProgress(subject: SubjectId, progress: ProgressMap) {
  try {
    window.localStorage.setItem(storageKey(subject), JSON.stringify(progress));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) - ignore.
  }
}

function clearLocalProgress(subject: SubjectId) {
  try {
    window.localStorage.removeItem(storageKey(subject));
  } catch {
    // ignore
  }
}

function rowsToProgress(rows: ProgressRow[]): ProgressMap {
  const map: ProgressMap = {};
  for (const row of rows) {
    map[row.country_code] = {
      rating: row.rating as Rating,
      timesReviewed: row.times_reviewed,
      lastReviewed: new Date(row.last_reviewed).getTime(),
    };
  }
  return map;
}

export function useProgress(subject: SubjectId) {
  const supabase = useMemo(() => safeSupabaseBrowser(), []);
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [hydrated, setHydrated] = useState(false);
  const progressRef = useRef<ProgressMap>({});
  const mergedForKey = useRef<string | null>(null);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Track auth state (guest-only if Supabase isn't configured).
  useEffect(() => {
    if (!supabase) {
      setAuthChecked(true);
      return;
    }
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setAuthChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  // Load progress (from Supabase when signed in, localStorage otherwise), merging
  // any guest progress into the account once, the first time a user signs in to
  // this particular subject.
  useEffect(() => {
    if (!authChecked) return;
    let cancelled = false;

    async function load() {
      if (!user || !supabase) {
        setProgress(loadLocalProgress(subject));
        setHydrated(true);
        return;
      }

      const { data, error } = await supabase
        .from("flashcard_progress")
        .select("country_code, rating, times_reviewed, last_reviewed")
        .eq("user_id", user.id)
        .eq("subject", subject);

      if (cancelled) return;

      if (error) {
        console.error("Failed to load flashcard progress", error);
        setProgress(loadLocalProgress(subject));
        setHydrated(true);
        return;
      }

      let remote = rowsToProgress((data ?? []) as ProgressRow[]);

      const mergeKey = `${subject}:${user.id}`;
      if (mergedForKey.current !== mergeKey) {
        mergedForKey.current = mergeKey;
        const local = loadLocalProgress(subject);
        const toMerge = Object.entries(local).filter(([code]) => !(code in remote));
        if (toMerge.length) {
          const upserts = toMerge.map(([code, p]) => ({
            user_id: user.id,
            subject,
            country_code: code,
            rating: p.rating,
            times_reviewed: p.timesReviewed,
            last_reviewed: new Date(p.lastReviewed ?? Date.now()).toISOString(),
          }));
          const { error: mergeError } = await supabase.from("flashcard_progress").upsert(upserts);
          if (!mergeError) {
            remote = { ...local, ...remote };
            clearLocalProgress(subject);
          }
        }
      }

      if (!cancelled) {
        setProgress(remote);
        setHydrated(true);
      }
    }

    setHydrated(false);
    load();
    return () => {
      cancelled = true;
    };
  }, [user, authChecked, supabase, subject]);

  // Guests keep their progress in localStorage.
  useEffect(() => {
    if (!hydrated || user) return;
    saveLocalProgress(subject, progress);
  }, [progress, hydrated, user, subject]);

  const getProgress = useCallback(
    (code: string) => progress[code] ?? DEFAULT_PROGRESS,
    [progress]
  );

  const rate = useCallback(
    async (code: string, rating: Rating) => {
      const current = progressRef.current[code] ?? DEFAULT_PROGRESS;
      const updated: CardProgress = {
        rating,
        timesReviewed: current.timesReviewed + 1,
        lastReviewed: Date.now(),
      };
      progressRef.current = { ...progressRef.current, [code]: updated };
      setProgress(progressRef.current);

      if (user && supabase) {
        const { error } = await supabase.from("flashcard_progress").upsert({
          user_id: user.id,
          subject,
          country_code: code,
          rating: updated.rating,
          times_reviewed: updated.timesReviewed,
          last_reviewed: new Date(updated.lastReviewed!).toISOString(),
        });
        if (error) console.error("Failed to save flashcard progress", error);
      }
    },
    [user, supabase, subject]
  );

  const resetAll = useCallback(async () => {
    progressRef.current = {};
    setProgress({});
    if (user && supabase) {
      const { error } = await supabase
        .from("flashcard_progress")
        .delete()
        .eq("user_id", user.id)
        .eq("subject", subject);
      if (error) console.error("Failed to reset flashcard progress", error);
    } else {
      clearLocalProgress(subject);
    }
  }, [user, supabase, subject]);

  return { progress, hydrated, getProgress, rate, resetAll, user };
}
