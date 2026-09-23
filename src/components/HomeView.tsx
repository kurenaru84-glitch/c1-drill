"use client";

import Link from "next/link";
import { CATEGORY_LABELS, FORMAT_LABELS, getLanguage } from "@/lib/languages";
import { useDocuments } from "@/lib/use-documents";
import { useSettings } from "@/lib/use-settings";

export function HomeView() {
  const { settings, ready, update } = useSettings();
  const { documents, loading } = useDocuments(settings.learningLanguage);

  if (!ready) {
    return (
      <main className="mx-auto max-w-lg px-4 py-8">
        <p className="text-sm text-stone-500">読み込み中…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900">ReadAlong</h1>
        <p className="mt-1 text-sm text-stone-600">対訳・音声・単語帳付きで長文を読む</p>
      </header>

      <div className="mb-6 flex rounded-xl bg-stone-100 p-1">
        {(["en", "de"] as const).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => update({ learningLanguage: lang })}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              settings.learningLanguage === lang
                ? "bg-white text-teal-800 shadow-sm"
                : "text-stone-600"
            }`}
          >
            {getLanguage(lang).label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-stone-500">文章を読み込み中…</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {documents.map((doc) => (
            <li key={doc.id}>
              <Link
                href={`/read/${doc.id}`}
                className="block rounded-2xl border border-stone-200 bg-white p-4 transition-colors active:bg-stone-50"
              >
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-800">
                    {CATEGORY_LABELS[doc.category]}
                  </span>
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                    {FORMAT_LABELS[doc.format]}
                  </span>
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-500">
                    {doc.wordCount} words
                  </span>
                </div>
                <h2 className="font-medium text-stone-900">{doc.titleJa}</h2>
                <p className="mt-1 text-sm text-stone-500">{doc.title}</p>
                {doc.lastReadAt && (
                  <p className="mt-2 text-xs text-teal-700">続きから読む →</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
