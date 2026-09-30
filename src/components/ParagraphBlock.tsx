"use client";

import { useEffect, useRef } from "react";
import { IconPause, IconPlay } from "@/components/icons";
import { SelectableText } from "@/components/SelectableText";
import { StudyNotesPanel } from "@/components/StudyNotesPanel";
import type { LearningLanguage, Paragraph } from "@/lib/types";

type ParagraphBlockProps = {
  paragraph: Paragraph;
  language: LearningLanguage;
  source: string;
  showTranslation: boolean;
  highlighted: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onToggle: () => void;
  onVisible: () => void;
  onToast: (message: string) => void;
};

export function ParagraphBlock({
  paragraph,
  language,
  source,
  showTranslation,
  highlighted,
  isPlaying,
  onPlay,
  onToggle,
  onVisible,
  onToast,
}: ParagraphBlockProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onVisible();
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <section
      id={`para-${paragraph.index}`}
      ref={ref}
      className={`mb-4 rounded-2xl border bg-white transition-colors ${
        highlighted ? "border-teal-300 ring-2 ring-teal-100" : "border-stone-200"
      }`}
    >
      <div
        className="flex gap-3 px-4 pt-4 active:bg-stone-50"
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest("[data-add-word-popup]")) return;
          if (target.tagName === "TEXTAREA") return;
          onPlay();
        }}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onPlay();
          }}
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
            isPlaying ? "bg-teal-700 text-white" : "bg-stone-100 text-stone-700"
          }`}
          aria-label={isPlaying ? "音声を停止" : "段落を読み上げ"}
        >
          {isPlaying ? <IconPause className="h-4 w-4" /> : <IconPlay className="h-4 w-4" />}
        </button>
        <div className="min-w-0 flex-1">
          <SelectableText
            text={paragraph.original}
            language={language}
            source={source}
            className="text-[1.05rem] leading-relaxed text-stone-900"
            onToast={onToast}
          />
          {!showTranslation && (
            <p className="mt-2 text-xs text-stone-400">▶ タップで音声 · 下で訳と解説</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 text-left active:bg-stone-50"
      >
        {showTranslation ? (
          <div className="border-t border-stone-100 pt-3">
            <p className="text-sm leading-relaxed text-stone-600">{paragraph.translation}</p>
            <StudyNotesPanel
              notes={paragraph.studyNotes}
              language={language}
              source={source}
              onToast={onToast}
            />
          </div>
        ) : (
          <p className="border-t border-stone-100 pt-3 text-xs text-teal-700">
            タップで訳と解説を表示
          </p>
        )}
      </button>
    </section>
  );
}
