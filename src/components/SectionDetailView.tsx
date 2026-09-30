"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PassageReader } from "@/components/PassageReader";
import { IconChevron } from "@/components/icons";
import { PROVIDER_LABELS, SKILL_LABELS } from "@/data/sections";
import { getQuestionAnswer, getSectionProgress, resetSectionProgress } from "@/lib/exam-progress";
import type { ExamSection } from "@/lib/exam-types";

type Props = {
  section: ExamSection;
};

export function SectionDetailView({ section }: Props) {
  const total = section.questions.length;
  const progress = useMemo(() => getSectionProgress(section.id, total), [section.id, total]);

  const nextIndex = section.questions.findIndex(
    (q) => !getQuestionAnswer(section.id, q.id)
  );
  const startIndex = nextIndex === -1 ? 0 : nextIndex;

  function handleReset() {
    if (confirm("このセクションの進捗をリセットしますか？")) {
      resetSectionProgress(section.id);
      window.location.reload();
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-6">
      <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm text-teal-700">
        <IconChevron className="h-4 w-4 rotate-180" />
        セクション一覧
      </Link>

      <header className="mb-4">
        <p className="text-xs font-medium text-teal-700">
          {PROVIDER_LABELS[section.provider]} · {SKILL_LABELS[section.skill]}
        </p>
        <h1 className="text-xl font-semibold text-stone-900">{section.titleJa}</h1>
        <p className="mt-1 text-sm text-stone-600">{section.instruction}</p>
        <p className="mt-2 text-xs text-stone-500">
          {progress.correct}/{total} 正解 · 約 {section.estimatedMinutes} 分
        </p>
      </header>

      <div className="mb-4">
        <PassageReader
          sectionId={section.id}
          passage={section.passage}
          transcript={section.transcript}
          sourceLabel={section.titleJa}
          defaultExpanded
        />
      </div>

      <Link
        href={`/s/${section.id}/q/${startIndex}`}
        className="mb-6 flex w-full items-center justify-center rounded-2xl bg-teal-700 px-4 py-3.5 text-sm font-semibold text-white active:bg-teal-800"
      >
        {progress.answered === 0 ? "はじめる" : progress.answered >= total ? "もう一度" : "続きから"}
      </Link>

      <h2 className="mb-2 text-sm font-medium text-stone-900">問題一覧</h2>
      <ul className="mb-6 space-y-1">
        {section.questions.map((q, i) => {
          const answer = getQuestionAnswer(section.id, q.id);
          return (
            <li key={q.id}>
              <Link
                href={`/s/${section.id}/q/${i}`}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm active:bg-stone-100"
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    !answer
                      ? "bg-stone-100 text-stone-600"
                      : answer.correct
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {q.number}
                </span>
                <span className="min-w-0 flex-1 truncate text-stone-700">{q.prompt}</span>
                <IconChevron className="h-4 w-4 shrink-0 text-stone-400" />
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={handleReset}
        className="w-full rounded-xl border border-stone-200 py-2.5 text-xs text-stone-500"
      >
        進捗をリセット
      </button>
    </main>
  );
}
