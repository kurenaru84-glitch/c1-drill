import type { ExamProvider, ExamSection } from "@/lib/exam-types";
import { goetheHoeren2 } from "./goethe-hoeren-2";
import { goetheLesen1 } from "./goethe-lesen-1";
import { goetheLesen2 } from "./goethe-lesen-2";
import { telcLesen1 } from "./telc-lesen-1";

export const ALL_SECTIONS: ExamSection[] = [
  goetheLesen1,
  goetheLesen2,
  goetheHoeren2,
  telcLesen1,
];

export const SECTIONS_BY_ID: Record<string, ExamSection> = Object.fromEntries(
  ALL_SECTIONS.map((s) => [s.id, s])
);

export function getSection(id: string): ExamSection | undefined {
  return SECTIONS_BY_ID[id];
}

export function getSectionsByProvider(provider: ExamProvider): ExamSection[] {
  return ALL_SECTIONS.filter((s) => s.provider === provider);
}

export const SECTION_TOTALS: Record<string, number> = Object.fromEntries(
  ALL_SECTIONS.map((s) => [s.id, s.questions.length])
);

export const PROVIDER_LABELS: Record<ExamProvider, string> = {
  goethe: "Goethe C1",
  telc: "telc C1",
};

export const SKILL_LABELS: Record<string, string> = {
  lesen: "Lesen",
  horen: "Hören",
  sprachbausteine: "Sprachbausteine",
  schreiben: "Schreiben",
};
