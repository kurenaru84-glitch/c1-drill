"use client";

import { IconPause, IconPlay } from "@/components/icons";
import { SelectableText } from "@/components/SelectableText";
import { StudyNotesPanel } from "@/components/StudyNotesPanel";
import type { PassageParagraph } from "@/lib/exam-types";

type Props = {
  paragraph: PassageParagraph;
  index: number;
  sectionId: string;
  source: string;
  showTranslation: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  onPlay: () => void;
  onToggleTranslation: () => void;
  onToast: (message: string) => void;
  translationText?: string;
  translationLoading?: boolean;
  translationError?: string;
};

export function ExamParagraphBlock({
  paragraph,
  index,
  source,
  showTranslation,
  isPlaying,
  isLoading,
  onPlay,
  onToggleTranslation,
  onToast,
  translationText,
  translationLoading,
  translationError,
}: Props) {
  const displayTranslation = translationText ?? paragraph.translation;
  return (
    <section className="rounded-2xl border border-stone-200 bg-white">
      <div
        className="flex gap-3 px-3 pt-3 active:bg-stone-50"
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest("[data-add-word-popup]")) return;
          if (target.closest("[data-selectable-text]") || target.tagName === "TEXTAREA") return;
          onPlay();
        }}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onPlay();
          }}
          disabled={isLoading}
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-50 ${
            isPlaying ? "bg-teal-700 text-white" : "bg-stone-100 text-stone-700"
          }`}
          aria-label={isPlaying ? "音声を停止" : `段落 ${index + 1} を読み上げ`}
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-teal-600" />
          ) : isPlaying ? (
            <IconPause className="h-4 w-4" />
          ) : (
            <IconPlay className="h-4 w-4" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <SelectableText
            text={paragraph.original}
            language="de"
            source={source}
            className="text-[1rem] leading-relaxed text-stone-900"
            onToast={onToast}
          />
          {!showTranslation && (
            <p className="mt-1.5 text-[11px] text-stone-400">
              ▶ 左の再生ボタンで音声 · 下の行で日本語訳
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleTranslation}
        className="w-full px-3 py-2.5 text-left active:bg-stone-50"
      >
        {showTranslation ? (
          <div className="border-t border-stone-100 pt-2">
            {translationLoading ? (
              <p className="text-sm text-stone-500">日本語訳を取得中…</p>
            ) : translationError ? (
              <p className="text-sm text-amber-800">{translationError}</p>
            ) : displayTranslation?.trim() ? (
              <p className="text-sm leading-relaxed text-stone-600">{displayTranslation}</p>
            ) : (
              <p className="text-sm text-stone-500">訳がありません。</p>
            )}
            {paragraph.studyNotes && (
              <StudyNotesPanel
                notes={paragraph.studyNotes}
                language="de"
                source={source}
                onToast={onToast}
              />
            )}
          </div>
        ) : (
          <p className="border-t border-stone-100 pt-2 text-xs font-medium text-teal-700">
            日本語訳と解説を表示
          </p>
        )}
      </button>
    </section>
  );
}
