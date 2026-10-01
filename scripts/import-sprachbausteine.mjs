/**
 * Sprachbausteine Deutsch C1 (txt export) → section TS files
 * Usage: node scripts/import-sprachbausteine.mjs "/path/to/Sprachbausteine Deutsch C1 のコピー.txt"
 */
import fs from "fs";
import path from "path";

const sourcePath = process.argv[2];
if (!sourcePath || !fs.existsSync(sourcePath)) {
  console.error("Usage: node scripts/import-sprachbausteine.mjs <path-to-txt>");
  process.exit(1);
}

const raw = fs.readFileSync(sourcePath, "utf8").replace(/\r\n/g, "\n");

function stripCite(s) {
  return s.replace(/\[cite:[^\]]+\]/g, "").replace(/\*\*/g, "").trim();
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function parseOptionsTable(block) {
  const options = new Map();
  const rowRe = /^\|\s*\*?\*?(\d+)\*?\*?\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|/gm;
  let m;
  while ((m = rowRe.exec(block)) !== null) {
    const num = Number(m[1]);
    options.set(num, [
      { id: "a", text: stripCite(m[2]) },
      { id: "b", text: stripCite(m[3]) },
      { id: "c", text: stripCite(m[4]) },
      { id: "d", text: stripCite(m[5]) },
    ]);
  }
  return options;
}

function parseSolutions(block) {
  const sol = new Map();
  const lines = block.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const head = lines[i].match(/^\s*-\s*\*?\*?(\d+):\s*([A-D])\s*\(([^)]*)\)/i)
      || lines[i].match(/^\s*-\s*\*\*(\d+):\s*([A-D])\s*\(([^)]*)\)\*\*/i);
    if (!head) continue;
    const num = Number(head[1]);
    const id = head[2].toLowerCase();
    const answer = stripCite(head[3]);
    let de = "";
    const next = lines[i + 1]?.trim() ?? "";
    const erkl = next.match(/Erklärung:\*?\*?\s*(.+)/i) || next.match(/^\s*-\s*\*?Erklärung:\*?\*?\s*(.+)/i);
    if (erkl) de = stripCite(erkl[1]);
    else if (next.startsWith("-") && next.includes("Erklärung")) {
      de = stripCite(next.replace(/^-\s*/, "").replace(/^\*?Erklärung:\*?\s*/i, ""));
    }
    sol.set(num, { id, answer, de });
  }
  return sol;
}

function parseVocab(block) {
  const vocabulary = [];
  for (const line of block.split("\n")) {
    const m = line.match(/^\*\s+\*?\*?([^*]+)\*?\*?\s*(?:\([^)]*\))?\s*=\s*(.+)$/);
    if (!m) continue;
    vocabulary.push({
      term: stripCite(m[1]),
      meaning: stripCite(m[2]),
    });
  }
  return vocabulary;
}

function cleanAufgabeText(text) {
  return text
    .replace(/\[cite:[^\]]+\]/g, "")
    .replace(/\*\*(\d+)\*\*\s*\[______\]/g, "[$1] ________")
    .trim();
}

function sentenceForGap(fullText, num) {
  const plain = fullText.replace(/\[cite:[^\]]+\]/g, "");
  const gapPat = new RegExp(`\\[${num}\\]\\s*________|\\\\*\\\\*${num}\\\\*\\\\*\\s*\\[______\\]`, "g");
  if (!gapPat.test(plain)) {
    return `Lücke ${num}: Wählen Sie die richtige Lösung.`;
  }
  const normalized = plain.replace(/\*\*(\d+)\*\*\s*\[______\]/g, "[$1] ________");
  const idx = normalized.search(new RegExp(`\\[${num}\\]\\s*________`));
  if (idx < 0) return `Lücke ${num}: Wählen Sie die richtige Lösung.`;

  const before = normalized.slice(0, idx);
  const afterStart = normalized.slice(idx);
  const start = Math.max(
    before.lastIndexOf("\n\n") + 1,
    Math.max(before.lastIndexOf(". "), before.lastIndexOf("! "), before.lastIndexOf("? ")) + 1
  );
  let end = afterStart.search(/\n\n/);
  if (end < 0) end = afterStart.length;
  else end += idx;
  const startAbs = start;
  let sentence = normalized.slice(startAbs, idx + (end < idx ? afterStart.length : end - idx));
  if (sentence.length > 400) {
    sentence = normalized.slice(Math.max(0, idx - 120), idx + 120);
  }
  return sentence.replace(/\s+/g, " ").trim();
}

function buildJaSummary(sol, answerText) {
  const lines = [
    `【正解】${answerText}`,
    "",
    "【解説】",
    sol.de || "文脈・Kollokation・Grammatikから最適な語を選ぶ。",
  ];
  return lines.join("\n");
}

function wrongHints(options, correctId) {
  const wrong = {};
  for (const o of options) {
    if (o.id === correctId) continue;
    wrong[o.id] = `「${o.text}」はこの空所の文脈・文法パターンと合いません。`;
  }
  return wrong;
}

function parseUnits(text) {
  const headers = [];
  const headRe = /^## (\d+)\.\s+(.+)$/gm;
  let hm;
  while ((hm = headRe.exec(text)) !== null) {
    headers.push({ num: Number(hm[1]), title: hm[2].trim(), start: hm.index });
  }
  const units = [];
  for (let i = 0; i < headers.length; i++) {
    const end = i + 1 < headers.length ? headers[i + 1].start : text.length;
    const chunk = text.slice(headers[i].start, end);
    const body = chunk.replace(/^## \d+\.\s+.+\n?/, "");
    units.push({ num: headers[i].num, title: headers[i].title, body });
  }
  return units;
}

const units = parseUnits(raw);

const sections = [];

for (const unit of units) {
  const aufgabeM = unit.body.match(/### A Aufgabe:[^\n]*\n([\s\S]*?)(?=^\| Nr\. \|)/m);
  if (!aufgabeM) {
    console.warn(`Skip ${unit.title}: no Aufgabe`);
    continue;
  }
  const tableM = unit.body.match(/(^\| Nr\. \|[\s\S]*?)(?=^---\s*$)/m);
  const loesungM = unit.body.match(/### L Lösung[\s\S]*?(?=^### W Wortschatz)/m);
  const wortschatzM = unit.body.match(/### W Wortschatz:[^\n]*\n([\s\S]*?)(?=^---\s*$|^## \d+\.|$)/m);

  const aufgabeRaw = aufgabeM[1];
  const aufgabeClean = cleanAufgabeText(aufgabeRaw);
  const optionsByNum = parseOptionsTable(tableM ? tableM[1] : unit.body);
  const solutions = parseSolutions(loesungM ? loesungM[0] : "");
  const vocabulary = wortschatzM ? parseVocab(wortschatzM[1]) : [];

  const paraTexts = aufgabeClean
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith("|"));

  const paragraphs = paraTexts.map((original, i) => ({
    original,
    translation:
      i === 0
        ? "（日本語訳は準備中。空所番号 [1]〜[16] は本文と連動しています。）"
        : "",
    ...(i === paraTexts.length - 1 && vocabulary.length > 0
      ? {
          studyNotes: {
            vocabulary,
          },
        }
      : {}),
  }));

  const questions = [];
  const nums = [...new Set([...optionsByNum.keys(), ...solutions.keys()])].sort((a, b) => a - b);

  for (const n of nums) {
    const opts = optionsByNum.get(n);
    const sol = solutions.get(n);
    if (!opts || !sol) continue;
    const prompt = sentenceForGap(aufgabeClean, n);
    questions.push({
      id: `sb-${unit.num}-q${n}`,
      number: n,
      prompt,
      contextSnippet: prompt,
      options: opts,
      correctOptionId: sol.id,
      explanation: {
        summary: buildJaSummary(sol, sol.answer),
        german: sol.de || undefined,
        wrong: wrongHints(opts, sol.id),
        tip: "Sprachbausteine: 前後の語・固定表現・Konnektorをセットで覚える。",
      },
    });
  }

  if (questions.length === 0) continue;

  const slug = slugify(unit.title);
  const id = `sb-c1-${slug}`;

  sections.push({
    id,
    provider: "sprachbausteine",
    skill: "sprachbausteine",
    partNumber: unit.num,
    title: unit.title,
    titleJa: `Sprachbausteine · ${unit.title}`,
    description: `${questions.length} Lücken · 本文 ${paragraphs.length} 段落`,
    estimatedMinutes: Math.ceil(questions.length * 1.5),
    instruction:
      "Lesen Sie den Text. Wählen Sie für jede Lücke die richtige Lösung (Sprachbausteine C1).",
    passage: {
      title: unit.title,
      subtitle: `Text ${unit.num}`,
      paragraphs,
    },
    questions,
  });
}

const outDir = path.join(process.cwd(), "src/data/sections/sprachbausteine");
fs.mkdirSync(outDir, { recursive: true });

const exports = [];
for (const sec of sections) {
  const varName = sec.id.replace(/-/g, "_");
  const file = path.join(outDir, `${sec.id}.ts`);
  const body = `import type { ExamSection } from "@/lib/exam-types";

export const ${varName}: ExamSection = ${JSON.stringify(sec, null, 2)} as ExamSection;
`;
  fs.writeFileSync(file, body);
  exports.push({ varName, id: sec.id });
  console.log(`Wrote ${sec.id}.ts (${sec.questions.length} gaps, ${sec.passage.paragraphs.length} paragraphs)`);
}

const indexPath = path.join(outDir, "index.ts");
fs.writeFileSync(
  indexPath,
  `${exports.map((e) => `import { ${e.varName} } from "./${e.id}";`).join("\n")}

export const SPRACHBAUSTEINE_SECTIONS = [
${exports.map((e) => `  ${e.varName},`).join("\n")}
];
`
);

console.log(`\nTotal texts: ${sections.length}, gaps: ${sections.reduce((n, s) => n + s.questions.length, 0)}`);
