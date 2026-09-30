/**
 * Batch-translate Schmidt prompts 41–200 → schmidt-prompt-ja.mjs
 * Requires GEMINI_API_KEY in .env.local
 */
import fs from "fs";
import path from "path";
import { extractAllSchmidtPrompts } from "./extract-schmidt-prompts.mjs";

const root = process.cwd();
const envPath = path.join(root, ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const sourcePath = process.argv[2] || "/Users/naruki/Downloads/Deutsch mit Schmidttxt";
const prompts = extractAllSchmidtPrompts(sourcePath);
const nums = Object.keys(prompts)
  .map(Number)
  .filter((n) => n >= 41)
  .sort((a, b) => a - b);

const apiKey = process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_API_KEY?.trim();
if (!apiKey) {
  console.error("GEMINI_API_KEY not set");
  process.exit(1);
}

const BATCH = 8;
const result = {};

for (let i = 0; i < nums.length; i += BATCH) {
  const slice = nums.slice(i, i + BATCH);
  const block = slice
    .map((n) => `[${n}]\n${prompts[n]}`)
    .join("\n\n---\n\n");

  const prompt = `Du bist Übersetzer für C1-Deutschlehrmaterial.
Übersetze jede deutsche Aufgabenstellung ins Japanische für Lerner.
Regeln:
- Behalte ________ als （　）
- Behalte Anführungszeichen „…" als 「…」
- Pro [Nummer] genau eine japanische Zeile (kann 2 kurze Sätze sein)
- Ausgabeformat strikt:
[Nummer]
日本語文

Aufgaben:
${block}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 },
      }),
    }
  );
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!text) {
    console.error("API error", JSON.stringify(data).slice(0, 500));
    process.exit(1);
  }
  for (const n of slice) {
    const re = new RegExp(`\\[${n}\\]\\s*\\n([\\s\\S]*?)(?=\\n\\[\\d+\\]|$)`);
    const m = text.match(re);
    if (m) result[n] = m[1].trim().replace(/\n+/g, " ");
    else console.warn("Missing", n);
  }
  console.log(`Translated ${slice[0]}–${slice[slice.length - 1]}`);
  await new Promise((r) => setTimeout(r, 1200));
}

const outPath = path.join(root, "scripts/schmidt-prompt-ja.mjs");
const body = `/** Auto-generated promptJa for Fragen 41–200 */\nexport const SCHMIDT_PROMPT_JA = ${JSON.stringify(result, null, 2)};\n`;
fs.writeFileSync(outPath, body);
console.log("Wrote", outPath, Object.keys(result).length, "entries");
