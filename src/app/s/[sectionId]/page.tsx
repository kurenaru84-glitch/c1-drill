import { notFound } from "next/navigation";
import { SectionDetailView } from "@/components/SectionDetailView";
import { getSection } from "@/data/sections";

type Props = {
  params: Promise<{ sectionId: string }>;
};

export default async function SectionPage({ params }: Props) {
  const { sectionId } = await params;
  const section = getSection(sectionId);
  if (!section) notFound();
  return <SectionDetailView section={section} />;
}
