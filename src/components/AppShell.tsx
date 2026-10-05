"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { ensureBundledRichExplanationsLoaded } from "@/lib/bundled-rich-explanations";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    void ensureBundledRichExplanationsLoaded();
  }, []);
  const hideNav =
    pathname.startsWith("/read/") ||
    /\/s\/[^/]+\/q\//.test(pathname) ||
    /\/s\/[^/]+\/lesen\/?$/.test(pathname);

  return (
    <>
      <div className={hideNav ? "" : "pb-[calc(4.25rem+env(safe-area-inset-bottom))]"}>
        {children}
      </div>
      {!hideNav && <BottomNav />}
    </>
  );
}
