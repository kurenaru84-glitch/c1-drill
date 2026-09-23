"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname.startsWith("/read/") || /\/s\/[^/]+\/q\//.test(pathname);

  return (
    <>
      <div className={hideNav ? "" : "pb-[calc(4.25rem+env(safe-area-inset-bottom))]"}>
        {children}
      </div>
      {!hideNav && <BottomNav />}
    </>
  );
}
