import type { AudioChunk, Paragraph } from "@/lib/types";

const TARGET_WORDS_PER_CHUNK = 160;

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function buildAudioChunks(paragraphs: Paragraph[]): AudioChunk[] {
  const chunks: AudioChunk[] = [];
  let start = 0;
  let words = 0;
  let chunkIndex = 0;

  for (let i = 0; i < paragraphs.length; i += 1) {
    words += countWords(paragraphs[i]?.original ?? "");
    const isLast = i === paragraphs.length - 1;
    if (words >= TARGET_WORDS_PER_CHUNK || isLast) {
      chunks.push({
        id: `chunk-${chunkIndex}`,
        index: chunkIndex,
        label: `${chunkIndex}:00`,
        startParagraphIndex: start,
        endParagraphIndex: i,
      });
      chunkIndex += 1;
      start = i + 1;
      words = 0;
    }
  }

  return chunks;
}

export function paragraphsText(paragraphs: Paragraph[], start: number, end: number) {
  return paragraphs
    .slice(start, end + 1)
    .map((p) => p.original)
    .join("\n\n");
}
