"use client";

import { resetAllProgress } from "@/lib/exam-progress";
import { useSettings } from "@/lib/use-settings";

export function SettingsView() {
  const { settings, update } = useSettings();

  function handleResetProgress() {
    if (confirm("すべての練習進捗をリセットしますか？")) {
      resetAllProgress();
      window.location.reload();
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900">設定</h1>
      </header>

      <section className="mb-6 rounded-2xl border border-stone-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-medium text-stone-900">音声速度（TTS）</h2>
        <div className="flex rounded-xl bg-stone-100 p-1">
          {(
            [
              [0.75, "0.75×"],
              [1, "1×"],
              [1.25, "1.25×"],
              [1.5, "1.5×"],
            ] as const
          ).map(([rate, label]) => (
            <button
              key={rate}
              type="button"
              onClick={() => update({ speechRate: rate })}
              className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                (settings.speechRate ?? 1) === rate
                  ? "bg-white text-teal-800 shadow-sm"
                  : "text-stone-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-stone-500">
          聴解セクションの TTS 再生速度。Google Cloud TTS を使用（.env.local 要設定）。
        </p>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-medium text-stone-900">進捗データ</h2>
        <p className="mb-3 text-sm text-stone-600">すべてのセクションの回答履歴を削除します。</p>
        <button
          type="button"
          onClick={handleResetProgress}
          className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          進捗をすべてリセット
        </button>
      </section>
    </main>
  );
}
