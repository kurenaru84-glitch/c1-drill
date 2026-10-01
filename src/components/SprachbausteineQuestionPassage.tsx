"use client";

import { useEffect, useRef } from "react";
import { paragraphIndexForGap, splitPassageGaps } from "@/lib/sprachbausteine-utils";
import type { ExamSection } from "@/lib/exam-types";

type Props = {
  section: ExamSection;
  activeGap: number;
};

export function SprachbausteineQuestionPassage({ section, activeGap }: Props) {
  const paragraphs = section.passage?.paragraphs ?? [];
  const focusIndex = paragraphIndexForGap(section, activeGap);
  const focusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    focusRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeGap, focusIndex]);

  if (paragraphs.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-stone-500">本文（空所 [番号] は Lücke に対応）</p>
      {paragraphs.map((paragraph, index) => (
        <div
          key={index}
          ref={index === focusIndex ? focusRef : undefined}
          className={`rounded-2xl border bg-white p-3 ${
            index === focusIndex ? "border-teal-300 ring-1 ring-teal-200" : "border-stone-200"
          }`}
        >
          <p className="text-[0.95rem] leading-relaxed text-stone-900">
            {splitPassageGaps(paragraph.original).map((part, i) => {
              if (part.kind === "text") {
                return <span key={i}>{part.value}</span>;
              }
              const isActive = part.number === activeGap;
              return (
                <span
                  key={i}
                  className={`mx-0.5 inline rounded px-0.5 font-medium ${
                    isActive
                      ? "bg-teal-100 text-teal-900 ring-2 ring-teal-500"
                      : "bg-amber-50 text-stone-800"
                  }`}
                >
                  [{part.number}] ________
                </span>
              );
            })}
          </p>
        </div>
      ))}
    </div>
  );
}
