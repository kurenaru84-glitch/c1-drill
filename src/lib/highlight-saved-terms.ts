export type TextSegment = {
  text: string;
  saved: boolean;
};

/** 単語リスト登録済みの語を本文中でハイライト用に分割（長い語を優先） */
export function buildSavedTermSegments(text: string, terms: string[]): TextSegment[] {
  if (!text || terms.length === 0) {
    return [{ text, saved: false }];
  }

  const sorted = [...terms]
    .map((t) => t.trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  const lower = text.toLowerCase();
  const spans: Array<{ start: number; end: number }> = [];

  for (const term of sorted) {
    const needle = term.toLowerCase();
    let from = 0;
    while (from < lower.length) {
      const idx = lower.indexOf(needle, from);
      if (idx < 0) break;
      const end = idx + term.length;
      const overlaps = spans.some((s) => !(end <= s.start || idx >= s.end));
      if (!overlaps) {
        spans.push({ start: idx, end });
      }
      from = idx + 1;
    }
  }

  if (spans.length === 0) {
    return [{ text, saved: false }];
  }

  spans.sort((a, b) => a.start - b.start);
  const out: TextSegment[] = [];
  let cursor = 0;
  for (const span of spans) {
    if (span.start > cursor) {
      out.push({ text: text.slice(cursor, span.start), saved: false });
    }
    out.push({ text: text.slice(span.start, span.end), saved: true });
    cursor = span.end;
  }
  if (cursor < text.length) {
    out.push({ text: text.slice(cursor), saved: false });
  }
  return out;
}
