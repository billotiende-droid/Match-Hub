export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "matchhub_theme";
const EVENT_NAME = "matchhub-theme-change";

const getPreferredTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "light";
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
};

export const getTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return getPreferredTheme();
};

export const applyTheme = (theme: ThemeMode) => {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  window.localStorage.setItem(STORAGE_KEY, theme);
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: theme }));
};

export const initTheme = () => {
  applyTheme(getTheme());
};

export const subscribeTheme = (listener: (theme: ThemeMode) => void) => {
  if (typeof window === "undefined") return () => {};

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<ThemeMode>;
    if (customEvent.detail === "light" || customEvent.detail === "dark") {
      listener(customEvent.detail);
      return;
    }
    listener(getTheme());
  };

  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
};
