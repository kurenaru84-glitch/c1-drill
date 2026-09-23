import Dexie, { type Table } from "dexie";
import { buildAudioChunks } from "@/lib/chunks";
import { normalizeStudyNotes } from "@/lib/study-notes";
import type {
  ArticlePairSeed,
  AudioCacheEntry,
  LearningLanguage,
  ReadingDocument,
} from "@/lib/types";

const SEED_VERSION = 5;
const SEED_VERSION_KEY = "read-along-seed-version";

const EMPTY_NOTES = normalizeStudyNotes({ chunks: [], grammar: [], vocabulary: [] });

class ReadAlongDB extends Dexie {
  documents!: Table<ReadingDocument, string>;
  audioCache!: Table<AudioCacheEntry, string>;

  constructor() {
    super("read-along");
    this.version(1).stores({
      documents: "id, pairId, language, updatedAt, lastReadAt",
    });
    this.version(2).stores({
      documents: "id, pairId, language, updatedAt, lastReadAt",
    });
    this.version(3).stores({
      documents: "id, pairId, language, updatedAt, lastReadAt",
      audioCache: "id, docId, paragraphIndex, language, createdAt",
    });
  }
}

export const db = new ReadAlongDB();

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function seedToDocument(
  seed: ArticlePairSeed,
  language: LearningLanguage
): ReadingDocument {
  const localized = language === "en" ? seed.en : seed.de;
  const paragraphs = localized.paragraphs.map((p, index) => ({
    id: `${seed.pairId}-${language}-p${index}`,
    index,
    original: p.original,
    translation: p.translation,
    studyNotes: normalizeStudyNotes(p.studyNotes ?? EMPTY_NOTES),
  }));
  const now = Date.now();

  return {
    id: `${seed.pairId}-${language}`,
    pairId: seed.pairId,
    language,
    title: localized.title,
    titleJa: seed.titleJa,
    category: seed.category,
    format: seed.format,
    paragraphs,
    chunks: buildAudioChunks(paragraphs),
    wordCount: countWords(localized.paragraphs.map((p) => p.original).join(" ")),
    createdAt: now,
    updatedAt: now,
  };
}

function readSeedVersion() {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(SEED_VERSION_KEY) ?? "0");
}

function writeSeedVersion() {
  if (typeof window === "undefined") return;
  localStorage.setItem(SEED_VERSION_KEY, String(SEED_VERSION));
}

export async function seedDocuments(pairs: ArticlePairSeed[]) {
  const storedVersion = readSeedVersion();
  const count = await db.documents.count();
  if (count > 0 && storedVersion >= SEED_VERSION) return;

  await db.documents.clear();
  const docs = pairs.flatMap((pair) => [
    seedToDocument(pair, "en"),
    seedToDocument(pair, "de"),
  ]);
  await db.documents.bulkAdd(docs);
  writeSeedVersion();
}

export async function listDocuments(language?: LearningLanguage) {
  const docs = language
    ? await db.documents.where("language").equals(language).toArray()
    : await db.documents.toArray();
  return docs.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getDocument(id: string) {
  return db.documents.get(id);
}

export async function getDocumentByPair(pairId: string, language: LearningLanguage) {
  return db.documents.get(`${pairId}-${language}`);
}

export async function updateReadingProgress(id: string, paragraphIndex: number) {
  const doc = await db.documents.get(id);
  if (!doc) return;
  await db.documents.update(id, {
    lastParagraphIndex: paragraphIndex,
    lastReadAt: Date.now(),
    updatedAt: Date.now(),
  });
}

export async function exportAllData() {
  const documents = await db.documents.toArray();
  return { documents, exportedAt: new Date().toISOString() };
}
