"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { IconChevron } from "@/components/icons";
import { FullTextPlayer } from "@/components/FullTextPlayer";
import { ParagraphBlock } from "@/components/ParagraphBlock";
import { updateReadingProgress } from "@/lib/db";
import { getLanguage } from "@/lib/languages";
import { unlockAudioPlayback } from "@/lib/audio-playback";
import { playParagraphAudio } from "@/lib/tts-client";
import { stopSpeech, useSpeech } from "@/lib/use-speech";
import type { ReadingDocument } from "@/lib/types";

type ReaderViewProps = {
  document: ReadingDocument;
};

export function ReaderView({ document: doc }: ReaderViewProps) {
  const { speak, speakingId } = useSpeech();
  const lang = getLanguage(doc.language);
  const [visibleTranslations, setVisibleTranslations] = useState<Set<number>>(new Set());
  const [activeParagraph, setActiveParagraph] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const [loadingParagraph, setLoadingParagraph] = useState<number | null>(null);
  const progressRef = useRef<number | null>(null);

  const playerParagraphs = useMemo(
    () => doc.paragraphs.map((p) => ({ index: p.index, original: p.original })),
    [doc.id, doc.paragraphs]
  );

  const handleParagraphHighlight = useCallback((index: number | null) => {
    setActiveParagraph(index);
  }, []);

  useEffect(() => {
    if (doc.lastParagraphIndex != null) {
      const el = document.getElementById(`para-${doc.lastParagraphIndex}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [doc.lastParagraphIndex]);

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  useEffect(() => {
    if (!speakingId?.startsWith("para-")) return;
    const index = Number(speakingId.replace("para-", ""));
    if (!Number.isNaN(index)) setActiveParagraph(index);
  }, [speakingId]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2000);
  }, []);

  function toggleTranslation(index: number) {
    setVisibleTranslations((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function showAllTranslations(show: boolean) {
    if (show) {
      setVisibleTranslations(new Set(doc.paragraphs.map((p) => p.index)));
    } else {
      setVisibleTranslations(new Set());
    }
  }

  async function playParagraph(index: number) {
    unlockAudioPlayback();

    const id = `para-${index}`;
    if (speakingId === id) {
      stopSpeech();
      setActiveParagraph(null);
      return;
    }
    const paragraph = doc.paragraphs[index];
    if (!paragraph) return;

    setActiveParagraph(index);
    setLoadingParagraph(index);
    try {
      await playParagraphAudio(doc.id, index, paragraph.original, doc.language, id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "音声の再生に失敗しました。";
      showToast(message);
      speak(paragraph.original, lang.speechId, id);
    } finally {
      setLoadingParagraph(null);
    }
  }

  function handleParagraphVisible(index: number) {
    if (progressRef.current === index) return;
    progressRef.current = index;
    void updateReadingProgress(doc.id, index);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-stone-50">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-2 px-4 py-3">
          <Link href="/" className="text-stone-500" aria-label="戻る">
            <IconChevron className="h-5 w-5 rotate-180" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold text-stone-900">{doc.titleJa}</h1>
            <p className="truncate text-xs text-stone-500">{doc.title}</p>
          </div>
        </div>

        <div className="mx-auto max-w-lg border-t border-stone-100 px-4 py-3">
          <FullTextPlayer
            docId={doc.id}
            paragraphs={playerParagraphs}
            language={doc.language}
            onParagraphHighlight={handleParagraphHighlight}
            onStopOthers={() => stopSpeech()}
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => showAllTranslations(true)}
              className="rounded-lg px-2 py-1 text-xs text-stone-600 hover:bg-stone-100"
            >
              訳と解説を全部表示
            </button>
            <button
              type="button"
              onClick={() => showAllTranslations(false)}
              className="rounded-lg px-2 py-1 text-xs text-stone-600 hover:bg-stone-100"
            >
              全部非表示
            </button>
          </div>
        </div>
      </header>

      <article className="mx-auto w-full max-w-lg flex-1 px-4 py-4 pb-8">
        {doc.paragraphs.map((paragraph) => (
          <ParagraphBlock
            key={paragraph.id}
            paragraph={paragraph}
            language={doc.language}
            source={doc.titleJa}
            showTranslation={visibleTranslations.has(paragraph.index)}
            highlighted={activeParagraph === paragraph.index}
            isPlaying={
              speakingId === `para-${paragraph.index}` || loadingParagraph === paragraph.index
            }
            onPlay={() => playParagraph(paragraph.index)}
            onToggle={() => toggleTranslation(paragraph.index)}
            onVisible={() => handleParagraphVisible(paragraph.index)}
            onToast={showToast}
          />
        ))}
      </article>

      {toast && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
