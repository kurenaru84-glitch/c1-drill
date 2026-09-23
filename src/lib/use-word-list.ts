"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchTranslation } from "@/lib/fetch-translation";
import type { LearningLanguage, WordListEntry } from "@/lib/types";
import {
  addWordListEntry,
  loadWordList,
  removeWordListEntry,
  setWordListLearned,
  updateWordListNote,
} from "@/lib/word-list";

export function useWordList() {
  const [entries, setEntries] = useState<WordListEntry[]>([]);
  const translatingRef = useRef<Set<string>>(new Set());

  const refresh = useCallback(() => {
    setEntries(loadWordList());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const translateNote = useCallback(
    async (
      id: string,
      term: string,
      language: LearningLanguage
    ): Promise<{ ok: true } | { ok: false; error: string }> => {
      if (translatingRef.current.has(id)) {
        return { ok: false, error: "翻訳中です" };
      }
      translatingRef.current.add(id);
      try {
        const translationJa = await fetchTranslation(term, language);
        updateWordListNote(id, translationJa);
        refresh();
        return { ok: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : "翻訳に失敗しました。";
        return { ok: false, error: message };
      } finally {
        translatingRef.current.delete(id);
      }
    },
    [refresh]
  );

  const addEntry = useCallback(
    (params: {
      term: string;
      note?: string;
      language: LearningLanguage;
      source: string;
      autoTranslate?: boolean;
    }) => {
      const result = addWordListEntry({
        term: params.term,
        note: params.note ?? "",
        language: params.language,
        source: params.source,
        learned: false,
      });
      if (result.ok) {
        refresh();
        const shouldTranslate = params.autoTranslate !== false && !params.note?.trim();
        if (shouldTranslate) {
          void translateNote(result.entry.id, params.term, params.language);
        }
      }
      return result;
    },
    [refresh, translateNote]
  );

  return {
    entries,
    addEntry,
    removeEntry: (id: string) => {
      removeWordListEntry(id);
      refresh();
    },
    updateNote: (id: string, note: string) => {
      updateWordListNote(id, note);
      refresh();
    },
    setLearned: (id: string, learned: boolean) => {
      setWordListLearned(id, learned);
      refresh();
    },
    translateNote,
    refresh,
  };
}
