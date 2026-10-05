"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { LearningLanguage } from "@/lib/types";
import { useWordList } from "@/lib/use-word-list";

type SelectableTextProps = {
  text: string;
  language: LearningLanguage;
  source: string;
  className?: string;
  onToast?: (message: string) => void;
};

function estimateRows(text: string) {
  const lines = text.split("\n").length;
  return Math.min(14, Math.max(2, lines + Math.ceil(text.length / 48)));
}

export function SelectableText({
  text,
  language,
  source,
  className = "",
  onToast,
}: SelectableTextProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const selectionTimerRef = useRef<number | null>(null);
  const textRef = useRef(text);
  const { entries, addEntry } = useWordList();
  const [selected, setSelected] = useState("");
  const [recentTerms, setRecentTerms] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  textRef.current = text;

  useEffect(() => setMounted(true), []);

  const savedInText = useMemo(() => {
    const fromList = entries
      .filter((e) => e.language === language && e.source === source)
      .map((e) => e.term);
    const terms = [...new Set([...fromList, ...recentTerms])];
    const lower = text.toLowerCase();
    return terms.filter((term) => lower.includes(term.toLowerCase()));
  }, [entries, language, source, recentTerms, text]);

  const readSelection = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    const { selectionStart, selectionEnd } = el;
    if (selectionStart === selectionEnd) {
      setSelected("");
      return;
    }

    const value = el.value.slice(selectionStart, selectionEnd).trim();
    setSelected(value && value.length <= 200 ? value : "");
  }, []);

  const scheduleSelectionCheck = useCallback(
    (delay = 120) => {
      if (selectionTimerRef.current) window.clearTimeout(selectionTimerRef.current);
      selectionTimerRef.current = window.setTimeout(() => {
        selectionTimerRef.current = null;
        readSelection();
      }, delay);
    },
    [readSelection]
  );

  useEffect(() => {
    if (selected) {
      document.body.dataset.wordSelectOpen = "1";
    } else {
      delete document.body.dataset.wordSelectOpen;
    }
    return () => {
      delete document.body.dataset.wordSelectOpen;
    };
  }, [selected]);

  useEffect(() => {
    const onSelectionChange = () => {
      const el = textareaRef.current;
      if (!el || document.activeElement !== el) return;
      scheduleSelectionCheck(0);
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", onSelectionChange);
      if (selectionTimerRef.current) window.clearTimeout(selectionTimerRef.current);
    };
  }, [scheduleSelectionCheck]);

  function lockValue(el: HTMLTextAreaElement) {
    if (el.value !== textRef.current) {
      el.value = textRef.current;
    }
  }

  function handleAdd() {
    if (!selected) return;
    const result = addEntry({ term: selected, language, source });
    if (result.ok) {
      setRecentTerms((prev) => (prev.includes(selected) ? prev : [...prev, selected]));
    }
    onToast?.(result.ok ? "単語リストに追加しました" : "すでに登録済みです");
    textareaRef.current?.setSelectionRange(0, 0);
    setSelected("");
  }

  function keepSelection(event: React.SyntheticEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  const preview = selected.length > 36 ? `${selected.slice(0, 36)}…` : selected;

  const popup =
    selected && mounted ? (
      <div
        className="fixed inset-x-0 top-0 z-[9999] border-b border-stone-200 bg-white px-4 py-3 shadow-lg"
        data-add-word-popup
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <p className="mb-2 line-clamp-2 text-xs text-stone-600">選択: {preview}</p>
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
    ) : null;

  return (
    <>
      {savedInText.length > 0 && (
        <p className="mb-1.5 text-[10px] leading-snug text-teal-700">
          登録済み: {savedInText.slice(0, 6).join(" · ")}
          {savedInText.length > 6 ? " …" : ""}
        </p>
      )}
      <p className="mb-1 text-[10px] text-stone-400">長押しで範囲選択 → 上のバーから追加</p>
      <textarea
        ref={textareaRef}
        aria-label="選択して単語リストに追加"
        defaultValue={text}
        rows={estimateRows(text)}
        className={`select-text w-full resize-none border-0 bg-transparent p-0 leading-relaxed outline-none [-webkit-tap-highlight-color:transparent] ${className}`}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        data-selectable-text
        onFocus={() => scheduleSelectionCheck(0)}
        onSelect={() => scheduleSelectionCheck(0)}
        onMouseUp={() => scheduleSelectionCheck(0)}
        onTouchEnd={() => scheduleSelectionCheck(450)}
        onKeyUp={() => scheduleSelectionCheck(0)}
        onInput={(e) => lockValue(e.currentTarget)}
        onChange={(e) => lockValue(e.currentTarget)}
        onKeyDown={(e) => {
          if (e.key === "a" && (e.metaKey || e.ctrlKey)) return;
          if (e.key === "c" && (e.metaKey || e.ctrlKey)) return;
          if (e.key.startsWith("Arrow") || e.key === "Shift") return;
          if (e.key.length === 1) e.preventDefault();
        }}
        onPaste={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
      />
      {popup && createPortal(popup, document.body)}
    </>
  );
}
