"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { IconPlay } from "@/components/icons";
import { getLanguage } from "@/lib/languages";
import { useSettings } from "@/lib/use-settings";
import { useSpeech } from "@/lib/use-speech";
import { WordListQuiz } from "@/components/WordListQuiz";
import { useWordList } from "@/lib/use-word-list";

type Filter = "all" | "learning" | "learned";

export function WordListView() {
  const { settings, ready, update } = useSettings();
  const { entries, removeEntry, setLearned, translateNote } = useWordList();
  const { speak, speakingId } = useSpeech();
  const [filter, setFilter] = useState<Filter>("all");
  const [translatingIds, setTranslatingIds] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const requestedRef = useRef<Set<string>>(new Set());

  const languageEntries = useMemo(
    () => entries.filter((e) => e.language === settings.learningLanguage),
    [entries, settings.learningLanguage]
  );

  useEffect(() => {
    requestedRef.current.clear();
    setErrors({});
    setTranslatingIds(new Set());
  }, [settings.learningLanguage]);

  useEffect(() => {
    for (const entry of languageEntries) {
      if (entry.note.trim() || requestedRef.current.has(entry.id)) continue;
      requestedRef.current.add(entry.id);
      setTranslatingIds((prev) => new Set(prev).add(entry.id));
      void translateNote(entry.id, entry.term, entry.language).then((result) => {
        if (!result.ok) {
          setErrors((prev) => ({ ...prev, [entry.id]: result.error }));
        } else {
          setErrors((prev) => {
            const next = { ...prev };
            delete next[entry.id];
            return next;
          });
        }
      }).finally(() => {
        setTranslatingIds((prev) => {
          const next = new Set(prev);
          next.delete(entry.id);
          return next;
        });
      });
    }
  }, [languageEntries, translateNote]);

  const filtered = useMemo(() => {
    if (filter === "learning") return languageEntries.filter((e) => !e.learned);
    if (filter === "learned") return languageEntries.filter((e) => e.learned);
    return languageEntries;
  }, [languageEntries, filter]);

  if (!ready) return null;

  const lang = getLanguage(settings.learningLanguage);

  return (
    <main className="mx-auto max-w-lg px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900">単語リスト</h1>
        <p className="mt-1 text-sm text-stone-600">
          {lang.label} で保存したフレーズ（{languageEntries.length}件）
        </p>
        <p className="mt-1 text-xs text-stone-500">意味は追加時に自動で日本語訳されます</p>
      </header>

      <div className="mb-4 flex rounded-xl bg-stone-100 p-1">
        {(["en", "de"] as const).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => update({ learningLanguage: code })}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              settings.learningLanguage === code
                ? "bg-white text-teal-800 shadow-sm"
                : "text-stone-600"
            }`}
          >
            {getLanguage(code).label}
          </button>
        ))}
      </div>

      <WordListQuiz entries={languageEntries} />

      <div className="mb-4 flex gap-2">
        {(
          [
            ["all", "すべて"],
            ["learning", "学習中"],
            ["learned", "覚えた"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              filter === key ? "bg-teal-700 text-white" : "bg-stone-100 text-stone-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-200 p-8 text-center text-sm text-stone-500">
          {lang.label} の単語はまだありません。{lang.label} の文章を読んで、フレーズを長押し選択して追加してください。
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((entry) => {
            const translating = translatingIds.has(entry.id);
            return (
              <li
                key={entry.id}
                className="rounded-2xl border border-stone-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-stone-900">{entry.term}</p>
                    {translating ? (
                      <p className="mt-1 text-sm text-stone-400">意味を翻訳中…</p>
                    ) : entry.note ? (
                      <p className="mt-1 text-sm text-stone-600">{entry.note}</p>
                    ) : (
                      <p className="mt-1 text-sm text-amber-700">
                        {errors[entry.id] ?? "意味を取得できませんでした"}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-stone-400">{entry.source}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => speak(entry.term, lang.speechId, entry.id)}
                    className="rounded-full bg-stone-100 p-2 text-stone-700"
                    aria-label="読み上げ"
                  >
                    {speakingId === entry.id ? "⏸" : <IconPlay className="h-4 w-4" />}
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setLearned(entry.id, !entry.learned)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                      entry.learned
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {entry.learned ? "✓ 覚えた" : "覚えた"}
                  </button>
                  {!entry.note && !translating && (
                    <button
                      type="button"
                      onClick={() => {
                        setTranslatingIds((prev) => new Set(prev).add(entry.id));
                        void translateNote(entry.id, entry.term, entry.language)
                          .then((result) => {
                            if (!result.ok) {
                              setErrors((prev) => ({ ...prev, [entry.id]: result.error }));
                            } else {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next[entry.id];
                                return next;
                              });
                            }
                          })
                          .finally(() => {
                            setTranslatingIds((prev) => {
                              const next = new Set(prev);
                              next.delete(entry.id);
                              return next;
                            });
                          });
                      }}
                      className="rounded-lg px-3 py-1.5 text-xs text-teal-700 hover:bg-teal-50"
                    >
                      再翻訳
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeEntry(entry.id)}
                    className="rounded-lg px-3 py-1.5 text-xs text-stone-500 hover:bg-stone-50"
                  >
                    削除
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
