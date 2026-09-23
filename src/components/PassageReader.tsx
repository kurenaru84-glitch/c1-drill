"use client";

import { useCallback, useEffect, useState } from "react";
import { IconChevron, IconVolume } from "@/components/icons";
import { ExamParagraphBlock } from "@/components/ExamParagraphBlock";
import { playSectionParagraphAudio } from "@/lib/exam-tts";
import { unlockAudioPlayback, stopAudioPlayback } from "@/lib/audio-playback";
import { stopSpeech, useSpeech } from "@/lib/use-speech";
import type { Passage, Transcript } from "@/lib/exam-types";

type Props = {
  sectionId: string;
  passage?: Passage;
  transcript?: Transcript;
  sourceLabel: string;
  defaultExpanded?: boolean;
  compact?: boolean;
};

export function PassageReader({
  sectionId,
  passage,
  transcript,
  sourceLabel,
  defaultExpanded = true,
  compact = false,
}: Props) {
  const { speakingId } = useSpeech();
  const [expanded, setExpanded] = useState(defaultExpanded && !compact);
  const [visibleTranslations, setVisibleTranslations] = useState<Set<number>>(new Set());
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  const kind = transcript ? "transcript" : "passage";
  const label = transcript ? "聴解テキスト" : "本文";
  const paragraphs = transcript?.paragraphs ?? passage?.paragraphs ?? [];

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2000);
  }, []);

  useEffect(() => () => stopSpeech(), []);

  function toggleTranslation(index: number) {
    setVisibleTranslations((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  async function playParagraph(index: number) {
    const text = paragraphs[index]?.original;
    if (!text) return;

    unlockAudioPlayback();
    const speakId = `${kind}-${sectionId}-${index}`;
    if (speakingId === speakId) {
      stopAudioPlayback();
      stopSpeech();
      return;
    }

    setLoadingIndex(index);
    try {
      await playSectionParagraphAudio(sectionId, index, text, kind, speakId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "音声の再生に失敗しました。";
      showToast(message);
    } finally {
      setLoadingIndex(null);
    }
  }

  if (paragraphs.length === 0) return null;

  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50/50">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <IconVolume className="h-4 w-4 text-teal-600" />
          <div>
            <span className="text-sm font-medium text-stone-900">{label}</span>
            <p className="text-[11px] text-stone-500">{paragraphs.length} 段落 · タップで訳・解説</p>
          </div>
        </div>
        <IconChevron className={`h-4 w-4 text-stone-400 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>

      {expanded && (
        <div className="space-y-2 border-t border-stone-100 px-3 pb-3 pt-3">
          {passage && (
            <div className="px-1 pb-1">
              <h3 className="text-sm font-semibold text-stone-900">{passage.title}</h3>
              {passage.subtitle && <p className="text-xs text-stone-500">{passage.subtitle}</p>}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setVisibleTranslations(new Set(paragraphs.map((_, i) => i)))
              }
              className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-medium text-teal-800 ring-1 ring-stone-200"
            >
              すべて訳を表示
            </button>
            <button
              type="button"
              onClick={() => setVisibleTranslations(new Set())}
              className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-medium text-stone-600 ring-1 ring-stone-200"
            >
              訳を隠す
            </button>
          </div>

          {paragraphs.map((para, index) => (
            <ExamParagraphBlock
              key={index}
              paragraph={para}
              index={index}
              sectionId={sectionId}
              source={`${sourceLabel} · 段落 ${index + 1}`}
              showTranslation={visibleTranslations.has(index)}
              isPlaying={speakingId === `${kind}-${sectionId}-${index}`}
              isLoading={loadingIndex === index}
              onPlay={() => void playParagraph(index)}
              onToggleTranslation={() => toggleTranslation(index)}
              onToast={showToast}
            />
          ))}
        </div>
      )}

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4">
          <p className="rounded-full bg-stone-900/90 px-4 py-2 text-sm text-white shadow-lg">{toast}</p>
        </div>
      )}
    </div>
  );
}
