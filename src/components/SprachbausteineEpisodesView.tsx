"use client";

import Link from "next/link";
import { IconChevron } from "@/components/icons";
import { getSectionsByProvider } from "@/data/sections";
import { getSectionProgress } from "@/lib/exam-progress";

export function SprachbausteineEpisodesView() {
  const episodes = getSectionsByProvider("sprachbausteine").sort(
    (a, b) => a.partNumber - b.partNumber
  );

  return (
    <main className="mx-auto max-w-lg px-4 py-6">
      <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm text-teal-700">
        <IconChevron className="h-4 w-4 rotate-180" />
        ホーム
      </Link>

      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900">Sprachbausteine C1</h1>
        <p className="mt-1 text-sm text-stone-600">
          エピソードを選んで、全文・空所・語彙の3モードで学習します（全 {episodes.length} 本）。
        </p>
      </header>

      <ul className="space-y-2">
        {episodes.map((section) => {
          const total = section.questions.length;
          const progress = getSectionProgress(section.id, total);
          const done = progress.answered >= total;

          return (
            <li key={section.id}>
              <Link
                href={`/s/${section.id}`}
                className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 active:bg-stone-50"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                    done ? "bg-emerald-100 text-emerald-800" : "bg-teal-50 text-teal-800"
                  }`}
                >
                  {section.partNumber}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-stone-900">{section.title}</p>
                  <p className="text-xs text-stone-500">
                    {section.description} · {progress.correct}/{total} 正解
                  </p>
                </div>
                <IconChevron className="h-5 w-5 shrink-0 text-stone-400" />
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
