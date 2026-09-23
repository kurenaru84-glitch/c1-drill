"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getActiveAudio,
  playAudioFromUrl,
  stopAllAudioPlayback,
} from "@/lib/audio-playback";
import { getSettings, saveSettings } from "@/lib/settings";
import { getParagraphAudio } from "@/lib/tts-client";
import {
  effectiveUtteranceRate,
  progressToSecond,
  seekPosition,
  totalDurationSec,
  type SpeechRate,
} from "@/lib/speech-utils";
import type { LearningLanguage } from "@/lib/types";
import { notifySpeakingId, stopSpeech, subscribeSpeechState } from "@/lib/use-speech";

type ParagraphInput = { index: number; original: string };

type Segment = {
  paragraphIndex: number;
  url: string;
  durationSec: number;
};

const PLAYER_ID = "full-player";

function pickVoice(languageId: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const prefix = languageId.split("-")[0] ?? languageId;
  return window.speechSynthesis.getVoices().find((v) => v.lang.startsWith(prefix)) ?? null;
}

function languageIdFor(language: LearningLanguage) {
  return language === "de" ? "de-DE" : "en-US";
}

export function useFullTextPlayer(
  docId: string,
  paragraphs: ParagraphInput[],
  language: LearningLanguage,
  onParagraphHighlight?: (index: number | null) => void
) {
  const languageId = languageIdFor(language);

  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progressSec, setProgressSec] = useState(0);
  const [rate, setRateState] = useState<SpeechRate>(() => getSettings().speechRate ?? 1);
  const [usingCloud, setUsingCloud] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const segmentsRef = useRef<Segment[]>([]);
  const cloudReadyRef = useRef(false);
  const segmentIndexRef = useRef(0);
  const segmentOffsetRef = useRef(0);

  const paragraphIndexRef = useRef(0);
  const charOffsetRef = useRef(0);
  const playingRef = useRef(false);
  const rateRef = useRef(rate);
  const tickRef = useRef<number | null>(null);
  const playbackGenerationRef = useRef(0);

  const onParagraphHighlightRef = useRef(onParagraphHighlight);
  onParagraphHighlightRef.current = onParagraphHighlight;

  const [naturalTotalSec, setNaturalTotalSec] = useState(() => totalDurationSec(paragraphs, 1));

  const totalSec = naturalTotalSec / rate;
  const effectiveProgress = progressSec / rate;

  useEffect(() => {
    rateRef.current = rate;
    const audio = getActiveAudio();
    if (audio) audio.playbackRate = rate;
  }, [rate]);

  const clearTick = useCallback(() => {
    if (tickRef.current != null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const stopInternal = useCallback((keepPosition: boolean) => {
    playbackGenerationRef.current += 1;
    playingRef.current = false;
    setPlaying(false);
    clearTick();
    stopAllAudioPlayback();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (!keepPosition) {
      segmentIndexRef.current = 0;
      segmentOffsetRef.current = 0;
      paragraphIndexRef.current = 0;
      charOffsetRef.current = 0;
      setProgressSec(0);
      onParagraphHighlightRef.current?.(null);
    }
    notifySpeakingId(null);
  }, [clearTick]);

  const updateCloudProgress = useCallback(() => {
    const audio = getActiveAudio();
    let natural = 0;
    for (let i = 0; i < segmentIndexRef.current; i += 1) {
      natural += segmentsRef.current[i]?.durationSec ?? 0;
    }
    if (audio) natural += audio.currentTime;
    setProgressSec(natural);
  }, []);

  const playCloudSegmentRef = useRef<(segIdx: number, startAt?: number) => void>(() => {});

  const playCloudSegment = useCallback(
    (segIdx: number, startAt = 0) => {
      const seg = segmentsRef.current[segIdx];
      if (!seg) {
        stopInternal(false);
        return;
      }

      const generation = playbackGenerationRef.current + 1;
      playbackGenerationRef.current = generation;
      stopAllAudioPlayback();

      segmentIndexRef.current = segIdx;
      segmentOffsetRef.current = startAt;
      onParagraphHighlightRef.current?.(seg.paragraphIndex);
      notifySpeakingId(PLAYER_ID);
      playingRef.current = true;
      setPlaying(true);
      clearTick();
      tickRef.current = window.setInterval(updateCloudProgress, 200);

      void playAudioFromUrl(seg.url, {
        startAt,
        rate: rateRef.current,
        isStale: () => generation !== playbackGenerationRef.current || !playingRef.current,
        onEnded: () => {
          if (!playingRef.current || generation !== playbackGenerationRef.current) return;
          if (segIdx < segmentsRef.current.length - 1) {
            playCloudSegmentRef.current(segIdx + 1, 0);
          } else {
            stopInternal(false);
          }
        },
        onError: () => {
          if (playingRef.current && generation === playbackGenerationRef.current) {
            setError("音声の再生に失敗しました。");
            stopInternal(true);
          }
        },
      }).catch((err: unknown) => {
        if (generation !== playbackGenerationRef.current) return;
        const message = err instanceof Error ? err.message : "音声の再生に失敗しました。";
        setError(message);
        stopInternal(true);
      });
    },
    [clearTick, stopInternal, updateCloudProgress]
  );

  playCloudSegmentRef.current = playCloudSegment;

  const ensureCloudSegments = useCallback(async () => {
    if (cloudReadyRef.current && segmentsRef.current.length > 0) return true;

    setLoading(true);
    try {
      const segments: Segment[] = [];
      for (const para of paragraphs) {
        const { url, durationSec } = await getParagraphAudio(
          docId,
          para.index,
          para.original,
          language
        );
        segments.push({ paragraphIndex: para.index, url, durationSec });
      }
      segmentsRef.current = segments;
      cloudReadyRef.current = true;
      setNaturalTotalSec(segments.reduce((sum, seg) => sum + seg.durationSec, 0));
      setUsingCloud(true);
      return true;
    } catch {
      cloudReadyRef.current = false;
      segmentsRef.current = [];
      setUsingCloud(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, [docId, language, paragraphs]);

  const locateNaturalPosition = useCallback(
    (targetNatural: number) => {
      const total =
        segmentsRef.current.reduce((sum, seg) => sum + seg.durationSec, 0) || naturalTotalSec;
      const clamped = Math.max(0, Math.min(total, targetNatural));

      if (usingCloud && cloudReadyRef.current && segmentsRef.current.length > 0) {
        let accumulated = 0;
        for (let i = 0; i < segmentsRef.current.length; i += 1) {
          const dur = segmentsRef.current[i]?.durationSec ?? 0;
          if (accumulated + dur >= clamped || i === segmentsRef.current.length - 1) {
            return {
              clamped,
              segmentIndex: i,
              offset: Math.max(0, clamped - accumulated),
              paragraphIndex: segmentsRef.current[i]?.paragraphIndex ?? null,
            };
          }
          accumulated += dur;
        }
      }

      const pos = seekPosition(paragraphs, clamped / rateRef.current, rateRef.current);
      return {
        clamped,
        segmentIndex: pos.paragraphIndex,
        offset: 0,
        paragraphIndex: paragraphs[pos.paragraphIndex]?.index ?? null,
        charOffset: pos.charOffset,
      };
    },
    [naturalTotalSec, paragraphs, usingCloud]
  );

  const applyNaturalPosition = useCallback(
    (
      position: ReturnType<typeof locateNaturalPosition>,
      options?: { restartPlayback?: boolean }
    ) => {
      segmentIndexRef.current = position.segmentIndex;
      segmentOffsetRef.current = position.offset;
      if (position.charOffset != null) {
        paragraphIndexRef.current = position.segmentIndex;
        charOffsetRef.current = position.charOffset;
      }
      setProgressSec(position.clamped);
      onParagraphHighlightRef.current?.(position.paragraphIndex);

      if (options?.restartPlayback && playingRef.current) {
        playCloudSegment(position.segmentIndex, position.offset);
      }
    },
    [playCloudSegment]
  );

  const previewSeekNatural = useCallback(
    (targetNatural: number) => {
      applyNaturalPosition(locateNaturalPosition(targetNatural));
    },
    [applyNaturalPosition, locateNaturalPosition]
  );

  const commitSeekNatural = useCallback(
    (targetNatural: number) => {
      applyNaturalPosition(locateNaturalPosition(targetNatural), {
        restartPlayback: playingRef.current,
      });
    },
    [applyNaturalPosition, locateNaturalPosition]
  );

  const speakFromCurrent = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const pIdx = paragraphIndexRef.current;
    const para = paragraphs[pIdx];
    if (!para) {
      stopInternal(false);
      return;
    }

    const text = para.original.slice(charOffsetRef.current).trim();
    if (!text) {
      if (pIdx < paragraphs.length - 1) {
        paragraphIndexRef.current = pIdx + 1;
        charOffsetRef.current = 0;
        speakFromCurrent();
      } else {
        stopInternal(false);
      }
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageId;
    utterance.rate = effectiveUtteranceRate(rateRef.current);
    const voice = pickVoice(languageId);
    if (voice) utterance.voice = voice;

    onParagraphHighlightRef.current?.(para.index);

    utterance.onend = () => {
      if (!playingRef.current) return;
      if (pIdx < paragraphs.length - 1) {
        paragraphIndexRef.current = pIdx + 1;
        charOffsetRef.current = 0;
        speakFromCurrent();
      } else {
        stopInternal(false);
      }
    };

    utterance.onerror = () => {
      if (playingRef.current) stopInternal(true);
    };

    playingRef.current = true;
    setPlaying(true);
    notifySpeakingId(PLAYER_ID);
    window.speechSynthesis.speak(utterance);

    clearTick();
    tickRef.current = window.setInterval(() => {
      setProgressSec(
        progressToSecond(
          paragraphs,
          paragraphIndexRef.current,
          charOffsetRef.current,
          rateRef.current
        ) * rateRef.current
      );
    }, 200);
  }, [clearTick, languageId, paragraphs, stopInternal]);

  const play = useCallback(async () => {
    setError(null);
    stopSpeech();

    const cloudOk = await ensureCloudSegments();
    if (cloudOk) {
      playCloudSegment(segmentIndexRef.current, segmentOffsetRef.current);
      return;
    }

    speakFromCurrent();
  }, [ensureCloudSegments, playCloudSegment, speakFromCurrent]);

  const pause = useCallback(() => {
    if (usingCloud && cloudReadyRef.current) {
      updateCloudProgress();
      const audio = getActiveAudio();
      if (audio) segmentOffsetRef.current = audio.currentTime;
    }
    stopInternal(true);
  }, [stopInternal, updateCloudProgress, usingCloud]);

  const toggle = useCallback(() => {
    if (playingRef.current) pause();
    else void play();
  }, [pause, play]);

  const previewSeekRatio = useCallback(
    (ratio: number) => {
      const total =
        segmentsRef.current.reduce((sum, seg) => sum + seg.durationSec, 0) || naturalTotalSec;
      previewSeekNatural(total * Math.min(1, Math.max(0, ratio)));
    },
    [naturalTotalSec, previewSeekNatural]
  );

  const commitSeekRatio = useCallback(
    (ratio: number) => {
      const total =
        segmentsRef.current.reduce((sum, seg) => sum + seg.durationSec, 0) || naturalTotalSec;
      commitSeekNatural(total * Math.min(1, Math.max(0, ratio)));
    },
    [commitSeekNatural, naturalTotalSec]
  );

  const skip = useCallback(
    (deltaSec: number) => {
      commitSeekNatural(progressSec + deltaSec * rateRef.current);
    },
    [commitSeekNatural, progressSec]
  );

  const setRate = useCallback((next: SpeechRate) => {
    rateRef.current = next;
    setRateState(next);
    saveSettings({ speechRate: next });
    const audio = getActiveAudio();
    if (audio) audio.playbackRate = next;
  }, []);

  useEffect(() => {
    const loadVoices = () => pickVoice(languageId);
    loadVoices();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    }
    const unsub = subscribeSpeechState((id) => {
      if (id !== null && id !== PLAYER_ID && playingRef.current) {
        stopInternal(true);
      }
    });
    return () => {
      unsub();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      }
    };
  }, [languageId, stopInternal]);

  useEffect(() => {
    return () => {
      clearTick();
      stopInternal(true);
    };
  }, [clearTick, stopInternal]);

  // Reset only when switching articles or language — not on every parent re-render.
  useEffect(() => {
    cloudReadyRef.current = false;
    segmentsRef.current = [];
    setNaturalTotalSec(totalDurationSec(paragraphs, 1));
    segmentIndexRef.current = 0;
    segmentOffsetRef.current = 0;
    paragraphIndexRef.current = 0;
    charOffsetRef.current = 0;
    setProgressSec(0);
    setUsingCloud(true);
    setError(null);
    if (playingRef.current) stopInternal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- paragraphs content tied to docId
  }, [docId, language, stopInternal]);

  return {
    playing,
    loading,
    progressSec: effectiveProgress,
    totalSec,
    rate,
    usingCloud,
    error,
    play,
    pause,
    toggle,
    previewSeekRatio,
    commitSeekRatio,
    skip,
    setRate,
    stop: () => stopInternal(true),
  };
}
