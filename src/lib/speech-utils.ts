const WORDS_PER_MINUTE = 150;
const BASE_SPEECH_RATE = 0.92;

export const SPEECH_RATES = [0.75, 1, 1.25, 1.5] as const;
export type SpeechRate = (typeof SPEECH_RATES)[number];

export function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function effectiveUtteranceRate(rate: number) {
  return BASE_SPEECH_RATE * rate;
}

export function segmentDurationSec(wordCount: number, rate: number) {
  if (wordCount <= 0) return 0;
  return (wordCount / WORDS_PER_MINUTE) * 60 / rate;
}

export function totalDurationSec(
  paragraphs: Array<{ original: string }>,
  rate: number
) {
  return paragraphs.reduce(
    (sum, p) => sum + segmentDurationSec(countWords(p.original), rate),
    0
  );
}

export function formatTime(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function seekPosition(
  paragraphs: Array<{ original: string }>,
  targetSec: number,
  rate: number
) {
  const clamped = Math.max(0, targetSec);
  let accumulated = 0;

  for (let i = 0; i < paragraphs.length; i += 1) {
    const text = paragraphs[i]?.original ?? "";
    const words = text.trim().split(/\s+/).filter(Boolean);
    const dur = segmentDurationSec(words.length, rate);
    if (accumulated + dur >= clamped || i === paragraphs.length - 1) {
      const intoSeg = Math.max(0, clamped - accumulated);
      const ratio = dur > 0 ? Math.min(1, intoSeg / dur) : 0;
      const wordIndex = Math.min(words.length, Math.floor(ratio * words.length));
      let charOffset = 0;
      if (wordIndex > 0) {
        const prefix = words.slice(0, wordIndex).join(" ");
        const idx = text.indexOf(prefix);
        charOffset = idx >= 0 ? idx : 0;
      }
      return { paragraphIndex: i, charOffset, progressSec: clamped };
    }
    accumulated += dur;
  }

  return { paragraphIndex: 0, charOffset: 0, progressSec: 0 };
}

export function progressToSecond(
  paragraphs: Array<{ original: string }>,
  paragraphIndex: number,
  charOffset: number,
  rate: number
) {
  let sec = 0;
  for (let i = 0; i < paragraphIndex; i += 1) {
    sec += segmentDurationSec(countWords(paragraphs[i]?.original ?? ""), rate);
  }
  const text = paragraphs[paragraphIndex]?.original ?? "";
  const fullWords = countWords(text);
  const partial = text.slice(charOffset).trim();
  const partialWords = countWords(partial);
  const playedWords = Math.max(0, fullWords - partialWords);
  sec += segmentDurationSec(playedWords, rate);
  return sec;
}
