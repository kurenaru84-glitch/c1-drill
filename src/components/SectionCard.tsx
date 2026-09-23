"use client";

import Link from "next/link";
import { IconChevron } from "@/components/icons";
import type { ExamSection } from "@/lib/exam-types";
import { getSectionProgress } from "@/lib/exam-progress";
import { SKILL_LABELS } from "@/data/sections";

type Props = {
  section: ExamSection;
};

export function SectionCard({ section }: Props) {
  const total = section.questions.length;
  const progress = getSectionProgress(section.id, total);
  const pct = total > 0 ? Math.round((progress.answered / total) * 100) : 0;
  const done = progress.answered >= total;

  return (
    <Link
      href={`/s/${section.id}`}
      className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 transition-colors active:bg-stone-50"
    >
      <div className="relative h-11 w-11 shrink-0">
        <svg className="h-11 w-11 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e7e5e4" strokeWidth="3" />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke={done ? "#059669" : "#0d9488"}
            strokeWidth="3"
            strokeDasharray={`${pct} 100`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-stone-700">
          {progress.correct}/{total}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-teal-700">
          {SKILL_LABELS[section.skill]} · {section.estimatedMinutes}分
        </p>
        <h3 className="truncate text-sm font-semibold text-stone-900">{section.titleJa}</h3>
        <p className="truncate text-xs text-stone-500">{section.description}</p>
      </div>

      <IconChevron className="h-5 w-5 shrink-0 text-stone-400" />
    </Link>
  );
}
