import {
  getQuestionAnswer,
  isQuestionMastered,
} from "@/lib/exam-progress";
import type { ExamSection } from "@/lib/exam-types";
import { getSettings } from "@/lib/settings";

export function shouldSkipMasteredWhenReviewing(): boolean {
  return getSettings().skipMasteredWhenReviewing !== false;
}

/** 続きから / エピソード開始用（未回答かつ未マスターを優先） */
export function getReviewStartIndex(section: ExamSection): number {
  const skip = shouldSkipMasteredWhenReviewing();

  for (let i = 0; i < section.questions.length; i++) {
    const q = section.questions[i];
    if (skip && isQuestionMastered(section.id, q.id)) continue;
    if (!getQuestionAnswer(section.id, q.id)) return i;
  }

  for (let i = 0; i < section.questions.length; i++) {
    const q = section.questions[i];
    if (!skip || !isQuestionMastered(section.id, q.id)) return i;
  }

  return 0;
}

export function getAdjacentQuestionIndex(
  section: ExamSection,
  fromIndex: number,
  direction: -1 | 1
): number | null {
  const skip = shouldSkipMasteredWhenReviewing();
  let i = fromIndex + direction;

  while (i >= 0 && i < section.questions.length) {
    const q = section.questions[i];
    if (!skip || !isQuestionMastered(section.id, q.id)) {
      return i;
    }
    i += direction;
  }

  return null;
}
