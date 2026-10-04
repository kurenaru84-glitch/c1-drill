export type LearningLanguage = "en" | "de";

export type ArticleCategory =
  | "business"
  | "culture"
  | "science"
  | "lifestyle"
  | "dialogue"
  | "vlog";

export type ArticleFormat = "article" | "monologue" | "dialogue" | "vlog";

export type StudyNotes = {
  /** 実践チャンク・構文（目安5） */
  chunks: Array<{ phrase: string; meaning: string }>;
  /** 文法・構文パターン（目安5） */
  grammar: Array<{ pattern: string; explanation: string }>;
  /** 語彙・表現（目安10） */
  vocabulary: Array<{ term: string; meaning: string }>;
};

export type ParagraphSeed = {
  original: string;
  translation: string;
  studyNotes: StudyNotes;
};

export type Paragraph = {
  id: string;
  index: number;
  original: string;
  translation: string;
  studyNotes: StudyNotes;
};

export type AudioChunk = {
  id: string;
  index: number;
  label: string;
  startParagraphIndex: number;
  endParagraphIndex: number;
};

export type ReadingDocument = {
  id: string;
  pairId: string;
  language: LearningLanguage;
  title: string;
  titleJa: string;
  category: ArticleCategory;
  format: ArticleFormat;
  paragraphs: Paragraph[];
  chunks: AudioChunk[];
  wordCount: number;
  createdAt: number;
  updatedAt: number;
  lastReadAt?: number;
  lastParagraphIndex?: number;
};

export type ArticlePairSeed = {
  pairId: string;
  titleJa: string;
  category: ArticleCategory;
  format: ArticleFormat;
  en: { title: string; paragraphs: ParagraphSeed[] };
  de: { title: string; paragraphs: ParagraphSeed[] };
};

export type WordListEntry = {
  id: string;
  term: string;
  note: string;
  language: LearningLanguage;
  source: string;
  learned: boolean;
  addedAt: number;
};

export type AppSettings = {
  learningLanguage: LearningLanguage;
  fontSize: "sm" | "md" | "lg";
  speechRate?: 0.75 | 1 | 1.25 | 1.5;
  /** 次へ・続きからで「覚えた」問題を飛ばす */
  skipMasteredWhenReviewing?: boolean;
};

export type AudioCacheEntry = {
  id: string;
  docId: string;
  paragraphIndex: number;
  language: LearningLanguage;
  blob: Blob;
  durationSec?: number;
  createdAt: number;
};
