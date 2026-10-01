"use client";

import Link from "next/link";
import { useMemo } from "react";
import { IconChevron } from "@/components/icons";
import { getQuestionAnswer, getSectionProgress, resetSectionProgress } from "@/lib/exam-progress";
import { collectSprachbausteineVocab } from "@/lib/sprachbausteine-utils";
import type { ExamSection } from "@/lib/exam-types";

type Props = {
  section: ExamSection;
};

export function SprachbausteineEpisodeHub({ section }: Props) {
  const total = section.questions.length;
  const progress = useMemo(() => getSectionProgress(section.id, total), [section.id, total]);
  const vocabCount = collectSprachbausteineVocab(section).length;

  const nextIndex = section.questions.findIndex((q) => !getQuestionAnswer(section.id, q.id));
  const startIndex = nextIndex === -1 ? 0 : nextIndex;

  function handleReset() {
    if (confirm("このエピソードの進捗をリセットしますか？")) {
      resetSectionProgress(section.id);
      window.location.reload();
    }
  }

  const modes = [
    {
      href: `/s/${section.id}/lesen`,
      title: "全文を読む",
      desc: "空所が埋まった完成文。段落ごとに音声（TTS）も再生できます。",
      badge: `${section.passage?.paragraphs.length ?? 0} 段落`,
      color: "border-sky-200 bg-sky-50/80",
    },
    {
      href: `/s/${section.id}/q/${startIndex}`,
      title: "問題（Lücke）",
      desc: "本番形式の空所補充。1問ずつ答え合わせと解説。",
      badge: `${progress.correct}/${total} 正解`,
      color: "border-teal-200 bg-teal-50/80",
    },
    {
      href: `/s/${section.id}/vocab`,
      title: "語彙確認",
      desc: "本文関連の Wortschatz。タップで意味を確認し、単語リストに追加。",
      badge: `${vocabCount} 語`,
      color: "border-amber-200 bg-amber-50/80",
    },
  ];

  return (
    <main className="mx-auto max-w-lg px-4 py-6">
      <Link href="/sb" className="mb-4 inline-flex items-center gap-1 text-sm text-teal-700">
        <IconChevron className="h-4 w-4 rotate-180" />
        エピソード一覧
      </Link>

      <header className="mb-6">
        <p className="text-xs font-medium text-teal-700">Text {section.partNumber}</p>
        <h1 className="text-xl font-semibold text-stone-900">{section.title}</h1>
        <p className="mt-1 text-sm text-stone-600">{section.instruction}</p>
      </header>

      <div className="space-y-3">
        {modes.map((mode) => (
          <Link
            key={mode.href}
            href={mode.href}
            className={`block rounded-2xl border p-4 transition-colors active:opacity-90 ${mode.color}`}
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-base font-semibold text-stone-900">{mode.title}</h2>
              <span className="shrink-0 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-stone-600">
                {mode.badge}
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{mode.desc}</p>
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="mt-8 w-full rounded-xl border border-stone-200 py-2.5 text-xs text-stone-500"
      >
        このエピソードの進捗をリセット
      </button>
    </main>
  );
}
