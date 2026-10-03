"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildSavedTermSegments } from "@/lib/highlight-saved-terms";
import type { LearningLanguage } from "@/lib/types";
import { useWordList } from "@/lib/use-word-list";

type SelectableTextProps = {
  text: string;
  language: LearningLanguage;
  source: string;
  className?: string;
  onToast?: (message: string) => void;
};

type SelectionAnchor = {
  text: string;
  top: number;
  left: number;
};

export function SelectableText({
  text,
  language,
  source,
  className = "",
  onToast,
}: SelectableTextProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const selectionTimerRef = useRef<number | null>(null);
  const { entries, addEntry } = useWordList();
  const [selection, setSelection] = useState<SelectionAnchor | null>(null);
  const [recentTerms, setRecentTerms] = useState<string[]>([]);

  const savedTerms = useMemo(() => {
    const fromList = entries
      .filter((e) => e.language === language && e.source === source)
      .map((e) => e.term);
    return [...new Set([...fromList, ...recentTerms])];
  }, [entries, language, source, recentTerms]);

  const segments = useMemo(
    () => buildSavedTermSegments(text, savedTerms),
    [text, savedTerms]
  );

  const updateSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      setSelection(null);
      return;
    }

    const root = rootRef.current;
    if (!root || !sel.anchorNode || !root.contains(sel.anchorNode)) {
      setSelection(null);
      return;
    }

    const value = sel.toString().trim();
    if (!value || value.length > 200) {
      setSelection(null);
      return;
    }

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      setSelection(null);
      return;
    }

    const margin = 8;
    const popupWidth = 220;
    let left = rect.left + rect.width / 2 - popupWidth / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - popupWidth - margin));
    const top = Math.min(rect.bottom + margin, window.innerHeight - 72);

    setSelection({ text: value, top, left });
  }, []);

  const scheduleSelectionCheck = useCallback(
    (delay = 120) => {
      if (selectionTimerRef.current) window.clearTimeout(selectionTimerRef.current);
      selectionTimerRef.current = window.setTimeout(() => {
        selectionTimerRef.current = null;
        updateSelection();
      }, delay);
    },
    [updateSelection]
  );

  useEffect(() => {
    if (selection) {
      document.body.dataset.wordSelectOpen = "1";
    } else {
      delete document.body.dataset.wordSelectOpen;
    }
    return () => {
      delete document.body.dataset.wordSelectOpen;
    };
  }, [selection]);

  useEffect(() => {
    const onScroll = () => {
      if (selection) scheduleSelectionCheck(0);
    };
    const onSelectionChange = () => scheduleSelectionCheck(80);
    window.addEventListener("scroll", onScroll, true);
    document.addEventListener("selectionchange", onSelectionChange);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, [selection, scheduleSelectionCheck]);

  function handleAdd() {
    if (!selection?.text) return;
    const term = selection.text;
    const result = addEntry({ term, language, source });
    if (result.ok) {
      setRecentTerms((prev) => (prev.includes(term) ? prev : [...prev, term]));
    }
    onToast?.(result.ok ? "単語リストに追加しました" : "すでに登録済みです");
    window.getSelection()?.removeAllRanges();
    setSelection(null);
  }

  function keepSelection(event: React.SyntheticEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  const preview =
    selection && selection.text.length > 28
      ? `${selection.text.slice(0, 28)}…`
      : selection?.text;

  return (
    <>
      <div
        ref={rootRef}
        data-selectable-text
        className={`select-text whitespace-pre-wrap leading-relaxed ${className}`}
        onMouseUp={() => scheduleSelectionCheck(0)}
        onTouchEnd={() => scheduleSelectionCheck(280)}
        onKeyUp={() => scheduleSelectionCheck(0)}
      >
        {segments.map((seg, i) =>
          seg.saved ? (
            <mark
              key={i}
              className="rounded-sm bg-teal-100/90 text-inherit decoration-clone"
            >
              {seg.text}
            </mark>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </div>

      {selection && (
        <div
          className="fixed z-[110] w-[220px] rounded-2xl border border-stone-200 bg-white p-2 shadow-lg"
          data-add-word-popup
          style={{
            top: selection.top,
            left: selection.left,
          }}
        >
          <p className="mb-1.5 line-clamp-2 text-[10px] leading-snug text-stone-500">
            「{preview}」
          </p>
          <button
            type="button"
            className="w-full rounded-xl bg-stone-900 px-3 py-2.5 text-xs font-medium text-white"
            onMouseDown={keepSelection}
            onTouchStart={keepSelection}
            onClick={(e) => {
              e.stopPropagation();
              handleAdd();
            }}
          >
            ＋ 単語リストに追加
          </button>
        </div>
      )}
    </>
  );
}
