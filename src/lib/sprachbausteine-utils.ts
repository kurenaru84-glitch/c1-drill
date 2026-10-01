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

function isGenericGapPrompt(prompt: string): boolean {
  return /^Lücke \d+: Wählen Sie die richtige Lösung\.?$/i.test(prompt.trim());
}

/** 問題画面用：該当 Lücke の前後を含む短い抜粋 */
export function gapContextText(section: ExamSection, gapNumber: number): string {
  const question = section.questions.find((q) => q.number === gapNumber);
  if (question?.prompt && !isGenericGapPrompt(question.prompt)) {
    return question.prompt;
  }

  const paragraphs = section.passage?.paragraphs ?? [];
  for (const paragraph of paragraphs) {
    const text = paragraph.original;
    if (!new RegExp(`\\[${gapNumber}\\]\\s*________`).test(text)) continue;

    const idx = text.search(new RegExp(`\\[${gapNumber}\\]\\s*________`));
    const before = text.slice(0, idx);
    const afterStart = text.slice(idx);
    const sentenceStart = Math.max(
      before.lastIndexOf(". ") + 1,
      before.lastIndexOf("! ") + 1,
      before.lastIndexOf("? ") + 1,
      before.lastIndexOf(", ") + 1,
      0
    );
    let sentenceEnd = afterStart.search(/\.\s|!\s|\?\s/);
    if (sentenceEnd < 0) sentenceEnd = afterStart.length;
    else sentenceEnd += idx + sentenceEnd + 1;

    let snippet = text.slice(sentenceStart, Math.min(text.length, sentenceEnd)).trim();
    if (snippet.length < 80) {
      const pad = 160;
      snippet = text.slice(Math.max(0, idx - pad), Math.min(text.length, idx + pad)).trim();
    }
    if (snippet.length > 420) {
      snippet = `${snippet.slice(0, 420)}…`;
    }
    return snippet;
  }

  return question?.prompt ?? `Lücke ${gapNumber}`;
}

export function collectSprachbausteineVocab(section: ExamSection): VocabItem[] {
  const items: VocabItem[] = [];
  const seen = new Set<string>();
  if (section.wortschatz?.length) {
    for (const v of section.wortschatz) {
      const key = v.term.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      items.push({ term: v.term, meaning: v.meaning });
    }
    return items;
  }
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
