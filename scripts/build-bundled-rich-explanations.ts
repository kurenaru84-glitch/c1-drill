#!/usr/bin/env npx tsx
/**
 * 書籍データから RichExplanation 形式を一括組み立て → public/rich-explanations.json
 * （API 不要・数秒で完了。後から generate:rich-explanations:daemon で AI 版に差し替え可能）
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ALL_SECTIONS } from "../src/data/sections";
import { buildStaticRichExplanation } from "../src/lib/build-static-rich-explanation";
import type { RichExplanation } from "../src/lib/exam-types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "../public/rich-explanations.json");

function loadExisting(): Record<string, RichExplanation> {
  if (!fs.existsSync(OUT_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(OUT_PATH, "utf8")) as Record<string, RichExplanation>;
  } catch {
    return {};
  }
}

function main() {
  const existing = loadExisting();
  const out: Record<string, RichExplanation> = { ...existing };
  let built = 0;
  let keptAi = 0;

  for (const section of ALL_SECTIONS) {
    if (section.skill !== "nvv" && section.skill !== "sprachbausteine") continue;
    for (const question of section.questions) {
      const prev = out[question.id];
      if (prev?._meta?.tier === "ai" && prev.completedSentenceDe?.trim()) {
        keptAi++;
        continue;
      }
      out[question.id] = buildStaticRichExplanation({
        question,
        skill: section.skill,
        sectionVocab: section.wortschatz,
      });
      built++;
    }
  }

  fs.writeFileSync(OUT_PATH, `${JSON.stringify(out)}\n`, "utf8");
  const total = Object.keys(out).filter((id) => out[id]?.completedSentenceDe?.trim()).length;
  console.log(`書籍ベース ${built} 問を書き込み / AI 維持 ${keptAi} 問 / 合計 ${total} 問 → ${OUT_PATH}`);
}

main();
