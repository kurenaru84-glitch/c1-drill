export type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
};

function stripOuterQuotes(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function tryParseJson(raw: string): ServiceAccountCredentials | null {
  try {
    const parsed = JSON.parse(raw) as ServiceAccountCredentials;
    if (parsed?.client_email && parsed?.private_key) {
      return {
        client_email: parsed.client_email,
        private_key: parsed.private_key.replace(/\\n/g, "\n"),
      };
    }
  } catch {
    /* try other formats */
  }
  return null;
}

/**
 * GOOGLE_APPLICATION_CREDENTIALS_JSON をパース（read-along と同じ値を想定）。
 * Vercel / .env.local では JSON 全体をシングルクォートで囲むのが安全。
 * または GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64 に base64 エンコード JSON。
 */
export function loadGoogleServiceAccountCredentials(): ServiceAccountCredentials {
  const base64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64?.trim();
  if (base64) {
    try {
      const decoded = Buffer.from(base64, "base64").toString("utf8");
      const fromB64 = tryParseJson(decoded);
      if (fromB64) return fromB64;
    } catch {
      /* fall through */
    }
  }

  const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON?.trim();
  if (!raw) {
    throw new Error(
      "GOOGLE_APPLICATION_CREDENTIALS_JSON が設定されていません。.env.local または Vercel の Environment Variables を確認してください。"
    );
  }

  if (raw.startsWith("AIza")) {
    throw new Error(
      "GOOGLE_APPLICATION_CREDENTIALS_JSON に API キー（AIza...）が入っています。TTS には Google Cloud のサービスアカウント JSON ファイルの中身全体が必要です（GEMINI_API_KEY とは別）。"
    );
  }

  const candidates = [raw, stripOuterQuotes(raw)];
  for (const candidate of candidates) {
    const parsed = tryParseJson(candidate);
    if (parsed) return parsed;
  }

  if (raw.length < 80 || !raw.includes("client_email")) {
    throw new Error(
      "GOOGLE_APPLICATION_CREDENTIALS_JSON が途中で切れている可能性があります。Vercel では JSON 全文を貼り直すか、GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64 を使ってください。"
    );
  }

  throw new Error(
    "GOOGLE_APPLICATION_CREDENTIALS_JSON が JSON として読めません。ダウンロードしたサービスアカウント JSON を1行で貼るか、GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64 に base64 エンコードして設定してください。"
  );
}
