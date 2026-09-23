import { createSign } from "crypto";
import type { LearningLanguage } from "@/lib/types";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SYNTHESIZE_URL = "https://texttospeech.googleapis.com/v1/text:synthesize";

const TTS_VOICES: Record<LearningLanguage, { languageCode: string; name: string }> = {
  en: { languageCode: "en-US", name: "en-US-Neural2-F" },
  de: { languageCode: "de-DE", name: "de-DE-Neural2-B" },
};

type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
};

let cachedToken: { value: string; expiresAt: number } | null = null;

function getCredentials(): ServiceAccountCredentials {
  const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON?.trim();
  if (!raw) {
    throw new Error(
      "GOOGLE_APPLICATION_CREDENTIALS_JSON が設定されていません。Vercel の Environment Variables を確認してください。"
    );
  }

  let parsed: ServiceAccountCredentials;
  try {
    parsed = JSON.parse(raw) as ServiceAccountCredentials;
  } catch {
    throw new Error(
      "GOOGLE_APPLICATION_CREDENTIALS_JSON が JSON として読めません。API キー（AIza...）ではなく、Google Cloud のサービスアカウント JSON ファイルの中身全体を1行で貼ってください。"
    );
  }

  if (!parsed.client_email || !parsed.private_key) {
    throw new Error(
      "サービスアカウント JSON に client_email と private_key が必要です。Cloud Console からダウンロードした JSON をそのまま使ってください。"
    );
  }

  return {
    client_email: parsed.client_email,
    private_key: parsed.private_key.replace(/\\n/g, "\n"),
  };
}

function base64url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const credentials = getCredentials();
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      iss: credentials.client_email,
      scope: "https://www.googleapis.com/auth/cloud-platform",
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now,
    })
  );
  const unsigned = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(credentials.private_key, "base64url");
  const assertion = `${unsigned}.${signature}`;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description ?? data.error ?? "Google 認証に失敗しました。");
  }

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };

  return data.access_token;
}

export function getTtsVoice(language: LearningLanguage) {
  return TTS_VOICES[language];
}

export async function synthesizeSpeech(text: string, language: LearningLanguage) {
  const voice = getTtsVoice(language);
  const token = await getAccessToken();

  const response = await fetch(SYNTHESIZE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: { text },
      voice: {
        languageCode: voice.languageCode,
        name: voice.name,
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: 1,
      },
    }),
  });

  const data = (await response.json()) as {
    audioContent?: string;
    error?: { message?: string };
  };

  if (!response.ok || !data.audioContent) {
    throw new Error(data.error?.message ?? "音声の生成に失敗しました。");
  }

  return Buffer.from(data.audioContent, "base64");
}
