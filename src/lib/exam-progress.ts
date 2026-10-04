"use client";

import type { QuestionAnswer, SectionProgress } from "@/lib/exam-types";

const STORAGE_KEY = "c1-drill-progress";

type ProgressStore = {
  answers: Record<string, QuestionAnswer>;
  /** sectionId:questionId → 覚えた */
  mastered?: Record<string, true>;
};

function loadStore(): ProgressStore {
  if (typeof window === "undefined") return { answers: {}, mastered: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { answers: {}, mastered: {} };
    const parsed = JSON.parse(raw) as ProgressStore;
    return { answers: parsed.answers ?? {}, mastered: parsed.mastered ?? {} };
  } catch {
    return { answers: {}, mastered: {} };
  }
}

function saveStore(store: ProgressStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function getAnswerKey(sectionId: string, questionId: string) {
  return `${sectionId}:${questionId}`;
}

export function getQuestionAnswer(sectionId: string, questionId: string): QuestionAnswer | null {
  const store = loadStore();
  return store.answers[getAnswerKey(sectionId, questionId)] ?? null;
}

export function saveQuestionAnswer(answer: QuestionAnswer) {
  const store = loadStore();
  store.answers[getAnswerKey(answer.sectionId, answer.questionId)] = answer;
  saveStore(store);
}

export function getSectionAnswers(sectionId: string): QuestionAnswer[] {
  const store = loadStore();
  return Object.values(store.answers).filter((a) => a.sectionId === sectionId);
}

export function getSectionProgress(sectionId: string, totalQuestions: number): SectionProgress {
  const answers = getSectionAnswers(sectionId);
  const answered = answers.length;
  const correct = answers.filter((a) => a.correct).length;
  const lastQuestionIndex = Math.min(answered, totalQuestions - 1);
  return { answered, correct, lastQuestionIndex };
}

export function getOverallStats(sectionIds: string[], totals: Record<string, number>) {
  let answered = 0;
  let correct = 0;
  let total = 0;

  for (const id of sectionIds) {
    const progress = getSectionProgress(id, totals[id] ?? 0);
    answered += progress.answered;
    correct += progress.correct;
    total += totals[id] ?? 0;
  }

  return { answered, correct, total };
}

export function isQuestionMastered(sectionId: string, questionId: string): boolean {
  const store = loadStore();
  return !!store.mastered?.[getAnswerKey(sectionId, questionId)];
}

export function setQuestionMastered(sectionId: string, questionId: string, mastered: boolean) {
  const store = loadStore();
  if (!store.mastered) store.mastered = {};
  const key = getAnswerKey(sectionId, questionId);
  if (mastered) store.mastered[key] = true;
  else delete store.mastered[key];
  saveStore(store);
}

export function toggleQuestionMastered(sectionId: string, questionId: string): boolean {
  const next = !isQuestionMastered(sectionId, questionId);
  setQuestionMastered(sectionId, questionId, next);
  return next;
}

export function getSectionMasteredCount(sectionId: string): number {
  const store = loadStore();
  const prefix = `${sectionId}:`;
  return Object.keys(store.mastered ?? {}).filter((k) => k.startsWith(prefix)).length;
}

export function resetSectionProgress(sectionId: string) {
  const store = loadStore();
  for (const key of Object.keys(store.answers)) {
    if (store.answers[key].sectionId === sectionId) {
      delete store.answers[key];
    }
  }
  if (store.mastered) {
    const prefix = `${sectionId}:`;
    for (const key of Object.keys(store.mastered)) {
      if (key.startsWith(prefix)) delete store.mastered[key];
    }
  }
  saveStore(store);
}

export function resetAllProgress() {
  localStorage.removeItem(STORAGE_KEY);
}
