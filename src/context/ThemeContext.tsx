import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { ThemeConfig } from "../types/theme";
import { defaultThemes } from "../data/themes";

interface ThemeContextType {
  currentTheme: ThemeConfig;
  themes: ThemeConfig[];
  setTheme: (id: string) => void;
  addTheme: (theme: ThemeConfig) => void;
  removeTheme: (id: string) => void;
  exportTheme: (id: string) => string;
  importTheme: (json: string) => boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function flattenToCSSVars(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const varName = prefix ? `${prefix}-${key}` : `--theme-${key}`;
    if (typeof value === "object" && value !== null) {
      Object.assign(vars, flattenToCSSVars(value as Record<string, unknown>, varName));
    } else {
      vars[varName] = String(value);
    }
  }
  return vars;
}

function applyTheme(theme: ThemeConfig) {
  const root = document.documentElement;
  const cssVars = flattenToCSSVars(theme as unknown as Record<string, unknown>);
  for (const [key, value] of Object.entries(cssVars)) {
    root.style.setProperty(key, value);
  }
}

const STORAGE_KEY = "ecommerce-themes";
const ACTIVE_KEY = "ecommerce-active-theme";

function loadThemes(): { themes: ThemeConfig[]; activeId: string } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const activeId = localStorage.getItem(ACTIVE_KEY) || defaultThemes[0].id;
    const customThemes = stored ? JSON.parse(stored) : [];
    return {
      themes: [...defaultThemes, ...customThemes],
      activeId,
    };
  } catch {
    return { themes: defaultThemes, activeId: defaultThemes[0].id };
  }
}

function saveCustomThemes(themes: ThemeConfig[]) {
  const custom = themes.filter((t) => !defaultThemes.find((d) => d.id === t.id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { themes: initialThemes, activeId } = loadThemes();
  const [themes, setThemes] = useState<ThemeConfig[]>(initialThemes);
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(
    () => initialThemes.find((t) => t.id === activeId) || initialThemes[0]
  );

  useEffect(() => {
    applyTheme(currentTheme);
    localStorage.setItem(ACTIVE_KEY, currentTheme.id);
  }, [currentTheme]);

  const setTheme = useCallback(
    (id: string) => {
      const theme = themes.find((t) => t.id === id);
      if (theme) setCurrentTheme(theme);
    },
    [themes]
  );

  const addTheme = useCallback((theme: ThemeConfig) => {
    setThemes((prev) => {
      const filtered = prev.filter((t) => t.id !== theme.id);
      const next = [...filtered, theme];
      saveCustomThemes(next);
      return next;
    });
  }, []);

  const removeTheme = useCallback(
    (id: string) => {
      if (defaultThemes.find((t) => t.id === id)) return;
      setThemes((prev) => {
        const next = prev.filter((t) => t.id !== id);
        saveCustomThemes(next);
        return next;
      });
      if (currentTheme.id === id) {
        setCurrentTheme(defaultThemes[0]);
      }
    },
    [currentTheme]
  );

  const exportTheme = useCallback(
    (id: string) => {
      const theme = themes.find((t) => t.id === id);
      return theme ? JSON.stringify(theme, null, 2) : "";
    },
    [themes]
  );

  const importTheme = useCallback((json: string): boolean => {
    try {
      const theme = JSON.parse(json) as ThemeConfig;
      if (!theme.id || !theme.name || !theme.colors) return false;
      addTheme(theme);
      return true;
    } catch {
      return false;
    }
  }, [addTheme]);

  return (
    <ThemeContext.Provider
      value={{ currentTheme, themes, setTheme, addTheme, removeTheme, exportTheme, importTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
