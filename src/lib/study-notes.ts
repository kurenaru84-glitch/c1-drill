import type { StudyNotes } from "@/lib/types";

type LegacyStudyNotes = {
  chunks?: Array<{ phrase: string; meaning: string }>;
  grammar?: string | Array<{ pattern: string; explanation: string }>;
  vocabulary?: Array<{ term: string; meaning: string }>;
};

export function normalizeStudyNotes(raw: LegacyStudyNotes | StudyNotes): StudyNotes {
  const grammarRaw = raw.grammar;
  let grammar: StudyNotes["grammar"] = [];
  if (Array.isArray(grammarRaw)) {
    grammar = grammarRaw;
  } else if (typeof grammarRaw === "string" && grammarRaw.trim()) {
    grammar = [{ pattern: "構文", explanation: grammarRaw.trim() }];
  }

  return {
    chunks: raw.chunks ?? [],
    grammar,
    vocabulary: raw.vocabulary ?? [],
  };
}
