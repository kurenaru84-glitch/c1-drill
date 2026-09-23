import type { LearningLanguage } from "@/lib/types";

export type LanguageDef = {
  id: LearningLanguage;
  label: string;
  speechId: string;
};

export const LANGUAGES: Record<LearningLanguage, LanguageDef> = {
  en: { id: "en", label: "English", speechId: "en-US" },
  de: { id: "de", label: "Deutsch", speechId: "de-DE" },
};

export const CATEGORY_LABELS: Record<string, string> = {
  business: "ビジネス",
  culture: "文化",
  science: "科学",
  lifestyle: "ライフスタイル",
  dialogue: "会話",
  vlog: "Vlog",
};

export const FORMAT_LABELS: Record<string, string> = {
  article: "記事",
  monologue: "独白",
  dialogue: "対話",
  vlog: "Vlog",
};

export function getLanguage(id: LearningLanguage): LanguageDef {
  return LANGUAGES[id];
}
