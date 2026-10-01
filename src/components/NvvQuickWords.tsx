"use client";

import { useMemo } from "react";
import type { ChoiceOption } from "@/lib/exam-types";
import { buildNvvQuickTerms } from "@/lib/nvv-vocab-extract";
import type { LearningLanguage } from "@/lib/types";
import { useWordList } from "@/lib/use-word-list";

type Props = {
  prompt: string;
  options: ChoiceOption[];
  correctOptionId: string;
  language: LearningLanguage;
  source: string;
  onToast?: (message: string) => void;
};

export function NvvQuickWords({
  prompt,
  options,
  correctOptionId,
  language,
  source,
  onToast,
}: Props) {
  const { addEntry } = useWordList();
  const terms = useMemo(
    () => buildNvvQuickTerms(prompt, options, correctOptionId),
    [prompt, options, correctOptionId]
  );

  if (terms.length === 0) return null;

  function addTerm(term: string) {
    const result = addEntry({ term, language, source });
    onToast?.(result.ok ? "単語リストに追加しました" : "すでに登録済みです");
  }

  return (
    <div className="mt-3 border-t border-stone-100 pt-3">
      <p className="mb-2 text-[10px] font-medium text-stone-400">タップで単語リストに追加</p>
      <div className="flex flex-wrap gap-2">
        {terms.map(({ term, kind, isCorrect }) => (
          <button
            key={`${kind}-${term}`}
            type="button"
            onClick={() => addTerm(term)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors active:scale-[0.98] ${
              isCorrect
                ? "bg-teal-100 text-teal-900 ring-1 ring-teal-200"
                : kind === "option"
                  ? "bg-stone-100 text-stone-800"
                  : "bg-white text-stone-700 ring-1 ring-stone-200"
            }`}
          >
            {term}
            {isCorrect ? " ★" : ""}
          </button>
        ))}
      </div>
    </div>
  );
}
