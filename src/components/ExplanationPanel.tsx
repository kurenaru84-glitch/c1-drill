"use client";

import { useEffect, useMemo, useState } from "react";
import { SelectableText } from "@/components/SelectableText";
import { fetchRichExplanation, getCachedRichExplanation } from "@/lib/fetch-rich-explanation";
import { buildCompletedSentence } from "@/lib/question-completed-sentence";
import type { ExamSkill, Question, QuestionExplanation, RichExplanation } from "@/lib/exam-types";

type Props = {
  question: Question;
  selectedId: string;
  explanation: QuestionExplanation;
  source: string;
  sectionTitle: string;
  skill: ExamSkill;
  onToast?: (message: string) => void;
};

function SectionBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 rounded-xl border border-stone-200 bg-white p-3">
      <p className="mb-2 text-xs font-semibold text-stone-800">{title}</p>
      {children}
    </div>
  );
}

export function ExplanationPanel({
  question,
  selectedId,
  explanation,
  source,
  sectionTitle,
  skill,
  onToast,
}: Props) {
  const correct = selectedId === question.correctOptionId;
  const correctOption = question.options.find((o) => o.id === question.correctOptionId);
  const correctLabel = correctOption?.text ?? question.correctOptionId;
  const useRich = skill === "nvv" || skill === "sprachbausteine";

  const [rich, setRich] = useState<RichExplanation | null>(null);
  const [loadingRich, setLoadingRich] = useState(false);
  const [richError, setRichError] = useState<string | null>(null);

  const fallbackCompleted = useMemo(
    () =>
      buildCompletedSentence(
        question.prompt,
        correctLabel,
        skill === "sprachbausteine" ? question.number : undefined
      ),
    [question.prompt, question.number, correctLabel, skill]
  );

  useEffect(() => {
    if (!useRich) {
      setRich(null);
      return;
    }

    const cached = getCachedRichExplanation(question.id);
    setRich(cached);
    setRichError(null);
    if (cached?.completedSentenceDe?.trim()) {
      setLoadingRich(false);
      return;
    }

    let cancelled = false;
    setLoadingRich(true);
    void fetchRichExplanation({
      questionId: question.id,
      skill,
      sectionTitle,
      question,
    })
      .then((data) => {
        if (!cancelled) setRich(data);
      })
      .catch((error) => {
        if (!cancelled) {
          setRichError(error instanceof Error ? error.message : "詳細解説を取得できませんでした。");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingRich(false);
      });

    return () => {
      cancelled = true;
    };
  }, [useRich, question, skill, sectionTitle]);

  const completedDe = rich?.completedSentenceDe?.trim() || fallbackCompleted;
  const correctLine =
    rich?.correctAnswerLineJa?.trim() ||
    `正解は ${question.correctOptionId.toUpperCase()}: ${correctLabel} です。`;

  return (
    <div
      className={`rounded-2xl border p-4 ${
        correct ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
      }`}
    >
      <p className={`mb-3 text-sm font-semibold ${correct ? "text-emerald-800" : "text-amber-900"}`}>
        {correct ? "✓ 正解！" : "✗ 不正解"}
        {!correct && (
          <span className="ml-2 font-normal text-stone-600">
            正解: {question.correctOptionId.toUpperCase()} — {correctLabel}
          </span>
        )}
      </p>

      {useRich ? (
        <>
          {loadingRich && !rich && (
            <p className="mb-3 text-sm text-teal-800">詳しい解説を作成しています…（初回のみ10〜20秒）</p>
          )}
          {richError && !rich && (
            <p className="mb-3 text-sm text-amber-900">{richError}</p>
          )}

          <SectionBlock title="解説">
            <p className="text-sm font-medium text-stone-900">{correctLine}</p>
          </SectionBlock>

          <SectionBlock title="完成した文章">
            <SelectableText
              text={completedDe}
              language="de"
              source={`${source} · 完成文`}
              className="text-sm leading-relaxed text-stone-900"
              onToast={onToast}
            />
          </SectionBlock>

          {(rich?.translationJa || question.promptJa) && (
            <SectionBlock title="日本語訳">
              <p className="text-sm leading-relaxed text-stone-700">
                {rich?.translationJa?.trim() || question.promptJa}
              </p>
            </SectionBlock>
          )}

          {(rich?.mainBodyJa || explanation.german) && (
            <SectionBlock title={rich?.mainTitleJa || "解説"}>
              {rich?.mainBodyJa ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-800">
                  {rich.mainBodyJa}
                </p>
              ) : (
                <>
                  {explanation.german && (
                    <p className="mb-2 text-sm text-stone-700">{explanation.german}</p>
                  )}
                  <SelectableText
                    text={explanation.summary}
                    language="de"
                    source={`${source} · 解説`}
                    className="whitespace-pre-wrap text-sm leading-relaxed text-stone-800"
                    onToast={onToast}
                  />
                </>
              )}
            </SectionBlock>
          )}

          {rich?.wrongOptions && rich.wrongOptions.length > 0 && (
            <SectionBlock title="他の選択肢について">
              <ul className="space-y-3">
                {rich.wrongOptions.map((row) => (
                  <li key={row.id} className="text-sm">
                    <p className="font-semibold text-stone-900">
                      {row.id.toUpperCase()}: {row.textDe}
                    </p>
                    <p className="mt-1 leading-relaxed text-stone-700">{row.reasonJa}</p>
                  </li>
                ))}
              </ul>
            </SectionBlock>
          )}

          {rich?.grammarPoints && rich.grammarPoints.length > 0 && (
            <SectionBlock title="重要文法・構文ポイント">
              <ul className="space-y-3">
                {rich.grammarPoints.map((g, i) => (
                  <li key={i}>
                    <p className="text-sm font-semibold text-stone-900">{g.titleJa}</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-stone-700">
                      {g.bodyJa}
                    </p>
                  </li>
                ))}
              </ul>
            </SectionBlock>
          )}

          {rich?.vocabulary && rich.vocabulary.length > 0 && (
            <SectionBlock title="重要単語リスト">
              <ul className="space-y-1.5">
                {rich.vocabulary.map((v, i) => (
                  <li key={i} className="text-sm text-stone-800">
                    <span className="font-medium text-stone-900">{v.termDe}</span>
                    <span className="text-stone-600">: {v.meaningJa}</span>
                  </li>
                ))}
              </ul>
            </SectionBlock>
          )}
        </>
      ) : (
        <>
          <div className="mb-3 rounded-xl border border-emerald-200 bg-white p-3">
            <p className="text-sm font-semibold text-stone-900">
              {question.correctOptionId}. {correctLabel}
            </p>
            {explanation.german && (
              <p className="mt-2 text-sm text-stone-700">{explanation.german}</p>
            )}
          </div>
          <SelectableText
            text={explanation.summary}
            language="de"
            source={`${source} · 解説`}
            className="whitespace-pre-wrap text-sm leading-relaxed text-stone-800"
            onToast={onToast}
          />
        </>
      )}

      {explanation.tip && (
        <p className="mt-3 rounded-xl border border-teal-100 bg-teal-50/80 px-3 py-2 text-xs text-teal-900">
          💡 {explanation.tip}
        </p>
      )}
    </div>
  );
}
