import type { ExamSection, Passage } from "@/lib/exam-types";

const GAP_RE = /\[(\d+)\]\s*________/g;

export type GapTextPart =
  | { kind: "text"; value: string }
  | { kind: "gap"; number: number };

/** 本文を通常テキストと [N] ________ 空所に分割 */
export function splitPassageGaps(text: string): GapTextPart[] {
  const parts: GapTextPart[] = [];
  let last = 0;
  const re = new RegExp(GAP_RE.source, "g");
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ kind: "text", value: text.slice(last, match.index) });
    }
    parts.push({ kind: "gap", number: Number(match[1]) });
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    parts.push({ kind: "text", value: text.slice(last) });
  }
  return parts;
}

export function paragraphIndexForGap(section: ExamSection, gapNumber: number): number {
  const paragraphs = section.passage?.paragraphs ?? [];
  for (let i = 0; i < paragraphs.length; i++) {
    if (new RegExp(`\\[${gapNumber}\\]\\s*________`).test(paragraphs[i].original)) {
      return i;
    }
  }
  return 0;
}

export function getCorrectAnswerText(section: ExamSection, gapNumber: number): string {
  const q = section.questions.find((x) => x.number === gapNumber);
  if (!q) return "";
  return q.options.find((o) => o.id === q.correctOptionId)?.text ?? "";
}

/** 本文の [N] ________ を正解語で埋める */
export function fillGapMarkers(text: string, section: ExamSection): string {
  return text.replace(/\[(\d+)\]\s*________/g, (_, raw) => {
    const n = Number(raw);
    const answer = getCorrectAnswerText(section, n);
    return answer ? `«${answer}»` : `[${n}] ________`;
  });
}

export function buildFilledPassage(section: ExamSection): Passage | undefined {
  if (!section.passage) return undefined;
  return {
    ...section.passage,
    subtitle: section.passage.subtitle ?? "解答入り全文",
    paragraphs: section.passage.paragraphs.map((p) => ({
      ...p,
      original: fillGapMarkers(p.original, section),
      translation: p.translation || "（日本語訳は準備中）",
    })),
  };
}

export type VocabItem = { term: string; meaning: string };

export function collectSprachbausteineVocab(section: ExamSection): VocabItem[] {
  const items: VocabItem[] = [];
  const seen = new Set<string>();
  for (const p of section.passage?.paragraphs ?? []) {
    const vocab = p.studyNotes?.vocabulary ?? [];
    for (const v of vocab) {
      const key = v.term.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      items.push({ term: v.term, meaning: v.meaning });
    }
  }
  return items;
}
