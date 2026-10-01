import { notFound } from "next/navigation";
import { SprachbausteineLesenView } from "@/components/SprachbausteineLesenView";
import { getSection } from "@/data/sections";

type Props = {
  params: Promise<{ sectionId: string }>;
};

export default async function SprachbausteineLesenPage({ params }: Props) {
  const { sectionId } = await params;
  const section = getSection(sectionId);
  if (!section || section.skill !== "sprachbausteine") notFound();
  return <SprachbausteineLesenView section={section} />;
}
