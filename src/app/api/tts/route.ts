import { NextResponse } from "next/server";
import { synthesizeSpeech } from "@/lib/google-tts";
import type { LearningLanguage } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as { text?: string; language?: LearningLanguage };
  const text = body.text?.trim() ?? "";

  if (!text) {
    return NextResponse.json({ error: "読み上げるテキストが空です。" }, { status: 400 });
  }

  if (text.length > 4500) {
    return NextResponse.json(
      { error: "1段落あたり4500文字以内にしてください。" },
      { status: 400 }
    );
  }

  const language = body.language === "de" ? "de" : "en";

  try {
    const audio = await synthesizeSpeech(text, language);
    return new NextResponse(new Uint8Array(audio), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "private, max-age=86400",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "音声の生成に失敗しました。";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
