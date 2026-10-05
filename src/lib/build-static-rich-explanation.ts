import { buildCompletedSentence } from "@/lib/question-completed-sentence";
import type { ExamSkill, Question, RichExplanation, WortschatzEntry } from "@/lib/exam-types";

function pickVocabulary(
  question: Question,
  sectionVocab: WortschatzEntry[] | undefined,
  limit = 8
): Array<{ termDe: string; meaningJa: string }> {
  const fromSection: Array<{ termDe: string; meaningJa: string }> = [];
  const promptLower = question.prompt.toLowerCase();

  for (const entry of sectionVocab ?? []) {
    if (fromSection.length >= limit) break;
    if (promptLower.includes(entry.term.toLowerCase().replace(/\([^)]*\)/g, "").trim())) {
      fromSection.push({ termDe: entry.term, meaningJa: entry.meaning });
    }
  }

  if (fromSection.length >= 3) return fromSection.slice(0, limit);

  const correct = question.options.find((o) => o.id === question.correctOptionId);
  const extras: Array<{ termDe: string; meaningJa: string }> = correct
    ? [{ termDe: correct.text, meaningJa: "正解語" }]
    : [];

  for (const opt of question.options) {
    if (extras.length >= limit) break;
    if (opt.id === question.correctOptionId) continue;
    extras.push({ termDe: opt.text, meaningJa: "選択肢" });
  }

  return [...fromSection, ...extras].slice(0, limit);
}

export function buildStaticRichExplanation(params: {
  question: Question;
  skill: ExamSkill;
  sectionVocab?: WortschatzEntry[];
}): RichExplanation {
  const { question, skill, sectionVocab } = params;
  const correctOption = question.options.find((o) => o.id === question.correctOptionId);
  const correctLabel = correctOption?.text ?? question.correctOptionId;
  const exp = question.explanation;

  const completedSentenceDe = buildCompletedSentence(
    question.prompt,
    correctLabel,
    skill === "sprachbausteine" ? question.number : undefined
  );

  const wrongOptions = question.options
    .filter((o) => o.id !== question.correctOptionId)
    .map((o) => ({
      id: o.id,
      textDe: o.text,
      reasonJa:
        exp.wrong?.[o.id]?.trim() ||
        `この空所・文脈では「${o.text}」は文法・意味・搭配の面で不適切です。`,
    }));

  const mainTitleJa =
    skill === "nvv"
      ? "解説：Nomen-Verb-Verbindung（書籍ベース）"
      : "解説：Sprachbausteine（書籍ベース）";

  const mainParts = [exp.summary?.trim(), exp.german?.trim()].filter(Boolean);
  const mainBodyJa = mainParts.join("\n\n") || "書籍解説を参照してください。";

  const grammarPoints = exp.tip?.trim()
    ? [{ titleJa: "学習のヒント", bodyJa: exp.tip.trim() }]
    : [];

  return {
    correctAnswerLineJa: `正解は ${question.correctOptionId.toUpperCase()}: ${correctLabel} です。`,
    completedSentenceDe,
    translationJa: question.promptJa?.trim() || "（日本語訳は問題文の promptJa を参照）",
    mainTitleJa,
    mainBodyJa,
    wrongOptions,
    grammarPoints,
    vocabulary: pickVocabulary(question, sectionVocab),
    _meta: { tier: "static", generatedAt: new Date().toISOString() },
  };
}
