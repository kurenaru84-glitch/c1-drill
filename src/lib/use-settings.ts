"use client";

import { useCallback, useEffect, useState } from "react";
import { getSettings, saveSettings } from "@/lib/settings";
import type { AppSettings } from "@/lib/types";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(getSettings);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
    setReady(true);
  }, []);

  const update = useCallback((next: Partial<AppSettings>) => {
    const merged = saveSettings(next);
    setSettings(merged);
    return merged;
  }, []);

  return { settings, ready, update };
}
