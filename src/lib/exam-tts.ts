"use client";

import {
  getActiveAudio,
  measureAudioDuration,
  playAudioFromUrl,
  stopAudioPlayback,
} from "@/lib/audio-playback";
import { db } from "@/lib/db";
import { fetchTtsAudio } from "@/lib/tts-client";
import { getSettings } from "@/lib/settings";
import { notifySpeakingId, stopSpeech } from "@/lib/use-speech";

function cacheKey(sectionId: string, kind: "passage" | "transcript", paragraphIndex: number) {
  return `c1-${sectionId}-${kind}-p${paragraphIndex}`;
}

function asAudioBlob(blob: Blob) {
  if (blob.type.startsWith("audio/")) return blob;
  return new Blob([blob], { type: "audio/mpeg" });
}

export async function getSectionParagraphAudio(
  sectionId: string,
  paragraphIndex: number,
  text: string,
  kind: "passage" | "transcript"
) {
  const id = cacheKey(sectionId, kind, paragraphIndex);
  const cached = await db.audioCache.get(id);

  if (cached) {
    const blob = asAudioBlob(cached.blob);
    const url = URL.createObjectURL(blob);
    const durationSec =
      cached.durationSec && cached.durationSec > 0
        ? cached.durationSec
        : await measureAudioDuration(url);

    if (!cached.durationSec && durationSec > 0) {
      await db.audioCache.update(id, { durationSec });
    }

    return { url, durationSec, fromCache: true };
  }

  const blob = await fetchTtsAudio(text, "de");
  const url = URL.createObjectURL(blob);
  const durationSec = await measureAudioDuration(url);

  await db.audioCache.put({
    id,
    docId: sectionId,
    paragraphIndex,
    language: "de",
    blob,
    durationSec,
    createdAt: Date.now(),
  });

  return { url, durationSec, fromCache: false };
}

export async function playSectionParagraphAudio(
  sectionId: string,
  paragraphIndex: number,
  text: string,
  kind: "passage" | "transcript",
  speakId: string
) {
  stopSpeech();
  const { url } = await getSectionParagraphAudio(sectionId, paragraphIndex, text, kind);
  const rate = getSettings().speechRate ?? 1;
  notifySpeakingId(speakId);

  try {
    const audio = await playAudioFromUrl(url, {
      rate,
      onEnded: () => {
        if (getActiveAudio() === audio) stopAudioPlayback();
        notifySpeakingId(null);
      },
      onError: () => {
        if (getActiveAudio() === audio) stopAudioPlayback();
        notifySpeakingId(null);
      },
    });
    return audio;
  } catch (error) {
    notifySpeakingId(null);
    throw error;
  }
}
