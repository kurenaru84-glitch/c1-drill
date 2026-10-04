/** 正解語を入れた完成文（AI 失敗時のフォールバック用） */
export function buildCompletedSentence(
  prompt: string,
  correctText: string,
  gapNumber?: number
): string {
  const answer = correctText.trim();
  if (!answer) return prompt.trim();

  if (gapNumber != null) {
    const gapRe = new RegExp(`\\[${gapNumber}\\]\\s*________`);
    if (gapRe.test(prompt)) {
      return prompt.replace(gapRe, answer).replace(/\s+/g, " ").trim();
    }
  }

  if (/_{2,}/.test(prompt)) {
    return prompt.replace(/_{2,}/, answer).replace(/\s+/g, " ").trim();
  }
  if (/ー{2,}/.test(prompt)) {
    return prompt.replace(/ー{2,}/, answer).replace(/\s+/g, " ").trim();
  }

  return prompt.replace(/\s+/g, " ").trim();
}
