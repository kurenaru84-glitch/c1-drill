"use client";

import { useCallback, useMemo, useState } from "react";
import type { WordListEntry } from "@/lib/types";

type WordListQuizProps = {
  entries: WordListEntry[];
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function pickQuestion(pool: WordListEntry[]) {
  const withNotes = pool.filter((e) => e.note.trim());
  if (withNotes.length < 4) return null;

  const target = withNotes[Math.floor(Math.random() * withNotes.length)]!;
  const distractors = shuffle(withNotes.filter((e) => e.id !== target.id)).slice(0, 3);
  const options = shuffle([target, ...distractors]);

  return { target, options };
}

export function WordListQuiz({ entries }: WordListQuizProps) {
  const pool = useMemo(
    () => entries.filter((e) => !e.learned && e.note.trim()),
    [entries]
  );

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState<ReturnType<typeof pickQuestion>>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const startQuiz = useCallback(() => {
    const q = pickQuestion(pool);
    if (!q) return;
    setQuestion(q);
    setSelectedId(null);
    setOpen(true);
  }, [pool]);

  const nextQuestion = useCallback(() => {
    const q = pickQuestion(pool);
    setQuestion(q);
    setSelectedId(null);
  }, [pool]);

  if (pool.length < 4) return null;

  const answered = selectedId !== null;
  const isCorrect = answered && selectedId === question?.target.id;

  return (
    <section className="mb-4 rounded-2xl border border-teal-200 bg-teal-50/50 p-4">
      {!open ? (
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-teal-900">ランダムクイズ</h2>
            <p className="mt-0.5 text-xs text-teal-800/80">
              日本語の意味から {pool.length} 語の中から当てる
            </p>
          </div>
          <button
            type="button"
            onClick={startQuiz}
            className="shrink-0 rounded-full bg-teal-700 px-4 py-2 text-sm font-medium text-white"
          >
            始める
          </button>
        </div>
      ) : question ? (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-teal-900">クイズ</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-stone-500 hover:text-stone-700"
            >
              閉じる
            </button>
          </div>

          {score.total > 0 && (
            <p className="mb-2 text-xs text-teal-800">
              正解 {score.correct} / {score.total}
            </p>
          )}

          <p className="mb-1 text-xs text-stone-500">この意味の単語・フレーズは？</p>
          <p className="mb-4 rounded-xl bg-white px-3 py-3 text-sm font-medium text-stone-800">
            {question.target.note}
          </p>

          <ul className="space-y-2">
            {question.options.map((option) => {
              let style = "border-stone-200 bg-white text-stone-900 hover:border-teal-300";
              if (answered) {
                if (option.id === question.target.id) {
                  style = "border-emerald-400 bg-emerald-50 text-emerald-900";
                } else if (option.id === selectedId) {
                  style = "border-red-300 bg-red-50 text-red-900";
                } else {
                  style = "border-stone-200 bg-stone-50 text-stone-500";
                }
              }

              return (
                <li key={option.id}>
                  <button
                    type="button"
                    disabled={answered}
                    onClick={() => {
                      if (answered) return;
                      setSelectedId(option.id);
                      const correct = option.id === question.target.id;
                      setScore((s) => ({
                        correct: s.correct + (correct ? 1 : 0),
                        total: s.total + 1,
                      }));
                    }}
                    className={`w-full rounded-xl border px-3 py-3 text-left text-sm font-medium transition-colors disabled:cursor-default ${style}`}
                  >
                    {option.term}
                  </button>
                </li>
              );
            })}
          </ul>

          {answered && (
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={nextQuestion}
                className="flex-1 rounded-xl bg-teal-700 py-2.5 text-sm font-medium text-white"
              >
                次の問題
              </button>
            </div>
          )}

          {answered && (
            <p
              className={`mt-3 text-center text-sm font-medium ${
                isCorrect ? "text-emerald-700" : "text-red-700"
              }`}
            >
              {isCorrect ? "正解！" : `不正解 — 答え: ${question.target.term}`}
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}
