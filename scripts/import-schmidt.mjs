/**
 * Parse "Deutsch mit Schmidt" NVV text export → section TS files.
 * Usage: node scripts/import-schmidt.mjs "/path/to/Deutsch mit Schmidttxt"
 */
import fs from "fs";
import path from "path";
import { SCHMIDT_L1_JA } from "./schmidt-l1-ja.mjs";
import { SCHMIDT_PROMPT_JA } from "./schmidt-prompt-ja.mjs";
import { meaningJaFromDe, defaultWrongHints } from "./schmidt-ja-auto.mjs";

const sourcePath = process.argv[2];
if (!sourcePath || !fs.existsSync(sourcePath)) {
  console.error("Usage: node scripts/import-schmidt.mjs <path-to-txt>");
  process.exit(1);
}

const raw = fs.readFileSync(sourcePath, "utf8");
const lines = raw.split(/\r?\n/);

/** Quiz Lektion 1 — not in plain-text export; keys from book (NVV review). */
const QUIZ_L1_ANSWERS = {
  21: { id: "b", nvv: "aus dem Ruder gelaufen", de: "etwas ist (völlig) aus dem Ruder gelaufen" },
  22: { id: "b", nvv: "durch den Kopf gehen lassen", de: "sich etwas durch den Kopf gehen lassen" },
  23: { id: "a", nvv: "sich aus dem Staub machen", de: "sich aus dem Staub machen" },
  24: { id: "b", nvv: "in Kraft treten", de: "etwas tritt in Kraft" },
  25: { id: "a", nvv: "in Anspruch nehmen", de: "etwas nimmt Zeit in Anspruch" },
  26: { id: "b", nvv: "das Handwerk legen", de: "jemandem das Handwerk legen" },
  27: { id: "a", nvv: "ins Wasser fallen", de: "etwas fällt ins Wasser" },
  28: { id: "a", nvv: "einstellen", de: "Arbeiten einstellen" },
  29: { id: "a", nvv: "Anzeige erstatten", de: "Anzeige erstatten" },
  30: { id: "a", nvv: "unter die Arme greifen", de: "jemandem unter die Arme greifen" },
  31: { id: "b", nvv: "nur Bahnhof verstehen", de: "nur Bahnhof verstehen" },
  32: { id: "b", nvv: "zur Abstimmung bringen", de: "etwas zur Abstimmung bringen" },
  33: { id: "b", nvv: "Himmel und Hölle in Bewegung setzen", de: "Himmel und Hölle in Bewegung setzen" },
  34: { id: "a", nvv: "Willen durchsetzen", de: "seinen Willen durchsetzen" },
  35: { id: "a", nvv: "Ruhe bewahren", de: "Ruhe bewahren" },
  36: { id: "b", nvv: "ins Auge fassen", de: "etwas ins Auge fassen" },
  37: { id: "a", nvv: "im Stich lassen", de: "jemanden im Stich lassen" },
  38: { id: "b", nvv: "einen Korb bekommen", de: "einen Korb bekommen" },
  39: { id: "a", nvv: "auf der Hand liegen", de: "etwas liegt auf der Hand" },
  40: { id: "b", nvv: "Abmachung treffen", de: "eine Abmachung treffen" },
};

const solutions = new Map();

function parsePlainSolutions(startIdx) {
  let i = startIdx;
  while (i < lines.length) {
    const m = lines[i].match(/^(\d+):\s*([A-D])\s*\(([^)]*)\)\s*$/);
    if (m) {
      const num = Number(m[1]);
      const id = m[2].toLowerCase();
      const nvv = m[3].trim();
      i++;
      const deLines = [];
      while (i < lines.length && !lines[i].match(/^\d+:\s*[A-D]/)) {
        const t = lines[i].trim();
        if (!t) {
          i++;
          if (deLines.length > 0) break;
          continue;
        }
        if (lines[i].startsWith("Quiz-") || lines[i].startsWith("LEKTION") || lines[i].startsWith("#")) break;
        deLines.push(t);
        i++;
      }
      solutions.set(num, { id, nvv, de: deLines.join(" ") });
      continue;
    }
    if (lines[i].match(/^Quiz-Teil:|^LEKTION|^# LEKTION/)) break;
    i++;
  }
}

function parseMarkdownSolutions() {
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s*-\s*\*\*(\d+):\s*([A-D])\s*\(([^)]*)\)\*\*/);
    if (m) {
      const num = Number(m[1]);
      const id = m[2].toLowerCase();
      const nvv = m[3].trim();
      let de = "";
      if (lines[i + 1]?.includes("**") && lines[i + 1].includes("=")) {
        de = lines[i + 1].replace(/\[cite:[^\]]+\]/g, "").replace(/\*\*/g, "").trim();
        if (de.startsWith("-")) de = de.slice(1).trim();
      }
      if (!solutions.has(num) || de) solutions.set(num, { id, nvv, de });
    }
    const m2 = lines[i].match(/^\s*-\s*\*\*(\d+):\s*([A-D])\s*\(([^)]*)\)\*\*\[cite/);
    if (m2) {
      const num = Number(m2[1]);
      solutions.set(num, {
        id: m2[2].toLowerCase(),
        nvv: m2[3].trim(),
        de: solutions.get(num)?.de ?? "",
      });
    }
  }
}

function stripCite(s) {
  return s.replace(/\[cite:[^\]]+\]/g, "").trim();
}

function parsePlainQuestions(startIdx, endMarker) {
  const questions = [];
  let i = startIdx;
  while (i < lines.length) {
    if (lines[i].includes(endMarker) || lines[i].match(/^LEKTION|^# LEKTION/)) break;
    const numM = lines[i].match(/^(\d+)\s*$/);
    if (!numM) {
      i++;
      continue;
    }
    const num = Number(numM[1]);
    i++;
    const promptLines = [];
    const options = [];
    while (i < lines.length) {
      const opt = lines[i].match(/^([A-D])\)\s*(.+)$/);
      if (opt) {
        options.push({ id: opt[1].toLowerCase(), text: opt[2].trim() });
        i++;
        continue;
      }
      if (lines[i].match(/^\d+\s*$/) || lines[i].includes("Lektionsteil:") || lines[i].includes("Quiz-Teil:"))
        break;
      if (lines[i].trim()) promptLines.push(lines[i].trim());
      i++;
    }
    if (options.length > 0) {
      questions.push({ number: num, prompt: promptLines.join(" "), options });
    }
  }
  return questions;
}

function parseMarkdownQuestions() {
  const questions = [];
  let i = 0;
  while (i < lines.length) {
    const head = lines[i].match(/^####\s*(\d+)\s*$/);
    if (!head) {
      i++;
      continue;
    }
    const num = Number(head[1]);
    i++;
    const promptLines = [];
    const options = [];
    while (i < lines.length && !lines[i].match(/^####\s*\d+/)) {
      const boldOpt = lines[i].match(/^-\s*\*\*([A-D])\)\s*(.+?)\*\*/);
      const plainOpt = lines[i].match(/^-\s*([A-D])\)\s*(.+)$/);
      if (boldOpt) {
        const id = boldOpt[1].toLowerCase();
        const text = stripCite(boldOpt[2]);
        options.push({ id, text });
        if (!solutions.has(num)) {
          solutions.set(num, { id, nvv: text, de: "" });
        }
      } else if (plainOpt) {
        options.push({ id: plainOpt[1].toLowerCase(), text: stripCite(plainOpt[2]) });
      } else if (lines[i].trim() && !lines[i].startsWith("---") && !lines[i].startsWith("###")) {
        promptLines.push(stripCite(lines[i]));
      }
      i++;
    }
    if (options.length > 0 && promptLines.length > 0) {
      questions.push({ number: num, prompt: promptLines.join(" "), options });
    }
  }
  return questions;
}

// Plain Lektion 1
const l1SolIdx = lines.findIndex((l) => l.startsWith("Lektionsteil: Lösungen & Erklärungen"));
const l1QStart = lines.findIndex((l) => l.includes("Lektionsteil: Aufgaben (Fragen 1"));
parsePlainSolutions(l1SolIdx + 1);
const plainQ1 = parsePlainQuestions(l1QStart + 1, "Lektionsteil: Lösungen");
const quizStart = lines.findIndex((l) => l.includes("Quiz-Teil: Aufgaben (Fragen 21"));
const plainQuiz1 = parsePlainQuestions(quizStart + 1, "LEKTION 2");

const l2QIdx = lines.findIndex((l) => l.includes("Lektionsteil: Aufgaben (Fragen 41"));
const l2SolIdx = lines.findIndex(
  (l, idx) => idx > l2QIdx && l.startsWith("Lektionsteil: Lösungen & Erklärungen")
);
const plainQ2Head = l2QIdx >= 0 ? parsePlainQuestions(l2QIdx + 1, "Lektionsteil: Lösungen") : [];
if (l2SolIdx >= 0) parsePlainSolutions(l2SolIdx + 1);

for (const [num, ans] of Object.entries(QUIZ_L1_ANSWERS)) {
  solutions.set(Number(num), ans);
}

parseMarkdownSolutions();
const mdQuestions = parseMarkdownQuestions();

function parseOverviewPhrases() {
  const byNum = new Map();
  for (const line of lines) {
    const m = line.match(/^\s*-\s*\*\*(\d+)\*\*\s+(.+?)\s*$/);
    if (m) byNum.set(Number(m[1]), stripCite(m[2]).replace(/\*\*/g, "").trim());
  }
  return byNum;
}

const overviewPhrase = parseOverviewPhrases();

function backfillGermanExplanations() {
  const deByNvv = new Map();
  for (const [, sol] of solutions) {
    if (!sol.de || !sol.nvv) continue;
    const key = sol.nvv.toLowerCase().replace(/\s+/g, " ").trim();
    if (!deByNvv.has(key)) deByNvv.set(key, sol.de);
  }
  for (const [num, sol] of solutions) {
    if (sol.de) continue;
    const fromOverview = overviewPhrase.get(num);
    if (fromOverview) {
      solutions.set(num, { ...sol, de: fromOverview });
      continue;
    }
    const key = (sol.nvv ?? "").toLowerCase().trim();
    if (!key) continue;
    for (const [k, de] of deByNvv) {
      if (k.includes(key) || key.includes(k) || k.split(" ")[0] === key.split(" ")[0]) {
        solutions.set(num, { ...sol, de });
        break;
      }
    }
  }
}

backfillGermanExplanations();

const allQuestions = new Map();
for (const q of [...plainQ1, ...plainQuiz1, ...plainQ2Head, ...mdQuestions]) {
  allQuestions.set(q.number, q);
}

function promptJaFor(num) {
  return SCHMIDT_L1_JA[num]?.promptJa ?? SCHMIDT_PROMPT_JA[num];
}

function stripMdBold(s) {
  return s.replace(/\*\*([^*]+)\*\*/g, "「$1」");
}

function buildJaSummary(num, sol, prompt) {
  const nvv = sol?.nvv ?? "";
  const de = sol?.de ?? "";
  const rich = SCHMIDT_L1_JA[num];
  const meaning = rich?.meaningJa
    ? stripMdBold(rich.meaningJa)
    : meaningJaFromDe(de, nvv, num) || jaHintFor(nvv, de, prompt);
  const linesJa = [
    `【正解のコロケーション】${nvv || "（書籍解説を参照）"}`,
    "",
    "【解説】",
    meaning,
    "",
  ];
  if (de) {
    linesJa.push("【ドイツ語の言い換え（書籍）】", de);
  }
  return linesJa.join("\n");
}

function mergeWrongHints(num, options, correctId, sol, prompt) {
  const rich = SCHMIDT_L1_JA[num];
  const wrong = rich?.wrong
    ? wrongHints(options, correctId)
    : defaultWrongHints(options, correctId, sol?.nvv ?? "", prompt);
  if (!rich?.wrong) return wrong;
  for (const o of options) {
    if (o.id === correctId) continue;
    if (rich.wrong[o.id]) wrong[o.id] = rich.wrong[o.id];
  }
  return wrong;
}

function jaHintFor(nvv, de, prompt) {
  const lower = `${nvv} ${de} ${prompt}`.toLowerCase();
  if (lower.includes("anspruch")) return "時間・労力を「要求する」＝ in Anspruch nehmen / Zeit in Anspruch nehmen。";
  if (lower.includes("bahnhof")) return "全く理解できない＝ nur Bahnhof verstehen（直訳：駅しか分からない）。";
  if (lower.includes("ruder")) return "手に負えなくなる＝ aus dem Ruder laufen。";
  if (lower.includes("kraft")) return "（法律などが）施行される＝ in Kraft treten。";
  if (lower.includes("staub")) return "急いで立ち去る＝ sich aus dem Staub machen。";
  if (lower.includes("handwerk")) return "（犯罪などを）やめさせる＝ jdm. das Handwerk legen。";
  if (lower.includes("stich")) return "見捨てる＝ jdn. im Stich lassen。";
  if (lower.includes("korb")) return "断る・振る＝ jdm. einen Korb geben。";
  if (lower.includes("pfeife")) return "言いなりになる＝ nach jds. Pfeife tanzen。";
  if (lower.includes("herz") && lower.includes("zunge")) return "思ったことをストレートに言う＝ sein Herz auf der Zunge tragen。";
  if (lower.includes("ohr") && lower.includes("hauen")) return "だます＝ jdn. übers Ohr hauen。";
  if (de) return "文脈に合う慣用句（NVV）を選ぶ。空所前後の動詞・前置詞とセットで覚える。";
  return "Nomen-Verb-Verbindung：名詞と動詞の決まった組み合わせ。空所の前後をひとまとまりで暗記する。";
}

function wrongHints(options, correctId) {
  const wrong = {};
  for (const o of options) {
    if (o.id === correctId) continue;
    wrong[o.id] = `「${o.text}」はこのコロケーションと結びつきません。慣用句全体を思い出してください。`;
  }
  return wrong;
}

function sectionForRange(lektion, kind, from, to, questions) {
  const qs = [];
  for (let n = from; n <= to; n++) {
    const q = questions.get(n);
    if (!q) continue;
    const sol = solutions.get(n);
    if (!sol && !q.options.some((o) => o.id)) continue;
    let correctId = sol?.id;
    if (!correctId) {
      const marked = solutions.get(n);
      correctId = marked?.id;
    }
    if (!correctId) continue;
    const promptJa = promptJaFor(n);
    qs.push({
      id: `schmidt-q${n}`,
      number: n,
      prompt: q.prompt,
      ...(promptJa ? { promptJa } : {}),
      options: q.options,
      correctOptionId: correctId,
      explanation: {
        summary: buildJaSummary(n, sol, q.prompt),
        ...(sol?.de ? { german: sol.de } : {}),
        wrong: mergeWrongHints(n, q.options, correctId, sol, q.prompt),
        tip: promptJa
          ? "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
          : "NVV は動詞＋名詞のセットで覚えると C1 空所補充に直結します。",
      },
    });
  }
  if (qs.length === 0) return null;
  const id = `schmidt-l${lektion}-${kind}`;
  const title = kind === "lektion" ? `Lektion ${lektion}` : `Quiz Lektion ${lektion}`;
  return {
    id,
    provider: "schmidt",
    skill: "nvv",
    partNumber: lektion,
    title,
    titleJa: kind === "lektion" ? `NVV Lektion ${lektion}` : `NVV Quiz ${lektion}`,
    description: kind === "lektion" ? "Lektionsteil · Fragen mit Erklärung" : "Quiz · Wiederholung",
    estimatedMinutes: Math.ceil(qs.length * 1.5),
    instruction: "Wählen Sie die richtige Lösung (Nomen-Verb-Verbindung).",
    questions: qs,
  };
}

const sections = [
  sectionForRange(1, "lektion", 1, 20, allQuestions),
  sectionForRange(1, "quiz", 21, 40, allQuestions),
  sectionForRange(2, "lektion", 41, 60, allQuestions),
  sectionForRange(2, "quiz", 61, 80, allQuestions),
  sectionForRange(3, "lektion", 81, 100, allQuestions),
  sectionForRange(3, "quiz", 101, 120, allQuestions),
  sectionForRange(4, "lektion", 121, 140, allQuestions),
  sectionForRange(4, "quiz", 141, 160, allQuestions),
  sectionForRange(5, "lektion", 161, 180, allQuestions),
  sectionForRange(5, "quiz", 181, 200, allQuestions),
].filter(Boolean);

const outDir = path.join(process.cwd(), "src/data/sections/schmidt");
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
  console.log(`Wrote ${sec.id}.ts (${sec.questions.length} questions)`);
}

const indexPath = path.join(outDir, "index.ts");
const indexBody = `${exports.map((e) => `import { ${e.varName} } from "./${e.id}";`).join("\n")}

export const SCHMIDT_SECTIONS = [
${exports.map((e) => `  ${e.varName},`).join("\n")}
];
`;
fs.writeFileSync(indexPath, indexBody);

console.log(`\nTotal sections: ${sections.length}, questions: ${sections.reduce((n, s) => n + s.questions.length, 0)}`);
console.log("Add SCHMIDT_SECTIONS to src/data/sections/index.ts");
