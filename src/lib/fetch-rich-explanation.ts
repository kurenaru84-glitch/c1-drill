import type { RichExplanation } from "@/lib/exam-types";
import type { ExamSkill, Question } from "@/lib/exam-types";

const STORAGE_PREFIX = "c1-rich-explain:";

function readCache(questionId: string): RichExplanation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + questionId);
    if (!raw) return null;
    return JSON.parse(raw) as RichExplanation;
  } catch {
    return null;
  }
}

function writeCache(questionId: string, rich: RichExplanation) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_PREFIX + questionId, JSON.stringify(rich));
}

export function getCachedRichExplanation(questionId: string): RichExplanation | null {
  return readCache(questionId);
}

export async function fetchRichExplanation(params: {
  questionId: string;
  skill: ExamSkill;
  sectionTitle: string;
  question: Question;
}): Promise<RichExplanation> {
  const cached = readCache(params.questionId);
  if (cached?.completedSentenceDe?.trim()) {
    return cached;
  }

  const res = await fetch("/api/explain-question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      questionId: params.questionId,
      skill: params.skill,
      sectionTitle: params.sectionTitle,
      prompt: params.question.prompt,
      gapNumber: params.question.number,
      options: params.question.options,
      correctOptionId: params.question.correctOptionId,
      bookGerman: params.question.explanation.german,
      bookSummary: params.question.explanation.summary,
    }),
  });

  const data = (await res.json()) as { rich?: RichExplanation; error?: string };
  if (!res.ok || !data.rich) {
    throw new Error(data.error ?? "詳細解説の取得に失敗しました。");
  }

  writeCache(params.questionId, data.rich);
  return data.rich;
}
