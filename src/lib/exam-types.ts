export type ExamProvider = "goethe" | "telc";

export type ExamSkill = "lesen" | "horen" | "sprachbausteine" | "schreiben";

export type ChoiceOption = {
  id: string;
  text: string;
};

export type QuestionExplanation = {
  summary: string;
  wrong?: Record<string, string>;
  tip?: string;
};

export type Question = {
  id: string;
  number: number;
  prompt: string;
  options: ChoiceOption[];
  correctOptionId: string;
  explanation: QuestionExplanation;
  contextSnippet?: string;
};

export type Passage = {
  title: string;
  subtitle?: string;
  body: string;
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
  transcript?: string;
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
