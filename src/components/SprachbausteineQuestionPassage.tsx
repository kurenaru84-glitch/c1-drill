"use client";

import { gapContextText, splitPassageGaps } from "@/lib/sprachbausteine-utils";
import type { ExamSection } from "@/lib/exam-types";

type Props = {
  section: ExamSection;
  activeGap: number;
};

export function SprachbausteineQuestionPassage({ section, activeGap }: Props) {
  const snippet = gapContextText(section, activeGap);
  if (!snippet) return null;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-3">
      <p className="mb-2 text-xs font-medium text-stone-500">文脈（該当箇所）</p>
      <p className="text-[0.95rem] leading-relaxed text-stone-900">
        {splitPassageGaps(snippet).map((part, i) => {
          if (part.kind === "text") {
            return <span key={i}>{part.value}</span>;
          }
          const isActive = part.number === activeGap;
          return (
            <span
              key={i}
              className={`mx-0.5 inline rounded px-0.5 font-medium ${
                isActive
                  ? "bg-teal-100 text-teal-900 ring-2 ring-teal-500"
                  : "bg-amber-50 text-stone-800"
              }`}
            >
              [{part.number}] ________
            </span>
          );
        })}
      </p>
      <p className="mt-2 text-[11px] text-stone-400">
        全文はエピソードメニューの「全文を読む」から
      </p>
    </div>
  );
}
