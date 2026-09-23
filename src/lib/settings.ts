import type { AppSettings } from "@/lib/types";

const STORAGE_KEY = "read-along-settings";

const DEFAULTS: AppSettings = {
  learningLanguage: "en",
  fontSize: "md",
  speechRate: 1,
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
