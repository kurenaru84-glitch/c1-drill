const PRIMARY_MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash";
const FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL?.trim() || "gemini-3.1-flash-lite";
const INTERACTIONS_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";
const API_REVISION = "2026-05-20";

type InteractionStep = {
  type?: string;
  content?: Array<{ type?: string; text?: string }>;
};

type InteractionResponse = {
  status?: string;
  error?: { message?: string };
  steps?: InteractionStep[];
};

function getApiKey() {
  const apiKey =
    process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY が設定されていません。Vercel の Environment Variables を確認してください。"
    );
  }
  return apiKey;
}

function extractInteractionText(data: InteractionResponse) {
  const parts: string[] = [];
  for (const step of data.steps ?? []) {
    if (step.type !== "model_output") continue;
    for (const item of step.content ?? []) {
      if (item.type === "text" && item.text?.trim()) {
        parts.push(item.text.trim());
      }
    }
  }
  const text = parts.join("\n").trim();
  if (!text) throw new Error("AI から応答がありませんでした。");
  return text;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(message: string, status?: number) {
  const lower = message.toLowerCase();
  return (
    status === 429 ||
    status === 503 ||
    status === 500 ||
    lower.includes("quota") ||
    lower.includes("rate") ||
    lower.includes("overloaded") ||
    lower.includes("try again")
  );
}

async function callInteractionOnce(model: string, input: string) {
  const res = await fetch(INTERACTIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": getApiKey(),
      "Api-Revision": API_REVISION,
    },
    body: JSON.stringify({ model, input }),
  });

  const data = (await res.json()) as InteractionResponse;
  if (!res.ok) {
    const message = data.error?.message ?? `AI API error (${res.status})`;
    const error = new Error(message) as Error & { status?: number };
    error.status = res.status;
    throw error;
  }
  if (data.status && data.status !== "completed") {
    throw new Error(`AI の処理が完了しませんでした (${data.status})`);
  }
  return extractInteractionText(data);
}

async function callInteraction(input: string) {
  const models = [PRIMARY_MODEL, FALLBACK_MODEL].filter(
    (model, index, all) => model && all.indexOf(model) === index
  );
  let lastError: Error | null = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        return await callInteractionOnce(model, input);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        const status = (lastError as Error & { status?: number }).status;
        if (attempt === 0 && isRetryable(lastError.message, status)) {
          await sleep(800);
          continue;
        }
        break;
      }
    }
  }

  throw lastError ?? new Error("翻訳に失敗しました。");
}

export async function translateToJapanese(params: {
  text: string;
  languageName: string;
}): Promise<string> {
  const phrase = params.text.trim();
  if (!phrase) throw new Error("翻訳するテキストが空です。");

  const prompt = `Translate the following ${params.languageName} phrase into natural Japanese for a language learner's vocabulary memo.
Use a concise, natural meaning in Japanese (not word-for-word if unnatural).
Return only the Japanese translation, with no quotes or explanation.

Phrase:
"""
${phrase}
"""`;

  const text = await callInteraction(prompt);
  return text.replace(/^["「]|["」]$/g, "").trim();
}

function parseJsonFromModel(raw: string): unknown {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced ? fenced[1].trim() : trimmed;
  return JSON.parse(body);
}

export type RichExplanationPayload = {
  skill: "nvv" | "sprachbausteine";
  sectionTitle: string;
  prompt: string;
  gapNumber?: number;
  options: Array<{ id: string; text: string }>;
  correctOptionId: string;
  bookGerman?: string;
  bookSummary?: string;
};

export async function generateRichExplanation(params: RichExplanationPayload) {
  const optionsBlock = params.options
    .map((o) => `${o.id}. ${o.text}`)
    .join("\n");

  const skillGuide =
    params.skill === "nvv"
      ? `これは C1 の Nomen-Verb-Verbindung / 定型表現（NVV・イディオム）問題です。正解のコロケーション・イディオムを中心に、完成文と日本語訳、各誤答肢がなぜダメかを具体的に書いてください。`
      : `これは C1 Sprachbausteine（穴埋め）問題です。空所番号 ${params.gapNumber ?? "?"} に入る語の文法・意味・搭配を説明し、完成文と日本語訳、各誤答肢の不適切な理由を書いてください。`;

  const prompt = `あなたはドイツ語 C1 試験対策の講師です。学習者向けに、次の4択問題の「詳しい解説」を日本語中心で作成してください。

${skillGuide}

【セクション】${params.sectionTitle}
【問題文（ドイツ語）】
${params.prompt}

【選択肢】
${optionsBlock}

【正解】${params.correctOptionId}

【書籍メモ（あれば参考）】
${params.bookGerman?.trim() || "（なし）"}
${params.bookSummary?.trim() ? `\n${params.bookSummary.trim()}` : ""}

次の JSON のみを出力（説明文や markdown コードブロックは付けない）:

{
  "correctAnswerLineJa": "正解は X: 語 です。",
  "completedSentenceDe": "正解語を入れた完成したドイツ語文（1段落）",
  "translationJa": "完成文の自然な日本語訳",
  "mainTitleJa": "解説の見出し（例: 解説：定型表現（熟語）の知識）",
  "mainBodyJa": "正解の理由・用法・コロケーション。改行\\nで段落分け。ドイツ語の重要フレーズはそのまま引用可。",
  "wrongOptions": [
    { "id": "a", "textDe": "選択肢の語", "reasonJa": "なぜ不正解か（1〜3文）" }
  ],
  "grammarPoints": [
    { "titleJa": "重要文法・構文ポイントのタイトル", "bodyJa": "説明と例文" }
  ],
  "vocabulary": [
    { "termDe": "ドイツ語", "meaningJa": "日本語の意味" }
  ]
}

wrongOptions には正解以外の id をすべて含める。vocabulary は 5〜12 件、grammarPoints は 1〜3 件。`;

  const raw = await callInteraction(prompt);
  const parsed = parseJsonFromModel(raw) as Record<string, unknown>;

  const wrongOptions = Array.isArray(parsed.wrongOptions)
    ? parsed.wrongOptions.map((row) => {
        const r = row as Record<string, unknown>;
        return {
          id: String(r.id ?? ""),
          textDe: String(r.textDe ?? ""),
          reasonJa: String(r.reasonJa ?? ""),
        };
      })
    : [];

  const grammarPoints = Array.isArray(parsed.grammarPoints)
    ? parsed.grammarPoints.map((row) => {
        const g = row as Record<string, unknown>;
        return {
          titleJa: String(g.titleJa ?? ""),
          bodyJa: String(g.bodyJa ?? ""),
        };
      })
    : [];

  const vocabulary = Array.isArray(parsed.vocabulary)
    ? parsed.vocabulary.map((row) => {
        const v = row as Record<string, unknown>;
        return {
          termDe: String(v.termDe ?? ""),
          meaningJa: String(v.meaningJa ?? ""),
        };
      })
    : [];

  return {
    correctAnswerLineJa: String(parsed.correctAnswerLineJa ?? ""),
    completedSentenceDe: String(parsed.completedSentenceDe ?? ""),
    translationJa: String(parsed.translationJa ?? ""),
    mainTitleJa: String(parsed.mainTitleJa ?? "解説"),
    mainBodyJa: String(parsed.mainBodyJa ?? ""),
    wrongOptions,
    grammarPoints,
    vocabulary,
  };
}
