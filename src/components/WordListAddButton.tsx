"use client";

import { useWordList } from "@/lib/use-word-list";
import type { LearningLanguage } from "@/lib/types";

type Props = {
  term: string;
  note: string;
  language: LearningLanguage;
  source: string;
  onToast?: (message: string) => void;
  className?: string;
  children: React.ReactNode;
};

export function WordListAddButton({
  term,
  note,
  language,
  source,
  onToast,
  className = "",
  children,
}: Props) {
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
