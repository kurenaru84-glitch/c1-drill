"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LearningLanguage } from "@/lib/types";
import { useWordList } from "@/lib/use-word-list";

type SelectableTextProps = {
  text: string;
  language: LearningLanguage;
  source: string;
  className?: string;
  onToast?: (message: string) => void;
};

function isTouchUi() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

function estimateRows(text: string) {
  const lines = text.split("\n").length;
  return Math.min(12, Math.max(2, lines + Math.ceil(text.length / 48)));
}

export function SelectableText({
  text,
  language,
  source,
  className = "",
  onToast,
}: SelectableTextProps) {
  const containerRef = useRef<HTMLTextAreaElement>(null);
  const selectionTimerRef = useRef<number | null>(null);
  const { addEntry } = useWordList();
  const [selected, setSelected] = useState("");
  const [touchUi, setTouchUi] = useState(false);

  const scheduleSelectionCheck = useCallback((delay = 120) => {
    if (selectionTimerRef.current) window.clearTimeout(selectionTimerRef.current);
    selectionTimerRef.current = window.setTimeout(() => {
      selectionTimerRef.current = null;
      const el = containerRef.current;
      if (!el) return;
      const { selectionStart, selectionEnd } = el;
      if (selectionStart === selectionEnd) {
        setSelected("");
        return;
      }
      const value = el.value.slice(selectionStart, selectionEnd).trim();
      setSelected(value && value.length <= 200 ? value : "");
    }, delay);
  }, []);

  useEffect(() => {
    setTouchUi(isTouchUi());
  }, []);

  useEffect(() => {
    if (selected && touchUi) {
      document.body.dataset.wordSelectOpen = "1";
    } else {
      delete document.body.dataset.wordSelectOpen;
    }
    return () => {
      delete document.body.dataset.wordSelectOpen;
    };
  }, [selected, touchUi]);

  function handleAdd() {
    if (!selected) return;
    const result = addEntry({ term: selected, language, source });
    onToast?.(result.ok ? "単語リストに追加しました" : "すでに登録済みです");
    containerRef.current?.setSelectionRange(0, 0);
    setSelected("");
  }

  function keepSelection(event: React.SyntheticEvent) {
    event.preventDefault();
  }

  const preview = selected.length > 36 ? `${selected.slice(0, 36)}…` : selected;

  return (
    <>
      <textarea
        ref={containerRef}
        readOnly
        aria-label="選択して単語リストに追加"
        value={text}
        rows={estimateRows(text)}
        className={`select-text w-full resize-none border-0 bg-transparent p-0 leading-relaxed outline-none [-webkit-tap-highlight-color:transparent] ${className}`}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        onSelect={() => scheduleSelectionCheck(0)}
        onTouchEnd={() => scheduleSelectionCheck(250)}
      />
      {selected && touchUi && (
        <div
          className="fixed inset-x-0 bottom-0 z-[100] border-t border-stone-200 bg-white px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.15)]"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <p className="mb-2 truncate text-xs text-stone-500">選択: {preview}</p>
          <button
            type="button"
            className="w-full rounded-full bg-stone-900 px-4 py-3.5 text-sm font-medium text-white"
            onMouseDown={keepSelection}
            onTouchStart={keepSelection}
            onClick={handleAdd}
          >
            ＋ 単語リストに追加
          </button>
        </div>
      )}
    </>
  );
}
