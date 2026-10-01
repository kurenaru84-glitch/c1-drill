"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExamParagraphBlock } from "@/components/ExamParagraphBlock";
import { FullTextPlayer } from "@/components/FullTextPlayer";
import { IconChevron } from "@/components/icons";
import { unlockAudioPlayback } from "@/lib/audio-playback";
import { playSectionParagraphAudio } from "@/lib/exam-tts";
import { buildFilledPassage } from "@/lib/sprachbausteine-utils";
import { getLanguage } from "@/lib/languages";
import {
  getCachedPassageTranslations,
  loadPassageParagraphJapanese,
} from "@/lib/passage-translation-ja";
import { stopSpeech, useSpeech } from "@/lib/use-speech";
import type { ExamSection } from "@/lib/exam-types";

type Props = {
  section: ExamSection;
};

export function SprachbausteineLesenView({ section }: Props) {
  const filled = useMemo(() => buildFilledPassage(section), [section]);
  const docId = `${section.id}-filled`;
  const { speak, speakingId } = useSpeech();
  const lang = getLanguage("de");

  const [visibleTranslations, setVisibleTranslations] = useState<Set<number>>(new Set());
  const [translationsJa, setTranslationsJa] = useState<Record<number, string>>(() =>
    getCachedPassageTranslations(section.id)
  );
  const [translationLoading, setTranslationLoading] = useState<Set<number>>(new Set());
  const [translationErrors, setTranslationErrors] = useState<Record<number, string>>({});
  const [activeParagraph, setActiveParagraph] = useState<number | null>(null);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const translationInFlightRef = useRef(new Set<number>());

  const playerParagraphs = useMemo(
    () => filled?.paragraphs.map((p, index) => ({ index, original: p.original })) ?? [],
    [filled]
  );

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2000);
  }, []);

  useEffect(() => () => stopSpeech(), []);

  useEffect(() => {
    if (!filled) return;
    for (const index of visibleTranslations) {
      if (translationsJa[index]?.trim()) continue;
      if (translationInFlightRef.current.has(index)) continue;
      const para = filled.paragraphs[index];
      if (!para?.original) continue;

      translationInFlightRef.current.add(index);
      setTranslationLoading((prev) => new Set(prev).add(index));
      void loadPassageParagraphJapanese(section.id, index, para.original, para.translation)
        .then((ja) => {
          setTranslationsJa((prev) => ({ ...prev, [index]: ja }));
          setTranslationErrors((prev) => {
            const next = { ...prev };
            delete next[index];
            return next;
          });
        })
        .catch((error) => {
          const message =
            error instanceof Error ? error.message : "日本語訳の取得に失敗しました。";
          setTranslationErrors((prev) => ({ ...prev, [index]: message }));
        })
        .finally(() => {
          translationInFlightRef.current.delete(index);
          setTranslationLoading((prev) => {
            const next = new Set(prev);
            next.delete(index);
            return next;
          });
        });
    }
  }, [visibleTranslations, filled, section.id, translationsJa]);

  const handleParagraphHighlight = useCallback((index: number | null) => {
    setActiveParagraph(index);
  }, []);

  async function playParagraph(index: number) {
    if (!filled) return;
    const text = filled.paragraphs[index]?.original;
    if (!text) return;

    unlockAudioPlayback();
    const speakId = `passage-${docId}-${index}`;
    if (speakingId === speakId) {
      stopSpeech();
      setActiveParagraph(null);
      return;
    }

    setActiveParagraph(index);
    setLoadingIndex(index);
    try {
      await playSectionParagraphAudio(docId, index, text, "passage", speakId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "音声の再生に失敗しました。";
      showToast(message);
      speak(text, lang.speechId, speakId);
    } finally {
      setLoadingIndex(null);
    }
  }

  if (!filled) {
    return (
      <main className="mx-auto max-w-lg px-4 py-6">
        <p className="text-sm text-stone-600">本文がありません。</p>
      </main>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-stone-50">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-lg px-4 py-3">
          <Link
            href={`/s/${section.id}`}
            className="mb-2 inline-flex items-center gap-1 text-sm text-teal-700"
          >
            <IconChevron className="h-4 w-4 rotate-180" />
            エピソードメニュー
          </Link>
          <h1 className="text-lg font-semibold text-stone-900">{section.title}</h1>
          <p className="mt-0.5 text-xs text-stone-500">
            正解語は «…» 表示。下のプレイヤーで全文を連続再生できます。
          </p>
        </div>

        <div className="mx-auto max-w-lg border-t border-stone-100 px-4 py-3">
          <FullTextPlayer
            docId={docId}
            paragraphs={playerParagraphs}
            language="de"
            onParagraphHighlight={handleParagraphHighlight}
            onStopOthers={() => stopSpeech()}
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setVisibleTranslations(new Set(filled.paragraphs.map((_, i) => i)))}
              className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-medium text-teal-800 ring-1 ring-stone-200"
            >
              訳をすべて表示
            </button>
            <button
              type="button"
              onClick={() => setVisibleTranslations(new Set())}
              className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-medium text-stone-600 ring-1 ring-stone-200"
            >
              訳を隠す
            </button>
          </div>
        </div>
      </header>

      <article className="mx-auto w-full max-w-lg flex-1 space-y-2 px-4 py-4 pb-8">
        {filled.paragraphs.map((para, index) => (
          <div
            key={index}
            className={
              activeParagraph === index ? "rounded-2xl ring-2 ring-teal-400 ring-offset-2" : ""
            }
          >
            <ExamParagraphBlock
              paragraph={para}
              index={index}
              sectionId={docId}
              source={`${section.titleJa} · 全文`}
              showTranslation={visibleTranslations.has(index)}
              isPlaying={speakingId === `passage-${docId}-${index}`}
              isLoading={loadingIndex === index}
              onPlay={() => void playParagraph(index)}
              onToggleTranslation={() =>
                setVisibleTranslations((prev) => {
                  const next = new Set(prev);
                  if (next.has(index)) next.delete(index);
                  else next.add(index);
                  return next;
                })
              }
              onToast={showToast}
              translationText={translationsJa[index]}
              translationLoading={translationLoading.has(index)}
              translationError={translationErrors[index]}
            />
          </div>
        ))}
      </article>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <p className="rounded-full bg-stone-900 px-4 py-2 text-sm text-white shadow-lg">{toast}</p>
        </div>
      )}
    </div>
  );
}
