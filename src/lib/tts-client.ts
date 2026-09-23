"use client";

import {
  getActiveAudio,
  measureAudioDuration,
  playAudioFromUrl,
  stopAudioPlayback,
} from "@/lib/audio-playback";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import type { LearningLanguage } from "@/lib/types";
import { notifySpeakingId, stopSpeech } from "@/lib/use-speech";

function cacheKey(docId: string, paragraphIndex: number) {
  return `v2-${docId}-p${paragraphIndex}`;
}

function asAudioBlob(blob: Blob) {
  if (blob.type.startsWith("audio/")) return blob;
  return new Blob([blob], { type: "audio/mpeg" });
}

export async function fetchTtsAudio(text: string, language: LearningLanguage) {
  const response = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "音声の取得に失敗しました。");
  }

  const blob = asAudioBlob(await response.blob());
  if (blob.size < 128) {
    throw new Error("音声データが空です。");
  }

  return blob;
}

export async function getParagraphAudio(
  docId: string,
  paragraphIndex: number,
  text: string,
  language: LearningLanguage
) {
  const id = cacheKey(docId, paragraphIndex);
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

  const blob = await fetchTtsAudio(text, language);
  const url = URL.createObjectURL(blob);
  const durationSec = await measureAudioDuration(url);

  await db.audioCache.put({
    id,
    docId,
    paragraphIndex,
    language,
    blob,
    durationSec,
    createdAt: Date.now(),
  });

  return { url, durationSec, fromCache: false };
}

export async function playParagraphAudio(
  docId: string,
  paragraphIndex: number,
  text: string,
  language: LearningLanguage,
  speakId: string
) {
  stopSpeech();
  const { url } = await getParagraphAudio(docId, paragraphIndex, text, language);
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
