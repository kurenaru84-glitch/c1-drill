import type { RichExplanation } from "@/lib/exam-types";

let cache: Record<string, RichExplanation> | null = null;
let loadPromise: Promise<Record<string, RichExplanation>> | null = null;

function isUsableRich(rich: RichExplanation | undefined): rich is RichExplanation {
  return Boolean(rich?.completedSentenceDe?.trim());
}

export async function ensureBundledRichExplanationsLoaded(): Promise<Record<string, RichExplanation>> {
  if (cache) return cache;
  if (!loadPromise) {
    loadPromise = fetch("/rich-explanations.json", { cache: "force-cache" })
      .then(async (res) => (res.ok ? ((await res.json()) as Record<string, RichExplanation>) : {}))
      .then((data) => {
        cache = data;
        return data;
      })
      .catch(() => {
        cache = {};
        return cache;
      });
  }
  return loadPromise;
}

export function getBundledRichExplanation(questionId: string): RichExplanation | null {
  if (!cache) return null;
  const rich = cache[questionId];
  return isUsableRich(rich) ? rich : null;
}

export function bundledRichExplanationCount(): number {
  if (!cache) return 0;
  return Object.keys(cache).filter((id) => isUsableRich(cache![id])).length;
}
