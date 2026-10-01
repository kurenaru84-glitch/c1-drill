"use client";

import { SelectableText } from "@/components/SelectableText";
import type { Question, QuestionExplanation } from "@/lib/exam-types";

type Props = {
  question: Question;
  selectedId: string;
  explanation: QuestionExplanation;
  source: string;
  onToast?: (message: string) => void;
};

export function ExplanationPanel({
  question,
  selectedId,
  explanation,
  source,
  onToast,
}: Props) {
  const correct = selectedId === question.correctOptionId;
  const correctLabel =
    question.options.find((o) => o.id === question.correctOptionId)?.text ?? question.correctOptionId;

  return (
    <div
      className={`rounded-2xl border p-4 ${
        correct ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
      }`}
    >
      <p className={`mb-2 text-sm font-semibold ${correct ? "text-emerald-800" : "text-amber-900"}`}>
        {correct ? "✓ 正解！" : "✗ 不正解"}
        {!correct && (
          <span className="ml-2 font-normal text-stone-600">
            正解: <strong>{question.correctOptionId}</strong> — {correctLabel}
          </span>
        )}
      </p>

      <div className="mb-3 rounded-xl bg-white/50 p-2">
        <SelectableText
          text={explanation.summary}
          language="de"
          source={`${source} · 解説`}
          className="whitespace-pre-wrap text-sm leading-relaxed text-stone-800"
          onToast={onToast}
        />
      </div>

      {explanation.german && (
        <div className="mb-3 rounded-xl bg-white/70 p-3">
          <p className="mb-1 text-xs font-medium text-stone-500">Deutsch (Original)</p>
          <SelectableText
            text={explanation.german}
            language="de"
            source={`${source} · 解説 DE`}
            className="text-sm leading-relaxed text-stone-600"
            onToast={onToast}
          />
        </div>
      )}

      {explanation.wrong && selectedId !== question.correctOptionId && explanation.wrong[selectedId] && (
        <div className="mb-3 rounded-xl bg-white/70 p-3">
          <p className="mb-1 text-xs font-medium text-stone-500">あなたの選択（{selectedId}）が違う理由</p>
          <SelectableText
            text={explanation.wrong[selectedId]}
            language="de"
            source={`${source} · 誤答解説`}
            className="text-sm text-stone-700"
            onToast={onToast}
          />
        </div>
      )}

      {explanation.wrong && (
        <details className="group">
          <summary className="cursor-pointer text-xs font-medium text-teal-700">
            他の選択肢の解説を見る
          </summary>
          <ul className="mt-2 space-y-2">
            {Object.entries(explanation.wrong).map(([id, text]) => (
              <li key={id} className="rounded-lg bg-white/60 px-3 py-2 text-sm text-stone-700">
                <span className="font-semibold text-stone-900">{id}:</span>
                <SelectableText
                  text={text}
                  language="de"
                  source={`${source} · 選択肢 ${id}`}
                  className="mt-1 text-sm text-stone-700"
                  onToast={onToast}
                />
              </li>
            ))}
          </ul>
        </details>
      )}

      {explanation.tip && (
        <p className="mt-3 rounded-xl border border-teal-100 bg-teal-50/80 px-3 py-2 text-xs text-teal-900">
          💡 {explanation.tip}
        </p>
      )}
    </div>
  );
}
