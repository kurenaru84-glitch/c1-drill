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
