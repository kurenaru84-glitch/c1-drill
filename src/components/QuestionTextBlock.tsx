"use client";

import { SelectableText } from "@/components/SelectableText";
import { NvvQuickWords } from "@/components/NvvQuickWords";
import type { ChoiceOption } from "@/lib/exam-types";
import type { LearningLanguage } from "@/lib/types";

type Props = {
  label?: string;
  text: string;
  language: LearningLanguage;
  source: string;
  onToast?: (message: string) => void;
  className?: string;
  nvvQuick?: {
    prompt: string;
    options: ChoiceOption[];
    correctOptionId: string;
  };
};

export function QuestionTextBlock({
  label,
  text,
  language,
  source,
  onToast,
  className = "text-sm font-medium leading-relaxed text-stone-900",
  nvvQuick,
}: Props) {
  return (
    <div>
      {label && <p className="mb-1 text-xs font-medium text-stone-500">{label}</p>}
      <SelectableText
        text={text}
        language={language}
        source={source}
        className={className}
        onToast={onToast}
      />
      <p className="mt-1 text-[10px] text-stone-400">範囲を選択 → 下のバーで単語リストに追加</p>
      {nvvQuick && (
        <NvvQuickWords
          prompt={nvvQuick.prompt}
          options={nvvQuick.options}
          correctOptionId={nvvQuick.correctOptionId}
          language={language}
          source={source}
          onToast={onToast}
        />
      )}
    </div>
  );
}
