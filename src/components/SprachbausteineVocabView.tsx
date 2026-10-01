"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { StudyNotesPanel } from "@/components/StudyNotesPanel";
import { IconChevron } from "@/components/icons";
import { collectSprachbausteineVocab } from "@/lib/sprachbausteine-utils";
import { loadVocabJapanese } from "@/lib/sprachbausteine-vocab-ja";
import type { ExamSection } from "@/lib/exam-types";

type Props = {
  section: ExamSection;
};

export function SprachbausteineVocabView({ section }: Props) {
  const items = useMemo(() => collectSprachbausteineVocab(section), [section]);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [meaningJa, setMeaningJa] = useState<Record<string, string>>({});
  const [translating, setTranslating] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (items.length === 0) return;
    let cancelled = false;
    setTranslating(true);
    void loadVocabJapanese(section.id, items, (map) => {
      if (!cancelled) setMeaningJa({ ...map });
    }).finally(() => {
      if (!cancelled) setTranslating(false);
    });
    return () => {
      cancelled = true;
    };
  }, [section.id, items]);

  function toggle(term: string) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(term)) next.delete(term);
      else next.add(term);
      return next;
    });
  }

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2000);
  };

  const studyNotes = { chunks: [], grammar: [], vocabulary: items };

  return (
    <main className="mx-auto max-w-lg px-4 py-6 pb-8">
      <Link
        href={`/s/${section.id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-teal-700"
      >
        <IconChevron className="h-4 w-4 rotate-180" />
        エピソードメニュー
      </Link>

      <header className="mb-4">
        <h1 className="text-lg font-semibold text-stone-900">{section.title} · 語彙</h1>
        <p className="mt-1 text-sm text-stone-600">
          書籍の Wortschatz（{items.length} 件）。意味は日本語訳を自動表示（2回目以降はキャッシュ）。
        </p>
        {translating && (
          <p className="mt-2 text-xs text-teal-700">日本語訳を取得しています…</p>
        )}
      </header>

      {items.length === 0 ? (
        <p className="text-sm text-stone-500">このエピソードに語彙データがありません。</p>
      ) : (
        <>
          <ul className="mb-6 space-y-2">
            {items.map((item) => {
              const open = revealed.has(item.term);
              const ja = meaningJa[item.term];
              return (
                <li key={item.term}>
                  <button
                    type="button"
                    onClick={() => toggle(item.term)}
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-left active:bg-stone-50"
                  >
                    <p className="text-sm font-medium text-stone-900">{item.term}</p>
                    {open && (
                      <div className="mt-2 space-y-2 border-t border-stone-100 pt-2">
                        {ja ? (
                          <p className="text-sm leading-relaxed text-stone-800">
                            <span className="mr-1.5 text-[10px] font-medium text-teal-600">訳</span>
                            {ja}
                          </p>
                        ) : translating ? (
                          <p className="text-xs text-stone-400">訳を読み込み中…</p>
                        ) : null}
                        <p className="text-xs leading-relaxed text-stone-500">
                          <span className="mr-1 font-medium text-stone-400">DE</span>
                          {item.meaning}
                        </p>
                      </div>
                    )}
                    {!open && (
                      <p className="mt-1 text-xs text-teal-600">タップで意味を表示</p>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-4">
            <h2 className="mb-2 text-sm font-semibold text-stone-800">単語リストに追加</h2>
            <StudyNotesPanel
              notes={studyNotes}
              language="de"
              source={`${section.titleJa} · Wortschatz`}
              onToast={showToast}
            />
          </div>
        </>
      )}

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 top-14 z-50 flex justify-center px-4">
          <p className="rounded-full bg-stone-900 px-4 py-2 text-sm text-white shadow-lg">{toast}</p>
        </div>
      )}
    </main>
  );
}
