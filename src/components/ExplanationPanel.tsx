"use client";

import { SelectableText } from "@/components/SelectableText";
import type { Question, QuestionExplanation } from "@/lib/exam-types";

type Props = {
  question: Question;
  selectedId: string;
  explanation: QuestionExplanation;
  source: string;
  onToast?: (message: string) => void;
  /** Sprachbausteine: 全選択肢の正誤理由を詳しく */
  detailed?: boolean;
};

export function ExplanationPanel({
  question,
  selectedId,
  explanation,
  source,
  onToast,
  detailed = false,
}: Props) {
  const correct = selectedId === question.correctOptionId;
  const correctOption = question.options.find((o) => o.id === question.correctOptionId);
  const correctLabel = correctOption?.text ?? question.correctOptionId;
  const selectedOption = question.options.find((o) => o.id === selectedId);

  return (
    <div
      className={`rounded-2xl border p-4 ${
        correct ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
      }`}
    >
      <p className={`mb-3 text-sm font-semibold ${correct ? "text-emerald-800" : "text-amber-900"}`}>
        {correct ? "✓ 正解！" : "✗ 不正解"}
      </p>

      <div className="mb-3 rounded-xl border border-emerald-200 bg-white p-3">
        <p className="mb-1 text-xs font-medium text-emerald-800">正解の選択肢</p>
        <p className="text-sm font-semibold text-stone-900">
          {question.correctOptionId}. {correctLabel}
        </p>
        {explanation.german && (
          <p className="mt-2 text-sm leading-relaxed text-stone-700">
            <span className="mr-1 text-xs font-medium text-stone-500">根拠（DE）</span>
            {explanation.german}
          </p>
        )}
      </div>

      {!correct && selectedOption && (
        <div className="mb-3 rounded-xl border border-amber-200 bg-white p-3">
          <p className="mb-1 text-xs font-medium text-amber-900">あなたの選択</p>
          <p className="text-sm font-semibold text-stone-900">
            {selectedId}. {selectedOption.text}
          </p>
          {explanation.wrong?.[selectedId] && (
            <SelectableText
              text={explanation.wrong[selectedId]}
              language="de"
              source={`${source} · 誤答解説`}
              className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-700"
              onToast={onToast}
            />
          )}
        </div>
      )}

      {detailed && explanation.wrong && (
        <div className="mb-3 rounded-xl bg-white/80 p-3">
          <p className="mb-2 text-xs font-medium text-stone-600">すべての不正解の理由</p>
          <ul className="space-y-2">
            {question.options
              .filter((o) => o.id !== question.correctOptionId)
              .map((opt) => (
                <li
                  key={opt.id}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    opt.id === selectedId ? "bg-amber-50 ring-1 ring-amber-200" : "bg-stone-50"
                  }`}
                >
                  <span className="font-semibold text-stone-900">
                    {opt.id}. {opt.text}
                  </span>
                  {explanation.wrong?.[opt.id] ? (
                    <SelectableText
                      text={explanation.wrong[opt.id]}
                      language="de"
                      source={`${source} · 選択肢 ${opt.id}`}
                      className="mt-1 text-sm leading-relaxed text-stone-700"
                      onToast={onToast}
                    />
                  ) : (
                    <p className="mt-1 text-xs text-stone-500">この選択肢は文脈に合いません。</p>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}

      {!detailed && explanation.wrong && selectedId !== question.correctOptionId && (
        <details className="group mb-3">
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

      <div className="rounded-xl bg-white/50 p-2">
        <p className="mb-1 text-xs font-medium text-stone-500">まとめ</p>
        <SelectableText
          text={explanation.summary}
          language="de"
          source={`${source} · 解説`}
          className="whitespace-pre-wrap text-sm leading-relaxed text-stone-800"
          onToast={onToast}
        />
      </div>

      {explanation.tip && (
        <p className="mt-3 rounded-xl border border-teal-100 bg-teal-50/80 px-3 py-2 text-xs text-teal-900">
          💡 {explanation.tip}
        </p>
      )}
    </div>
  );
}
