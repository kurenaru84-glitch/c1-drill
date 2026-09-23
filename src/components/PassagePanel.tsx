"use client";

import { useState } from "react";
import { IconChevron, IconPlay, IconPause, IconVolume } from "@/components/icons";
import { playSectionAudio } from "@/lib/exam-tts";
import { stopAudioPlayback } from "@/lib/audio-playback";
import { notifySpeakingId } from "@/lib/use-speech";
import type { Passage } from "@/lib/exam-types";

type Props = {
  sectionId: string;
  passage?: Passage;
  transcript?: string;
  defaultOpen?: boolean;
};

export function PassagePanel({ sectionId, passage, transcript, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const text = transcript ?? passage?.body;
  const kind = transcript ? "transcript" : "passage";
  const label = transcript ? "音声テキスト（TTS）" : "本文";

  async function togglePlay() {
    if (!text) return;
    if (playing) {
      stopAudioPlayback();
      notifySpeakingId(null);
      setPlaying(false);
      return;
    }
    setLoading(true);
    try {
      await playSectionAudio(sectionId, text, kind, `section-${sectionId}-${kind}`);
      setPlaying(true);
    } catch {
      setPlaying(false);
    } finally {
      setLoading(false);
    }
  }

  if (!passage && !transcript) return null;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <IconVolume className="h-4 w-4 text-teal-600" />
          <span className="text-sm font-medium text-stone-900">{label}</span>
        </div>
        <IconChevron className={`h-4 w-4 text-stone-400 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-stone-100 px-4 pb-4 pt-3">
          {text && (
            <button
              type="button"
              onClick={togglePlay}
              disabled={loading}
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-800 disabled:opacity-50"
            >
              {playing ? <IconPause className="h-3.5 w-3.5" /> : <IconPlay className="h-3.5 w-3.5" />}
              {loading ? "読み込み中…" : playing ? "停止" : "▶ 音声再生"}
            </button>
          )}

          {passage && (
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-stone-900">{passage.title}</h3>
              {passage.subtitle && (
                <p className="text-xs text-stone-500">{passage.subtitle}</p>
              )}
            </div>
          )}

          <div className="max-h-64 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-stone-700">
            {passage?.body ?? transcript}
          </div>
        </div>
      )}
    </div>
  );
}
