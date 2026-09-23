#!/usr/bin/env node
/**
 * Regenerate studyNotes via Gemini Interactions API (no placeholders).
 * Usage: GEMINI_API_KEY=... node scripts/regenerate-study-notes.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = path.join(__dirname, "../src/data/articles");
const MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";

const apiKey = process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_API_KEY?.trim();
if (!apiKey) {
  console.error("GEMINI_API_KEY が必要です");
  process.exit(1);
}

function isBadMeaning(text) {
  return (
    text.includes("段落から抽出") ||
    text.includes("段落の重要語") ||
    text.includes("この文の構造・語順に注目")
  );
}

function needsRegen(notes) {
  const all = [...notes.chunks, ...notes.grammar, ...notes.vocabulary];
  return all.some((item) => {
    const m = item.meaning || item.explanation || "";
    return isBadMeaning(m);
  });
}

async function callGemini(prompt) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
      "Api-Revision": "2026-05-20",
    },
    body: JSON.stringify({ model: MODEL, input: prompt }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `API ${res.status}`);
  const parts = [];
  for (const step of data.steps || []) {
    if (step.type !== "model_output") continue;
    for (const c of step.content || []) {
      if (c.type === "text" && c.text) parts.push(c.text);
    }
  }
  return parts.join("\n").trim();
}

async function generateNotes(original, translation, langName) {
  const prompt = `You are creating study notes for a ${langName} language learner (B2-C1). Japanese explanations.

Paragraph:
"""
${original}
"""

Japanese translation:
"""
${translation}
"""

Return ONLY valid JSON (no markdown):
{
  "chunks": [{"phrase": "...", "meaning": "..."}],
  "grammar": [{"pattern": "...", "explanation": "..."}],
  "vocabulary": [{"term": "...", "meaning": "..."}]
}

Rules:
- chunks: 5 practical phrases FROM the paragraph (phrase must appear in paragraph), Japanese meaning
- grammar: 5 grammar/syntax patterns found in paragraph, Japanese explanation
- vocabulary: 10 useful words FROM the paragraph, Japanese meaning
- For short dialogue lines: minimum 3 chunks, 3 grammar, 6 vocabulary
- NEVER use placeholder text like "段落の重要語" or repeat English/German as meaning
- All meanings must be natural Japanese`;

  const raw = await callGemini(prompt);
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("JSON not found in response");
  return JSON.parse(jsonMatch[0]);
}

function parseStudyNotesBlock(block) {
  const chunks = [];
  const chunksMatch = block.match(/chunks:\s*\[([\s\S]*?)\]\s*,/);
  if (chunksMatch) {
    const re = /\{\s*phrase:\s*"((?:\\.|[^"\\])*)"\s*,\s*meaning:\s*"((?:\\.|[^"\\])*)"\s*\}/g;
    let m;
    while ((m = re.exec(chunksMatch[1])) !== null) chunks.push({ phrase: m[1], meaning: m[2] });
  }
  const grammar = [];
  const grammarMatch = block.match(/grammar:\s*\[([\s\S]*?)\]\s*,/);
  if (grammarMatch) {
    const re = /\{\s*pattern:\s*"((?:\\.|[^"\\])*)"\s*,\s*explanation:\s*"((?:\\.|[^"\\])*)"\s*\}/g;
    let m;
    while ((m = re.exec(grammarMatch[1])) !== null) grammar.push({ pattern: m[1], explanation: m[2] });
  }
  const vocabulary = [];
  const vocabMatch = block.match(/vocabulary:\s*\[([\s\S]*?)\]\s*,?\s*\}/);
  if (vocabMatch) {
    const re = /\{\s*term:\s*"((?:\\.|[^"\\])*)"\s*,\s*meaning:\s*"((?:\\.|[^"\\])*)"\s*\}/g;
    let m;
    while ((m = re.exec(vocabMatch[1])) !== null) vocabulary.push({ term: m[1], meaning: m[2] });
  }
  return { chunks, grammar, vocabulary };
}

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function formatStudyNotes(notes) {
  const chunksStr = notes.chunks
    .map((c) => `            { phrase: "${esc(c.phrase)}", meaning: "${esc(c.meaning)}" }`)
    .join(",\n");
  const grammarStr = notes.grammar
    .map((g) => `            { pattern: "${esc(g.pattern)}", explanation: "${esc(g.explanation)}" }`)
    .join(",\n");
  const vocabStr = notes.vocabulary
    .map((v) => `            { term: "${esc(v.term)}", meaning: "${esc(v.meaning)}" }`)
    .join(",\n");
  return `studyNotes: {
          chunks: [
${chunksStr},
          ],
          grammar: [
${grammarStr},
          ],
          vocabulary: [
${vocabStr},
          ],
        }`;
}

function isGerman(text) {
  return /[äöüßÄÖÜ]/.test(text);
}

async function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const paraRe =
    /original:\s*\n\s*"((?:\\.|[^"\\])*)"\s*,\s*\n\s*translation:\s*\n\s*"((?:\\.|[^"\\])*)"\s*,\s*\n\s*(studyNotes:\s*\{[\s\S]*?\n\s*\})/g;

  const matches = [...content.matchAll(paraRe)];
  let updated = 0;

  for (const match of matches) {
    const [full, original, translation, studyBlock] = match;
    const notes = parseStudyNotesBlock(studyBlock);
    if (!needsRegen(notes)) continue;

    const langName = isGerman(original) ? "German" : "English";
    process.stdout.write(`  regenerating (${langName})... `);
    try {
      const generated = await generateNotes(original, translation, langName);
      const expanded = formatStudyNotes(generated);
      content = content.replace(full, `original:\n          "${original}",\n        translation:\n          "${translation}",\n        ${expanded}`);
      updated++;
      console.log("ok");
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.log(`fail: ${err.message}`);
    }
  }

  fs.writeFileSync(filePath, content, "utf8");
  return updated;
}

const files = fs.readdirSync(ARTICLES_DIR).filter((f) => /^article-\d+\.ts$/.test(f)).sort();
let total = 0;
for (const f of files) {
  console.log(f);
  total += await processFile(path.join(ARTICLES_DIR, f));
}
console.log(`Regenerated ${total} paragraphs`);
