import { NextResponse } from "next/server";
import { generateRichExplanation } from "@/lib/gemini";
import type { ExamSkill } from "@/lib/exam-types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    questionId?: string;
    skill?: ExamSkill;
    sectionTitle?: string;
    prompt?: string;
    gapNumber?: number;
    options?: Array<{ id: string; text: string }>;
    correctOptionId?: string;
    bookGerman?: string;
    bookSummary?: string;
  };

  const skill = body.skill;
  if (skill !== "nvv" && skill !== "sprachbausteine") {
    return NextResponse.json({ error: "この問題形式には詳細解説がありません。" }, { status: 400 });
  }

  const prompt = body.prompt?.trim() ?? "";
  if (!prompt || prompt.length > 2000) {
    return NextResponse.json({ error: "問題文が不正です。" }, { status: 400 });
  }

  const options = body.options ?? [];
  const correctOptionId = body.correctOptionId?.trim() ?? "";
  if (options.length < 2 || !correctOptionId) {
    return NextResponse.json({ error: "選択肢データが不足しています。" }, { status: 400 });
  }

  try {
    const rich = await generateRichExplanation({
      skill,
      sectionTitle: body.sectionTitle?.trim() || "C1 Drill",
      prompt,
      gapNumber: body.gapNumber,
      options,
      correctOptionId,
      bookGerman: body.bookGerman,
      bookSummary: body.bookSummary,
    });
    return NextResponse.json({ rich, questionId: body.questionId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "詳細解説の生成に失敗しました。";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
