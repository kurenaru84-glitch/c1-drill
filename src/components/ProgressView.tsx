"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ALL_SECTIONS, PROVIDER_LABELS, SECTION_TOTALS } from "@/data/sections";
import { getOverallStats, getSectionProgress } from "@/lib/exam-progress";

export function ProgressView() {
  const stats = useMemo(
    () => getOverallStats(ALL_SECTIONS.map((s) => s.id), SECTION_TOTALS),
    []
  );

  const accuracy =
    stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0;

  return (
    <main className="mx-auto max-w-lg px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900">進捗</h1>
      </header>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-stone-900">{stats.answered}</p>
          <p className="text-xs text-stone-500">回答済み</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-emerald-700">{stats.correct}</p>
          <p className="text-xs text-stone-500">正解</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-teal-700">{accuracy}%</p>
          <p className="text-xs text-stone-500">正答率</p>
        </div>
      </div>

      <p className="mb-4 text-sm text-stone-600">
        全体: {stats.answered} / {stats.total} 問
      </p>

      <ul className="space-y-2">
        {ALL_SECTIONS.map((section) => {
          const total = section.questions.length;
          const p = getSectionProgress(section.id, total);
          const pct = total > 0 ? Math.round((p.answered / total) * 100) : 0;
          return (
            <li key={section.id}>
              <Link
                href={`/s/${section.id}`}
                className="block rounded-2xl border border-stone-200 bg-white p-4 active:bg-stone-50"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-teal-700">
                    {PROVIDER_LABELS[section.provider]}
                  </span>
                  <span className="text-xs text-stone-500">
                    {p.correct}/{total} 正解
                  </span>
                </div>
                <p className="text-sm font-medium text-stone-900">{section.titleJa}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full bg-teal-600"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
