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
        <h2 className="mb-3 text-sm font-medium text-stone-900">復習</h2>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-stone-300 text-teal-700"
            checked={settings.skipMasteredWhenReviewing !== false}
            onChange={(e) => update({ skipMasteredWhenReviewing: e.target.checked })}
          />
          <span className="text-sm leading-relaxed text-stone-700">
            「覚えた」にした問題を、次へ・前へ・続きからでスキップする
          </span>
        </label>
        <p className="mt-2 text-xs text-stone-500">
          問題一覧からはいつでも個別に開けます。
        </p>
      </section>

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
          聴解・全文読みの TTS 再生速度。音声は Google Cloud TTS（サービスアカウント JSON）を使用します。
        </p>
      </section>

      <section className="mb-6 rounded-2xl border border-stone-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-medium text-stone-900">API 設定（read-along と同じ）</h2>
        <ul className="list-inside list-disc space-y-2 text-xs leading-relaxed text-stone-600">
          <li>
            <span className="font-medium text-stone-800">GEMINI_API_KEY</span>
            … 単語・語彙・全文の日本語訳（AI 翻訳）
          </li>
          <li>
            <span className="font-medium text-stone-800">GOOGLE_APPLICATION_CREDENTIALS_JSON</span>
            … 読み上げ TTS 用のサービスアカウント JSON 全体（API キー AIza… ではない）
          </li>
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-stone-500">
          ローカルでは .env.local に JSON を貼るとき、値全体をシングルクォートで囲んでください。
          Vercel では変数に JSON をそのまま貼れます。うまく読めない場合は{" "}
          <span className="font-mono text-[10px]">GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64</span>{" "}
          に base64 エンコードした JSON を設定できます。
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
