"use client";

import { IconPause, IconPlay } from "@/components/icons";
import { unlockAudioPlayback } from "@/lib/audio-playback";
import { formatTime, SPEECH_RATES } from "@/lib/speech-utils";
import { useFullTextPlayer } from "@/lib/use-full-text-player";
import type { LearningLanguage } from "@/lib/types";

type FullTextPlayerProps = {
  docId: string;
  paragraphs: Array<{ index: number; original: string }>;
  language: LearningLanguage;
  onParagraphHighlight?: (index: number | null) => void;
  onStopOthers?: () => void;
};

export function FullTextPlayer({
  docId,
  paragraphs,
  language,
  onParagraphHighlight,
  onStopOthers,
}: FullTextPlayerProps) {
  const player = useFullTextPlayer(docId, paragraphs, language, onParagraphHighlight);

  function handleToggle() {
    unlockAudioPlayback();
    if (!player.playing) onStopOthers?.();
    player.toggle();
  }

  function handleSeekPreview(e: React.SyntheticEvent<HTMLInputElement>) {
    player.previewSeekRatio(Number(e.currentTarget.value) / 1000);
  }

  function handleSeekCommit(e: React.SyntheticEvent<HTMLInputElement>) {
    unlockAudioPlayback();
    player.commitSeekRatio(Number(e.currentTarget.value) / 1000);
  }

  const progressRatio =
    player.totalSec > 0
      ? Math.min(1000, Math.round((player.progressSec / player.totalSec) * 1000))
      : 0;

  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-stone-700">全文を読み上げ</p>
        {player.usingCloud && (
          <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-medium text-teal-800">
            Neural2
          </span>
        )}
      </div>

      {player.loading && (
        <p className="mb-2 text-center text-[10px] text-stone-500">音声を準備中…（初回のみ）</p>
      )}

      {player.error && (
        <p className="mb-2 text-center text-[10px] text-red-600">{player.error}</p>
      )}

      <div className="mb-2 flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={1000}
          step={1}
          value={progressRatio}
          onInput={handleSeekPreview}
          onChange={handleSeekCommit}
          onPointerUp={handleSeekCommit}
          className="h-1.5 flex-1 cursor-pointer accent-teal-700"
          aria-label="再生位置"
        />
        <span className="shrink-0 text-[10px] tabular-nums text-stone-500">
          {formatTime(player.progressSec)} / {formatTime(player.totalSec)}
        </span>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => player.skip(-5)}
          disabled={player.loading}
          className="rounded-full bg-white px-3 py-2 text-xs font-medium text-stone-700 shadow-sm ring-1 ring-stone-200 disabled:opacity-50"
          aria-label="5秒戻る"
        >
          −5s
        </button>
        <button
          type="button"
          onClick={handleToggle}
          disabled={player.loading}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-700 text-white shadow-sm disabled:opacity-50"
          aria-label={player.playing ? "一時停止" : "再生"}
        >
          {player.playing ? <IconPause className="h-5 w-5" /> : <IconPlay className="h-5 w-5" />}
        </button>
        <button
          type="button"
          onClick={() => player.skip(5)}
          disabled={player.loading}
          className="rounded-full bg-white px-3 py-2 text-xs font-medium text-stone-700 shadow-sm ring-1 ring-stone-200 disabled:opacity-50"
          aria-label="5秒進む"
        >
          +5s
        </button>
      </div>

      <div className="mt-3 flex justify-center gap-1">
        {SPEECH_RATES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => player.setRate(r)}
            className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
              player.rate === r
                ? "bg-teal-700 text-white"
                : "bg-white text-stone-600 ring-1 ring-stone-200"
            }`}
          >
            {r}x
          </button>
        ))}
      </div>

      <p className="mt-2 text-center text-[10px] text-stone-400">
        段落の ▶ でも1文ずつ再生 · 2回目以降はキャッシュから即再生
      </p>
    </div>
  );
}
