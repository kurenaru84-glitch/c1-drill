import { notFound } from "next/navigation";
import { QuestionPracticeView } from "@/components/QuestionPracticeView";
import { getSection } from "@/data/sections";

type Props = {
  params: Promise<{ sectionId: string; index: string }>;
};

export default async function QuestionPage({ params }: Props) {
  const { sectionId, index } = await params;
  const section = getSection(sectionId);
  if (!section) notFound();

  const questionIndex = Number.parseInt(index, 10);
  if (Number.isNaN(questionIndex) || questionIndex < 0 || questionIndex >= section.questions.length) {
    notFound();
  }

  return <QuestionPracticeView section={section} questionIndex={questionIndex} />;
}
