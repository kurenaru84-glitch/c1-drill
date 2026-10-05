#!/usr/bin/env npx tsx
/**
 * NVV / Sprachbausteine の AI 詳細解説を一括生成 → public/rich-explanations.json
 *
 * Usage:
 *   GEMINI_API_KEY=... npm run generate:rich-explanations
 *   GEMINI_API_KEY=... npm run generate:rich-explanations -- --section=sb-c1-glutamat
 *   GEMINI_API_KEY=... npm run generate:rich-explanations -- --limit=5
 *   GEMINI_API_KEY=... npm run generate:rich-explanations -- --force
 *   npm run generate:rich-explanations:daemon   … .env.local を読み、少しずつ無限ループ（Ctrl+C で停止）
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ALL_SECTIONS } from "../src/data/sections";
import { generateRichExplanation } from "../src/lib/gemini";
import type { ExamSection, Question } from "../src/lib/exam-types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_PATH = path.join(ROOT, "public/rich-explanations.json");
const LOG_PATH = path.join(ROOT, "scripts/rich-explanations.log");

type Stored = Record<string, import("../src/lib/exam-types").RichExplanation>;

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function appendLog(line: string) {
  const stamp = new Date().toISOString();
  fs.appendFileSync(LOG_PATH, `[${stamp}] ${line}\n`, "utf8");
}

function parseArgs() {
  const args = process.argv.slice(2);
  let sectionFilter: string | null = null;
  let limit = Infinity;
  let force = false;
  let delayMs = 1200;
  let daemon = false;
  let idleMs = 180_000;
  let loadEnv = false;

  for (const arg of args) {
    if (arg === "--force") force = true;
    else if (arg === "--daemon") daemon = true;
    else if (arg === "--load-env") loadEnv = true;
    else if (arg.startsWith("--section=")) sectionFilter = arg.slice("--section=".length);
    else if (arg.startsWith("--limit=")) limit = Number(arg.slice("--limit=".length)) || Infinity;
    else if (arg.startsWith("--delay=")) delayMs = Number(arg.slice("--delay=".length)) || 1200;
    else if (arg.startsWith("--idle=")) idleMs = Number(arg.slice("--idle=".length)) || 180_000;
  }

  if (daemon && limit === Infinity) limit = 6;

  return { sectionFilter, limit, force, delayMs, daemon, idleMs, loadEnv };
}

function loadExisting(): Stored {
  if (!fs.existsSync(OUT_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(OUT_PATH, "utf8")) as Stored;
  } catch {
    return {};
  }
}

function save(data: Stored) {
  fs.writeFileSync(OUT_PATH, `${JSON.stringify(data, null, 0)}\n`, "utf8");
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function collectTargets(sectionFilter: string | null): Array<{
  section: ExamSection;
  question: Question;
}> {
  const out: Array<{ section: ExamSection; question: Question }> = [];
  for (const section of ALL_SECTIONS) {
    if (section.skill !== "nvv" && section.skill !== "sprachbausteine") continue;
    if (sectionFilter && section.id !== sectionFilter) continue;
    for (const question of section.questions) {
      out.push({ section, question });
    }
  }
  return out;
}

async function runBatch(options: {
  sectionFilter: string | null;
  limit: number;
  force: boolean;
  delayMs: number;
}): Promise<{ totalInFile: number; pendingAfter: number; targetTotal: number }> {
  const store = loadExisting();
  const targets = collectTargets(options.sectionFilter);

  const pending = targets.filter(({ question }) => {
    if (options.force) return true;
    const existing = store[question.id];
    if (!existing?.completedSentenceDe?.trim()) return true;
    return existing._meta?.tier !== "ai";
  });

  const toRun = pending.slice(0, options.limit);
  console.log(
    `対象 ${targets.length} 問 / 未生成 ${pending.length} 問 / 今回 ${toRun.length} 問 → ${OUT_PATH}`
  );

  let ok = 0;
  let fail = 0;

  for (let i = 0; i < toRun.length; i++) {
    const { section, question } = toRun[i];
    const label = `[${i + 1}/${toRun.length}] ${section.id} · ${question.id}`;
    process.stdout.write(`${label} … `);

    try {
      const rich = await generateRichExplanation({
        skill: section.skill as "nvv" | "sprachbausteine",
        sectionTitle: section.titleJa,
        prompt: question.prompt,
        gapNumber: section.skill === "sprachbausteine" ? question.number : undefined,
        options: question.options,
        correctOptionId: question.correctOptionId,
        bookGerman: question.explanation.german,
        bookSummary: question.explanation.summary,
      });

      if (!rich.completedSentenceDe?.trim()) {
        throw new Error("completedSentenceDe が空");
      }

      store[question.id] = {
        ...rich,
        _meta: { tier: "ai", generatedAt: new Date().toISOString() },
      };
      save(store);
      ok++;
      console.log("OK");
      appendLog(`OK ${question.id}`);
    } catch (error) {
      fail++;
      const msg = error instanceof Error ? error.message : String(error);
      console.log(`失敗: ${msg}`);
      appendLog(`FAIL ${question.id}: ${msg}`);
    }

    if (i < toRun.length - 1) await sleep(options.delayMs);
  }

  const fresh = loadExisting();
  const totalInFile = Object.keys(fresh).filter((id) => fresh[id]?.completedSentenceDe?.trim()).length;
  const pendingAfter = targets.filter(({ question }) => {
    if (options.force) return false;
    const ex = fresh[question.id];
    if (!ex?.completedSentenceDe?.trim()) return true;
    return ex._meta?.tier !== "ai";
  }).length;
  console.log(`バッチ完了: 成功 ${ok} / 失敗 ${fail} / JSON 内 ${totalInFile} 問 / 残り ${pendingAfter}`);
  appendLog(`batch ok=${ok} fail=${fail} total=${totalInFile} pending=${pendingAfter}`);

  return { totalInFile, pendingAfter, targetTotal: targets.length };
}

async function main() {
  const { sectionFilter, limit, force, delayMs, daemon, idleMs, loadEnv } = parseArgs();
  if (loadEnv || daemon) loadEnvLocal();

  if (!process.env.GEMINI_API_KEY?.trim() && !process.env.GOOGLE_API_KEY?.trim()) {
    console.error("GEMINI_API_KEY が必要です（.env.local または環境変数）");
    process.exit(1);
  }

  if (daemon) {
    console.log(`デーモン: 1バッチ ${limit} 問 / バッチ間 ${Math.round(idleMs / 1000)} 秒`);
    appendLog("daemon start");
  }

  do {
    const result = await runBatch({ sectionFilter, limit, force, delayMs });
    if (!daemon) break;
    if (result.pendingAfter === 0) {
      console.log("すべての問題の AI 解説が揃いました。");
      appendLog("all complete");
      break;
    }
    console.log(`次のバッチまで ${Math.round(idleMs / 1000)} 秒…（Ctrl+C で停止）`);
    await sleep(idleMs);
  } while (true);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
