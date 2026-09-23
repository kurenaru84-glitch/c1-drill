import type { StudyNotes } from "@/lib/types";
import { normalizeStudyNotes } from "@/lib/study-notes";

export function StudyNotesPanel({ notes }: { notes: StudyNotes }) {
  const normalized = normalizeStudyNotes(notes);
  const hasChunks = normalized.chunks.length > 0;
  const hasGrammar = normalized.grammar.length > 0;
  const hasVocab = normalized.vocabulary.length > 0;

  if (!hasChunks && !hasGrammar && !hasVocab) return null;

  return (
    <div className="mt-4 space-y-4 border-t border-stone-100 pt-4">
      {hasChunks && (
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-800">
            実践チャンク・構文
          </h3>
          <ul className="space-y-2">
            {normalized.chunks.map((item) => (
              <li key={item.phrase} className="rounded-xl bg-teal-50/70 px-3 py-2">
                <p className="text-sm font-medium text-stone-900">{item.phrase}</p>
                <p className="mt-0.5 text-sm text-stone-600">{item.meaning}</p>
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
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-800">
            語彙・表現
          </h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {normalized.vocabulary.map((item) => (
              <li key={item.term} className="rounded-lg bg-stone-50/80 px-3 py-2 text-sm">
                <span className="font-medium text-stone-900">{item.term}</span>
                <span className="text-stone-600"> — {item.meaning}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
