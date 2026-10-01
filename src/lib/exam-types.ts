import type { StudyNotes } from "@/lib/types";

export type ExamProvider = "goethe" | "telc" | "schmidt" | "sprachbausteine";

export type ExamSkill = "lesen" | "horen" | "sprachbausteine" | "schreiben" | "nvv";

export type ChoiceOption = {
  id: string;
  text: string;
};

export type QuestionExplanation = {
  summary: string;
  /** 書籍のドイツ語解説（原文） */
  german?: string;
  wrong?: Record<string, string>;
  tip?: string;
};

export type Question = {
  id: string;
  number: number;
  prompt: string;
  /** 問題文の日本語訳（任意） */
  promptJa?: string;
  options: ChoiceOption[];
  correctOptionId: string;
  explanation: QuestionExplanation;
  contextSnippet?: string;
};

export type PassageParagraph = {
  original: string;
  translation: string;
  studyNotes?: StudyNotes;
};

export type Passage = {
  title: string;
  subtitle?: string;
  paragraphs: PassageParagraph[];
};

export type Transcript = {
  paragraphs: PassageParagraph[];
};

export type WortschatzEntry = {
  term: string;
  meaning: string;
};

export type ExamSection = {
  id: string;
  provider: ExamProvider;
  skill: ExamSkill;
  partNumber: number;
  title: string;
  titleJa: string;
  description: string;
  estimatedMinutes: number;
  instruction: string;
  passage?: Passage;
  transcript?: Transcript;
  /** Sprachbausteine: 書籍の Wortschatz 一覧 */
  wortschatz?: WortschatzEntry[];
  questions: Question[];
};

export type SectionProgress = {
  answered: number;
  correct: number;
  lastQuestionIndex: number;
};

export type QuestionAnswer = {
  sectionId: string;
  questionId: string;
  selectedOptionId: string;
  correct: boolean;
  answeredAt: number;
};
