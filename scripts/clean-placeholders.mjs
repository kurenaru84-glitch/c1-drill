#!/usr/bin/env node
/** Remove placeholder studyNotes entries without regenerating. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ARTICLES_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/data/articles"
);

function isBadChunk(m) {
  return m.includes("段落から抽出");
}
function isBadVocab(m) {
  return m.includes("段落の重要語") || m === m.match(/^[A-Za-zäöüßÄÖÜ-]+$/)?.[0];
}
function isBadGrammar(e) {
  return e.includes("この文の構造・語順に注目");
}

function cleanBlock(block) {
  let out = block;
  out = out.replace(
    /\{\s*phrase:\s*"((?:\\.|[^"\\])*)"\s*,\s*meaning:\s*"((?:\\.|[^"\\])*)"\s*\}/g,
    (m, _p, meaning) => (isBadChunk(meaning) ? "" : m)
  );
  out = out.replace(
    /\{\s*pattern:\s*"((?:\\.|[^"\\])*)"\s*,\s*explanation:\s*"((?:\\.|[^"\\])*)"\s*\}/g,
    (m, _p, exp) => (isBadGrammar(exp) ? "" : m)
  );
  out = out.replace(
    /\{\s*term:\s*"((?:\\.|[^"\\])*)"\s*,\s*meaning:\s*"((?:\\.|[^"\\])*)"\s*\}/g,
    (m, term, meaning) => (isBadVocab(meaning) || meaning === `${term}（段落の重要語）` ? "" : m)
  );
  out = out.replace(/,\s*,/g, ",").replace(/\[\s*,/g, "[").replace(/,\s*\]/g, "]");
  return out;
}

const files = fs.readdirSync(ARTICLES_DIR).filter((f) => /^article-\d+\.ts$/.test(f));
let n = 0;
for (const f of files) {
  const p = path.join(ARTICLES_DIR, f);
  const before = fs.readFileSync(p, "utf8");
  const after = before.replace(/studyNotes:\s*\{[\s\S]*?\n\s*\}/g, (block) => {
    n++;
    return cleanBlock(block);
  });
  fs.writeFileSync(p, after);
}
console.log(`Cleaned ${n} studyNotes blocks`);
