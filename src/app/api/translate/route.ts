import { NextResponse } from "next/server";
import { translateToJapanese } from "@/lib/gemini";
import type { LearningLanguage } from "@/lib/types";

const LANGUAGE_NAMES: Record<LearningLanguage, string> = {
  en: "English",
  de: "German",
};

export async function POST(request: Request) {
  const body = (await request.json()) as { text?: string; language?: LearningLanguage };
  const text = body.text?.trim() ?? "";
  if (!text) {
    return NextResponse.json({ error: "翻訳するテキストが空です。" }, { status: 400 });
  }
  if (text.length > 300) {
    return NextResponse.json({ error: "翻訳は300文字以内にしてください。" }, { status: 400 });
  }

  const language = body.language === "de" ? "de" : "en";

  try {
    const translationJa = await translateToJapanese({
      text,
      languageName: LANGUAGE_NAMES[language],
    });
    return NextResponse.json({ translationJa });
  } catch (error) {
    const message = error instanceof Error ? error.message : "翻訳に失敗しました。";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
