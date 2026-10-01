import { notFound } from "next/navigation";
import { SprachbausteineVocabView } from "@/components/SprachbausteineVocabView";
import { getSection } from "@/data/sections";

type Props = {
  params: Promise<{ sectionId: string }>;
};

export default async function SprachbausteineVocabPage({ params }: Props) {
  const { sectionId } = await params;
  const section = getSection(sectionId);
  if (!section || section.skill !== "sprachbausteine") notFound();
  return <SprachbausteineVocabView section={section} />;
}
