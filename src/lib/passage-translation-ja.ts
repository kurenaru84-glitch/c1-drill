import { fetchTranslation } from "@/lib/fetch-translation";

const STORAGE_PREFIX = "c1-passage-ja:";

export function isPlaceholderPassageTranslation(text: string | undefined): boolean {
  const t = text?.trim() ?? "";
  if (!t) return true;
  return t.includes("日本語訳は準備中") || t === "（日本語訳は準備中）";
}

function readCache(sectionId: string): Record<number, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + sectionId);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    const out: Record<number, string> = {};
    for (const [k, v] of Object.entries(parsed)) {
      const n = Number(k);
      if (!Number.isNaN(n) && v.trim()) out[n] = v;
    }
    return out;
  } catch {
    return {};
  }
}

function writeCache(sectionId: string, map: Record<number, string>) {
  if (typeof window === "undefined") return;
  const serial: Record<string, string> = {};
  for (const [k, v] of Object.entries(map)) {
    serial[String(k)] = v;
  }
  localStorage.setItem(STORAGE_PREFIX + sectionId, JSON.stringify(serial));
}

/** 段落のドイツ語本文 → 日本語訳（localStorage キャッシュ） */
export async function loadPassageParagraphJapanese(
  sectionId: string,
  paragraphIndex: number,
  germanText: string,
  existingTranslation?: string
): Promise<string> {
  const cached = readCache(sectionId);
  if (cached[paragraphIndex]?.trim()) {
    return cached[paragraphIndex];
  }
  if (existingTranslation && !isPlaceholderPassageTranslation(existingTranslation)) {
    const next = { ...cached, [paragraphIndex]: existingTranslation };
    writeCache(sectionId, next);
    return existingTranslation;
  }

  const source = germanText.replace(/«([^»]+)»/g, "$1").trim();
  if (!source) return "";

  const ja = await fetchTranslation(source, "de", "passage");
  const next = { ...cached, [paragraphIndex]: ja };
  writeCache(sectionId, next);
  return ja;
}

export function getCachedPassageTranslations(sectionId: string): Record<number, string> {
  return readCache(sectionId);
}
