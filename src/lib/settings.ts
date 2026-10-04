import type { AppSettings } from "@/lib/types";

const STORAGE_KEY = "c1-drill-settings";

const DEFAULTS: AppSettings = {
  learningLanguage: "de",
  fontSize: "md",
  speechRate: 1,
  skipMasteredWhenReviewing: true,
};

export function getSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    return DEFAULTS;
  }
}

export function saveSettings(next: Partial<AppSettings>) {
  const merged = { ...getSettings(), ...next };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  return merged;
}
