import type { ChoiceOption } from "@/lib/exam-types";

const STOPWORDS = new Set([
  "dass",
  "wenn",
  "weil",
  "aber",
  "oder",
  "und",
  "nicht",
  "noch",
  "schon",
  "sehr",
  "mehr",
  "alle",
  "diese",
  "dieser",
  "dieses",
  "einen",
  "einer",
  "einem",
  "eines",
  "sich",
  "sind",
  "wird",
  "werden",
  "haben",
  "hatte",
  "kann",
  "muss",
  "soll",
  "sollte",
  "wurde",
  "wurden",
  "beim",
  "nach",
  "über",
  "unter",
  "durch",
  "ohne",
  "gegen",
  "einem",
  "einer",
  "eines",
  "einen",
  "eine",
  "einem",
  "dem",
  "den",
  "der",
  "des",
  "das",
  "die",
  "ein",
  "eine",
  "ist",
  "sind",
  "war",
  "waren",
  "nur",
  "auch",
  "schon",
  "mal",
  "wie",
  "aus",
  "bei",
  "mit",
  "von",
  "zum",
  "zur",
  "ins",
  "ans",
  "auf",
  "vor",
  "nach",
  "man",
  "man",
  "ihr",
  "ihre",
  "sein",
  "seine",
  "ihren",
  "bitte",
  "dann",
  "wenn",
  "doch",
  "ganz",
  "etwas",
  "jemand",
  "jemandem",
  "jemanden",
]);

function tokenizeGerman(text: string): string[] {
  const cleaned = text
    .replace(/________/g, " ")
    .replace(/[„“"«»]/g, " ")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ");
  const raw = cleaned.match(/\b[\p{L}][\p{L}-]{2,}\b/gu) ?? [];
  const out: string[] = [];
  for (const w of raw) {
    const lower = w.toLowerCase();
    if (STOPWORDS.has(lower)) continue;
    if (lower.length < 5) continue;
    out.push(w);
  }
  return out;
}

/** NVV 問題：選択肢＋問題文中の語をワンタップ用に並べる */
export function buildNvvQuickTerms(
  prompt: string,
  options: ChoiceOption[],
  correctOptionId: string
): { term: string; kind: "option" | "prompt"; isCorrect?: boolean }[] {
  const seen = new Set<string>();
  const result: { term: string; kind: "option" | "prompt"; isCorrect?: boolean }[] = [];

  const sortedOptions = [...options].sort((a, b) => {
    if (a.id === correctOptionId) return -1;
    if (b.id === correctOptionId) return 1;
    return a.id.localeCompare(b.id);
  });

  for (const opt of sortedOptions) {
    const term = opt.text.trim();
    const key = term.toLowerCase();
    if (!term || seen.has(key)) continue;
    seen.add(key);
    result.push({
      term,
      kind: "option",
      isCorrect: opt.id === correctOptionId,
    });
  }

  for (const w of tokenizeGerman(prompt)) {
    const key = w.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({ term: w, kind: "prompt" });
    if (result.length >= 14) break;
  }

  return result.slice(0, 14);
}
