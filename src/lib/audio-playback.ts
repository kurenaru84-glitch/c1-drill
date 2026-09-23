"use client";

let activeAudio: HTMLAudioElement | null = null;
let unlocked = false;
const allAudioElements = new Set<HTMLAudioElement>();

// Minimal silent MP3 for iOS/Safari audio unlock
const SILENT_MP3 =
  "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhAC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAhRScHmAAAAA=";

function trackAudio(audio: HTMLAudioElement) {
  allAudioElements.add(audio);
}

function untrackAudio(audio: HTMLAudioElement) {
  allAudioElements.delete(audio);
}

export function getActiveAudio() {
  return activeAudio;
}

export function registerAudio(audio: HTMLAudioElement) {
  if (activeAudio && activeAudio !== audio) {
    activeAudio.pause();
    activeAudio.onended = null;
    activeAudio.onerror = null;
  }
  activeAudio = audio;
  trackAudio(audio);
}

export function stopAudioPlayback() {
  stopAllAudioPlayback();
}

export function stopAllAudioPlayback() {
  for (const audio of allAudioElements) {
    audio.pause();
    audio.onended = null;
    audio.onerror = null;
    audio.removeAttribute("src");
    audio.load();
    untrackAudio(audio);
  }
  allAudioElements.clear();
  activeAudio = null;
}

/** Call synchronously inside a click/tap handler before any await. */
export function unlockAudioPlayback() {
  if (typeof window === "undefined" || unlocked) return;
  try {
    const audio = new Audio(SILENT_MP3);
    audio.setAttribute("playsinline", "true");
    void audio
      .play()
      .then(() => {
        audio.pause();
        unlocked = true;
      })
      .catch(() => {});
  } catch {
    // ignore
  }
}

function prepareAudioElement() {
  const audio = new Audio();
  audio.setAttribute("playsinline", "true");
  audio.preload = "auto";
  trackAudio(audio);
  return audio;
}

export function waitForAudioReady(audio: HTMLAudioElement, timeoutMs = 8000) {
  return new Promise<void>((resolve, reject) => {
    if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      resolve();
      return;
    }

    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("音声の読み込みがタイムアウトしました。"));
    }, timeoutMs);

    const onReady = () => {
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      reject(new Error("音声ファイルを読み込めませんでした。"));
    };

    const cleanup = () => {
      window.clearTimeout(timer);
      audio.removeEventListener("canplay", onReady);
      audio.removeEventListener("error", onError);
    };

    audio.addEventListener("canplay", onReady, { once: true });
    audio.addEventListener("error", onError, { once: true });
  });
}

export async function playAudioFromUrl(
  url: string,
  options?: {
    startAt?: number;
    rate?: number;
    onEnded?: () => void;
    onError?: () => void;
    isStale?: () => boolean;
  }
) {
  const audio = prepareAudioElement();
  if (options?.rate) audio.playbackRate = options.rate;
  registerAudio(audio);

  audio.src = url;
  audio.load();

  await waitForAudioReady(audio);

  if (options?.isStale?.()) {
    audio.pause();
    audio.onended = null;
    audio.onerror = null;
    untrackAudio(audio);
    if (activeAudio === audio) activeAudio = null;
    return audio;
  }

  if (options?.startAt && options.startAt > 0) {
    audio.currentTime = Math.min(options.startAt, audio.duration || options.startAt);
  }

  audio.onended = () => {
    untrackAudio(audio);
    if (activeAudio === audio) activeAudio = null;
    options?.onEnded?.();
  };
  audio.onerror = () => {
    untrackAudio(audio);
    if (activeAudio === audio) activeAudio = null;
    options?.onError?.();
  };

  if (options?.isStale?.()) {
    audio.pause();
    audio.onended = null;
    audio.onerror = null;
    untrackAudio(audio);
    if (activeAudio === audio) activeAudio = null;
    return audio;
  }

  await audio.play();
  return audio;
}

export function measureAudioDuration(url: string): Promise<number> {
  return new Promise((resolve) => {
    const audio = prepareAudioElement();
    const finish = (value: number) => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      untrackAudio(audio);
      resolve(value);
    };

    const timer = window.setTimeout(() => finish(0), 8000);

    audio.addEventListener(
      "loadedmetadata",
      () => {
        window.clearTimeout(timer);
        finish(Number.isFinite(audio.duration) ? audio.duration : 0);
      },
      { once: true }
    );
    audio.addEventListener(
      "error",
      () => {
        window.clearTimeout(timer);
        finish(0);
      },
      { once: true }
    );

    audio.src = url;
    audio.load();
  });
}
