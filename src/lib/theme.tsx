import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";

export type ThemeMode = "system" | "light" | "dark";
type Resolved = "light" | "dark";

const STORAGE_KEY = "theme-mode";

const mediaDark = (): Resolved =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

async function detectSystem(): Promise<Resolved> {
  try {
    const r = await invoke<string>("system_theme");
    if (r === "dark" || r === "light") return r;
  } catch {}
  return mediaDark();
}

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  resolved: Resolved;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(
    () => (localStorage.getItem(STORAGE_KEY) as ThemeMode) ?? "system",
  );
  const [resolved, setResolved] = useState<Resolved>("light");

  const setMode = (m: ThemeMode) => {
    localStorage.setItem(STORAGE_KEY, m);
    setModeState(m);
  };

  useEffect(() => {
    let cancelled = false;
    let unlisten: (() => void) | undefined;

    const update = async () => {
      const next = mode === "system" ? await detectSystem() : mode;
      if (!cancelled) setResolved(next);
    };

    update();

    if (mode === "system") {
      listen<string>("system-theme-changed", (e) => {
        if (e.payload === "dark" || e.payload === "light") {
          setResolved(e.payload);
        } else {
          update();
        }
      }).then((fn) => {
        if (cancelled) fn();
        else unlisten = fn;
      });
    }

    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, [mode]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolved === "dark");
    getCurrentWindow()
      .setTheme(resolved)
      .catch(() => {});
  }, [resolved]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
