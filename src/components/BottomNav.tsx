"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconBook, IconList, IconSettings } from "@/components/icons";

const tabs = [
  { href: "/", label: "練習", match: (p: string) => p === "/" || (p.startsWith("/s/") && !p.includes("/q/")) },
  { href: "/word-list", label: "単語", match: (p: string) => p === "/word-list" },
  { href: "/progress", label: "進捗", match: (p: string) => p === "/progress" },
  { href: "/settings", label: "設定", match: (p: string) => p === "/settings" },
];

function readWordSelectOpen() {
  if (typeof document === "undefined") return false;
  return document.body.dataset.wordSelectOpen === "1";
}

export function BottomNav() {
  const pathname = usePathname();
  const [wordSelectOpen, setWordSelectOpen] = useState(false);

  useEffect(() => {
    setWordSelectOpen(readWordSelectOpen());
    const observer = new MutationObserver(() => setWordSelectOpen(readWordSelectOpen()));
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-word-select-open"] });
    return () => observer.disconnect();
  }, []);

  if (wordSelectOpen) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-200 bg-white/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="メインメニュー"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          const Icon =
            tab.label === "練習"
              ? IconBook
              : tab.label === "単語" || tab.label === "進捗"
                ? IconList
                : IconSettings;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-2.5 text-[10px] font-medium transition-colors ${
                active ? "text-teal-700" : "text-stone-500"
              }`}
            >
              <Icon className={`h-6 w-6 ${active ? "text-teal-600" : ""}`} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
