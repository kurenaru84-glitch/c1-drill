"use client";

import { SectionCard } from "@/components/SectionCard";
import { ALL_SECTIONS, PROVIDER_LABELS, getSectionsByProvider } from "@/data/sections";
import type { ExamProvider } from "@/lib/exam-types";

const providers: ExamProvider[] = ["goethe", "telc"];

export function HomeSectionsView() {
  return (
    <main className="mx-auto max-w-lg px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900">C1 Drill</h1>
        <p className="mt-1 text-sm text-stone-600">
          Goethe / telc 形式の問題をセクションごとに。隙間時間に1問ずつ。
        </p>
      </header>

      {providers.map((provider) => {
        const sections = getSectionsByProvider(provider);
        if (sections.length === 0) return null;
        return (
          <section key={provider} className="mb-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
              {PROVIDER_LABELS[provider]}
            </h2>
            <div className="space-y-2">
              {sections.map((section) => (
                <SectionCard key={section.id} section={section} />
              ))}
            </div>
          </section>
        );
      })}

      <p className="text-center text-xs text-stone-400">
        {ALL_SECTIONS.length} セクション · 全{" "}
        {ALL_SECTIONS.reduce((n, s) => n + s.questions.length, 0)} 問
      </p>
    </main>
  );
}
