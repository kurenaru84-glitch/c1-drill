"use client";

import { useEffect, useMemo, useState } from "react";
import { SelectableText } from "@/components/SelectableText";
import { WordListAddButton } from "@/components/WordListAddButton";
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

function ExplanationSelectable({
  text,
  source,
  suffix,
  className = "text-sm leading-relaxed text-stone-800",
  onToast,
}: {
  text: string;
  source: string;
  suffix: string;
  className?: string;
  onToast?: (message: string) => void;
}) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  return (
    <SelectableText
      text={trimmed}
      language="de"
      source={`${source} · ${suffix}`}
      className={className}
      onToast={onToast}
    />
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

          <p className="mb-3 text-[11px] text-stone-500">
            解説のどこでも範囲を選択 →「単語リストに追加」（語彙行はタップでも可）
          </p>

          <SectionBlock title="解説">
            <ExplanationSelectable
              text={correctLine}
              source={source}
              suffix="AI解説 · 正解"
              className="text-sm font-medium text-stone-900"
              onToast={onToast}
            />
          </SectionBlock>

          <SectionBlock title="完成した文章">
            <ExplanationSelectable
              text={completedDe}
              source={source}
              suffix="AI解説 · 完成文"
              className="text-sm leading-relaxed text-stone-900"
              onToast={onToast}
            />
          </SectionBlock>

          {(rich?.translationJa || question.promptJa) && (
            <SectionBlock title="日本語訳">
              <ExplanationSelectable
                text={rich?.translationJa?.trim() || question.promptJa || ""}
                source={source}
                suffix="AI解説 · 訳"
                className="text-sm leading-relaxed text-stone-700"
                onToast={onToast}
              />
            </SectionBlock>
          )}

          {(rich?.mainBodyJa || explanation.german || explanation.summary) && (
            <SectionBlock title={rich?.mainTitleJa || "解説"}>
              {rich?.mainBodyJa ? (
                <ExplanationSelectable
                  text={rich.mainBodyJa}
                  source={source}
                  suffix="AI解説 · 本文"
                  className="whitespace-pre-wrap text-sm leading-relaxed text-stone-800"
                  onToast={onToast}
                />
              ) : (
                <>
                  {explanation.german && (
                    <ExplanationSelectable
                      text={explanation.german}
                      source={source}
                      suffix="AI解説 · DE"
                      className="mb-2 text-sm text-stone-700"
                      onToast={onToast}
                    />
                  )}
                  <ExplanationSelectable
                    text={explanation.summary}
                    source={source}
                    suffix="AI解説 · まとめ"
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
                  <li key={row.id}>
                    <ExplanationSelectable
                      text={`${row.id.toUpperCase()}: ${row.textDe}\n${row.reasonJa}`}
                      source={source}
                      suffix={`AI解説 · 選択肢 ${row.id}`}
                      className="text-sm leading-relaxed text-stone-700"
                      onToast={onToast}
                    />
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
                    <ExplanationSelectable
                      text={`${g.titleJa}\n${g.bodyJa}`}
                      source={source}
                      suffix={`AI解説 · 文法 ${i + 1}`}
                      className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700"
                      onToast={onToast}
                    />
                  </li>
                ))}
              </ul>
            </SectionBlock>
          )}

          {rich?.vocabulary && rich.vocabulary.length > 0 && (
            <SectionBlock title="重要単語リスト">
              <p className="mb-2 text-[10px] text-stone-400">タップで単語リストに追加</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {rich.vocabulary.map((v, i) => (
                  <li key={`${v.termDe}-${i}`}>
                    <WordListAddButton
                      term={v.termDe}
                      note={v.meaningJa}
                      language="de"
                      source={`${source} · AI解説`}
                      onToast={onToast}
                      className="rounded-lg bg-stone-50/80 px-3 py-2 text-sm hover:bg-stone-100 active:bg-stone-100"
                    >
                      <span className="font-medium text-stone-900">{v.termDe}</span>
                      <span className="text-stone-600"> — {v.meaningJa}</span>
                    </WordListAddButton>
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
        <div className="mt-3 rounded-xl border border-teal-100 bg-teal-50/80 px-3 py-2">
          <ExplanationSelectable
            text={`💡 ${explanation.tip}`}
            source={source}
            suffix="解説 · ヒント"
            className="text-xs text-teal-900"
            onToast={onToast}
          />
        </div>
      )}
    </div>
  );
}
