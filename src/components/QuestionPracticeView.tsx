"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { PassageReader } from "@/components/PassageReader";
import { IconChevron } from "@/components/icons";
import { getQuestionAnswer, saveQuestionAnswer } from "@/lib/exam-progress";
import type { ExamSection } from "@/lib/exam-types";

type Props = {
  section: ExamSection;
  questionIndex: number;
};

export function QuestionPracticeView({ section, questionIndex }: Props) {
  const question = section.questions[questionIndex];
  const total = section.questions.length;
  const existing = getQuestionAnswer(section.id, question.id);

  const [selectedId, setSelectedId] = useState<string | null>(existing?.selectedOptionId ?? null);
  const [submitted, setSubmitted] = useState(!!existing);

  const handleSubmit = useCallback(() => {
    if (!selectedId || submitted) return;
    const correct = selectedId === question.correctOptionId;
    saveQuestionAnswer({
      sectionId: section.id,
      questionId: question.id,
      selectedOptionId: selectedId,
      correct,
      answeredAt: Date.now(),
    });
    setSubmitted(true);
  }, [selectedId, submitted, question, section.id]);

  const hasPrev = questionIndex > 0;
  const hasNext = questionIndex < total - 1;

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-lg flex-col bg-stone-50">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/s/${section.id}`}
            className="inline-flex items-center gap-1 text-sm text-teal-700"
          >
            <IconChevron className="h-4 w-4 rotate-180" />
            戻る
          </Link>
          <span className="text-xs font-medium text-stone-500">
            {questionIndex + 1} / {total}
          </span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-teal-600 transition-all"
            style={{ width: `${((questionIndex + 1) / total) * 100}%` }}
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <PassageReader
          sectionId={section.id}
          passage={section.passage}
          transcript={section.transcript}
          sourceLabel={section.titleJa}
          compact
          defaultExpanded={false}
        />

        <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4">
          <p className="mb-1 text-xs font-medium text-stone-500">Aufgabe {question.number}</p>
          <p className="text-sm font-medium leading-relaxed text-stone-900">{question.prompt}</p>
          {question.promptJa && (
            <p className="mt-2 border-t border-stone-100 pt-2 text-sm leading-relaxed text-stone-600">
              <span className="mr-1.5 text-xs font-medium text-stone-400">訳</span>
              {question.promptJa}
            </p>
          )}
        </div>

        <div className="mt-3 space-y-2">
          {question.options.map((opt) => {
            const isSelected = selectedId === opt.id;
            const isCorrect = opt.id === question.correctOptionId;
            let style = "border-stone-200 bg-white text-stone-800";
            if (submitted) {
              if (isCorrect) style = "border-emerald-300 bg-emerald-50 text-emerald-900";
              else if (isSelected) style = "border-amber-300 bg-amber-50 text-amber-900";
            } else if (isSelected) {
              style = "border-teal-400 bg-teal-50 text-teal-900";
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={submitted}
                onClick={() => setSelectedId(opt.id)}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors disabled:cursor-default ${style}`}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-bold">
                  {opt.id}
                </span>
                <span className="leading-relaxed">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {submitted && selectedId && (
          <div className="mt-4">
            <ExplanationPanel
              question={question}
              selectedId={selectedId}
              explanation={question.explanation}
            />
          </div>
        )}
      </div>

      <footer
        className="sticky bottom-0 border-t border-stone-200 bg-white px-4 py-3"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedId}
            className="w-full rounded-2xl bg-teal-700 py-3.5 text-sm font-semibold text-white disabled:bg-stone-300"
          >
            答え合わせ
          </button>
        ) : (
          <div className="flex gap-2">
            {hasPrev && (
              <Link
                href={`/s/${section.id}/q/${questionIndex - 1}`}
                className="flex-1 rounded-2xl border border-stone-200 py-3.5 text-center text-sm font-medium text-stone-700"
              >
                前へ
              </Link>
            )}
            {hasNext ? (
              <Link
                href={`/s/${section.id}/q/${questionIndex + 1}`}
                className="flex-[2] rounded-2xl bg-teal-700 py-3.5 text-center text-sm font-semibold text-white"
              >
                次の問題
              </Link>
            ) : (
              <Link
                href={`/s/${section.id}`}
                className="flex-[2] rounded-2xl bg-teal-700 py-3.5 text-center text-sm font-semibold text-white"
              >
                セクション完了
              </Link>
            )}
          </div>
        )}
      </footer>
    </div>
  );
}
