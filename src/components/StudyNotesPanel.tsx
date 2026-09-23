"use client";

import { normalizeStudyNotes } from "@/lib/study-notes";
import { useWordList } from "@/lib/use-word-list";
import type { LearningLanguage, StudyNotes } from "@/lib/types";

type StudyNotesPanelProps = {
  notes: StudyNotes;
  language: LearningLanguage;
  source: string;
  onToast?: (message: string) => void;
};

type AddableNoteProps = {
  term: string;
  note: string;
  language: LearningLanguage;
  source: string;
  onToast?: (message: string) => void;
  className?: string;
  children: React.ReactNode;
};

function AddableNote({
  term,
  note,
  language,
  source,
  onToast,
  className = "",
  children,
}: AddableNoteProps) {
  const { addEntry } = useWordList();

  function handleClick(event: React.MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    const result = addEntry({
      term,
      note,
      language,
      source,
      autoTranslate: false,
    });
    onToast?.(result.ok ? "単語リストに追加しました" : "すでに登録済みです");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full rounded-xl text-left transition-colors active:scale-[0.99] ${className}`}
      aria-label={`「${term}」を単語リストに追加`}
    >
      {children}
    </button>
  );
}

export function StudyNotesPanel({ notes, language, source, onToast }: StudyNotesPanelProps) {
  const normalized = normalizeStudyNotes(notes);
  const hasChunks = normalized.chunks.length > 0;
  const hasGrammar = normalized.grammar.length > 0;
  const hasVocab = normalized.vocabulary.length > 0;

  if (!hasChunks && !hasGrammar && !hasVocab) return null;

  const addableHint = (
    <p className="mb-2 text-[10px] text-stone-400">タップで単語リストに追加</p>
  );

  return (
    <div className="mt-4 space-y-4 border-t border-stone-100 pt-4" onClick={(e) => e.stopPropagation()}>
      {hasChunks && (
        <section>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-teal-800">
            実践チャンク・構文
          </h3>
          {addableHint}
          <ul className="space-y-2">
            {normalized.chunks.map((item) => (
              <li key={item.phrase}>
                <AddableNote
                  term={item.phrase}
                  note={item.meaning}
                  language={language}
                  source={source}
                  onToast={onToast}
                  className="bg-teal-50/70 px-3 py-2 hover:bg-teal-100/80 active:bg-teal-100"
                >
                  <p className="text-sm font-medium text-stone-900">{item.phrase}</p>
                  <p className="mt-0.5 text-sm text-stone-600">{item.meaning}</p>
                </AddableNote>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasGrammar && (
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-800">
            文法・構文パターン
          </h3>
          <ul className="space-y-2">
            {normalized.grammar.map((item) => (
              <li key={item.pattern} className="rounded-xl bg-stone-50 px-3 py-2">
                <p className="text-sm font-medium text-stone-900">{item.pattern}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-stone-600">
                  {item.explanation}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasVocab && (
        <section>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-teal-800">
            語彙・表現
          </h3>
          {addableHint}
          <ul className="grid gap-2 sm:grid-cols-2">
            {normalized.vocabulary.map((item) => (
              <li key={item.term}>
                <AddableNote
                  term={item.term}
                  note={item.meaning}
                  language={language}
                  source={source}
                  onToast={onToast}
                  className="rounded-lg bg-stone-50/80 px-3 py-2 text-sm hover:bg-stone-100 active:bg-stone-100"
                >
                  <span className="font-medium text-stone-900">{item.term}</span>
                  <span className="text-stone-600"> — {item.meaning}</span>
                </AddableNote>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
