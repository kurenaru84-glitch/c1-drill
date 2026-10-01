import { fetchTranslation } from "@/lib/fetch-translation";
import type { VocabItem } from "@/lib/sprachbausteine-utils";

const STORAGE_PREFIX = "c1-sb-vocab-ja:";

function readCache(sectionId: string): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + sectionId);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeCache(sectionId: string, map: Record<string, string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_PREFIX + sectionId, JSON.stringify(map));
}

/** 書籍のドイツ語説明 → 日本語（localStorage キャッシュ） */
export async function loadVocabJapanese(
  sectionId: string,
  items: VocabItem[],
  onProgress?: (map: Record<string, string>) => void
): Promise<Record<string, string>> {
  const result = { ...readCache(sectionId) };
  onProgress?.(result);

  const missing = items.filter((item) => !result[item.term]?.trim());
  for (const item of missing) {
    const source = item.meaning.trim().slice(0, 280);
    if (!source) continue;
    try {
      const ja = await fetchTranslation(source, "de");
      result[item.term] = ja;
    } catch {
      result[item.term] = "";
    }
    writeCache(sectionId, result);
    onProgress?.({ ...result });
  }

  return result;
}
