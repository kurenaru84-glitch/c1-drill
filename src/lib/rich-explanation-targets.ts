import { ALL_SECTIONS } from "@/data/sections";

/** NVV + Sprachbausteine（事前生成 AI 解説の対象問題数） */
export const RICH_EXPLANATION_TARGET_COUNT = ALL_SECTIONS.reduce((count, section) => {
  if (section.skill !== "nvv" && section.skill !== "sprachbausteine") return count;
  return count + section.questions.length;
}, 0);
