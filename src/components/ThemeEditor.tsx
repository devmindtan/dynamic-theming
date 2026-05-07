import { useState, useRef } from "react";
import { X, Check, Download, Upload, Trash2, Plus, Copy, Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { ThemeConfig } from "../types/theme";

interface ThemeEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "browse" | "create" | "import";

function generateId() {
  return "custom-" + Math.random().toString(36).substring(2, 9);
}

const blankTheme: ThemeConfig = {
  id: "",
  name: "",
  description: "",
  author: "You",
  version: "1.0.0",
  colors: {
    bg: "#ffffff",
    bgSecondary: "#f5f5f5",
    bgTertiary: "#eeeeee",
    surface: "#ffffff",
    surfaceHover: "#f9f9f9",
    border: "#e0e0e0",
    borderLight: "#eeeeee",
    text: "#1a1a1a",
    textSecondary: "#555555",
    textMuted: "#999999",
    primary: "#3b82f6",
    primaryHover: "#2563eb",
    primaryLight: "#eff6ff",
    secondary: "#10b981",
    secondaryHover: "#059669",
    accent: "#f59e0b",
    accentHover: "#d97706",
    success: "#22c55e",
    warning: "#eab308",
    error: "#ef4444",
    shadow: "rgba(0,0,0,0.1)",
    overlay: "rgba(0,0,0,0.5)",
  },
  typography: {
    fontFamily: "system-ui, sans-serif",
    headingFont: "system-ui, sans-serif",
    fontSizeBase: "16px",
    fontSizeSm: "14px",
    fontSizeLg: "18px",
    fontSizeXl: "20px",
    fontSize2xl: "24px",
    fontSize3xl: "30px",
    lineHeight: "1.5",
    headingLineHeight: "1.2",
  },
  spacing: {
    unit: "8px",
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
};

export default function ThemeEditor({ isOpen, onClose }: ThemeEditorProps) {
  const { currentTheme, themes, setTheme, addTheme, removeTheme, exportTheme, importTheme } =
    useTheme();
  const [tab, setTab] = useState<Tab>("browse");
  const [newTheme, setNewTheme] = useState<ThemeConfig>({ ...blankTheme, id: generateId() });
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeColorSection, setActiveColorSection] = useState<string>("core");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = (id: string) => {
    const json = exportTheme(id);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `theme-${id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = (id: string) => {
    navigator.clipboard.writeText(exportTheme(id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    setImportError("");
    if (importTheme(importText)) {
      setImportText("");
      setTab("browse");
    } else {
      setImportError("Invalid theme JSON. Make sure it has id, name, and colors fields.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setImportText(text);
    };
    reader.readAsText(file);
  };

  const handleCreateTheme = () => {
    if (!newTheme.name.trim()) return;
    if (!newTheme.id.trim()) newTheme.id = generateId();
    addTheme(newTheme);
    setTheme(newTheme.id);
    setNewTheme({ ...blankTheme, id: generateId() });
    setTab("browse");
  };

  const colorSections: Record<string, { label: string; keys: (keyof ThemeConfig["colors"])[] }> = {
    core: {
      label: "Core",
      keys: ["bg", "bgSecondary", "bgTertiary", "surface", "surfaceHover"],
    },
    borders: {
      label: "Borders",
      keys: ["border", "borderLight"],
    },
    text: {
      label: "Text",
      keys: ["text", "textSecondary", "textMuted"],
    },
    brand: {
      label: "Brand",
      keys: ["primary", "primaryHover", "primaryLight", "secondary", "secondaryHover", "accent", "accentHover"],
    },
    semantic: {
      label: "Semantic",
      keys: ["success", "warning", "error"],
    },
    effects: {
      label: "Effects",
      keys: ["shadow", "overlay"],
    },
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 transition-opacity duration-300"
        style={{ backgroundColor: "var(--theme-colors-overlay)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[640px] sm:max-h-[85vh] z-50 flex flex-col rounded-xl overflow-hidden shadow-2xl"
        style={{
          backgroundColor: "var(--theme-colors-bg)",
          border: "1px solid var(--theme-colors-border)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: "var(--theme-colors-border)" }}
        >
          <div className="flex items-center gap-2">
            <Sparkles size={18} style={{ color: "var(--theme-colors-primary)" }} />
            <h2
              className="text-lg font-semibold transition-colors duration-300"
              style={{
                color: "var(--theme-colors-text)",
                fontFamily: "var(--theme-typography-headingFont)",
              }}
            >
              Theme Studio
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors duration-200"
            style={{ color: "var(--theme-colors-textMuted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--theme-colors-surfaceHover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex border-b shrink-0"
          style={{ borderColor: "var(--theme-colors-border)" }}
        >
          {(["browse", "create", "import"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-3 text-sm font-medium capitalize transition-all duration-200 relative"
              style={{
                color:
                  tab === t ? "var(--theme-colors-primary)" : "var(--theme-colors-textMuted)",
              }}
            >
              {t}
              {tab === t && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 transition-colors duration-300"
                  style={{ backgroundColor: "var(--theme-colors-primary)" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "browse" && (
            <div className="flex flex-col gap-3">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className="flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor:
                      currentTheme.id === theme.id
                        ? "var(--theme-colors-primaryLight)"
                        : "var(--theme-colors-surface)",
                    borderColor:
                      currentTheme.id === theme.id
                        ? "var(--theme-colors-primary)"
                        : "var(--theme-colors-border)",
                  }}
                  onClick={() => setTheme(theme.id)}
                  onMouseEnter={(e) => {
                    if (currentTheme.id !== theme.id) {
                      e.currentTarget.style.backgroundColor = "var(--theme-colors-surfaceHover)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentTheme.id !== theme.id) {
                      e.currentTarget.style.backgroundColor = "var(--theme-colors-surface)";
                    }
                  }}
                >
                  {/* Color swatches */}
                  <div className="flex gap-1 shrink-0">
                    {[theme.colors.primary, theme.colors.secondary, theme.colors.accent, theme.colors.bg].map(
                      (color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-md border"
                          style={{
                            backgroundColor: color,
                            borderColor: "var(--theme-colors-border)",
                          }}
                        />
                      )
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-medium text-sm transition-colors duration-300"
                        style={{ color: "var(--theme-colors-text)" }}
                      >
                        {theme.name}
                      </span>
                      {currentTheme.id === theme.id && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: "var(--theme-colors-primary)",
                            color: "var(--theme-colors-bg)",
                          }}
                        >
                          Active
                        </span>
                      )}
                    </div>
                    <p
                      className="text-xs mt-0.5 truncate transition-colors duration-300"
                      style={{ color: "var(--theme-colors-textMuted)" }}
                    >
                      {theme.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyJSON(theme.id);
                      }}
                      className="p-1.5 rounded-md transition-colors duration-200"
                      style={{ color: "var(--theme-colors-textMuted)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--theme-colors-surfaceHover)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                      title="Copy JSON"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExport(theme.id);
                      }}
                      className="p-1.5 rounded-md transition-colors duration-200"
                      style={{ color: "var(--theme-colors-textMuted)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--theme-colors-surfaceHover)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                      title="Download JSON"
                    >
                      <Download size={14} />
                    </button>
                    {!defaultThemeIds.includes(theme.id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTheme(theme.id);
                        }}
                        className="p-1.5 rounded-md transition-colors duration-200"
                        style={{ color: "var(--theme-colors-error)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--theme-colors-surfaceHover)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        title="Delete theme"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "create" && (
            <div className="flex flex-col gap-6">
              {/* Meta */}
              <div className="flex flex-col gap-3">
                <h3
                  className="text-sm font-semibold uppercase tracking-wider transition-colors duration-300"
                  style={{ color: "var(--theme-colors-textMuted)" }}
                >
                  Theme Info
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      className="text-xs font-medium mb-1 block transition-colors duration-300"
                      style={{ color: "var(--theme-colors-textSecondary)" }}
                    >
                      Name *
                    </label>
                    <input
                      value={newTheme.name}
                      onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors duration-200"
                      style={{
                        backgroundColor: "var(--theme-colors-surface)",
                        borderColor: "var(--theme-colors-border)",
                        color: "var(--theme-colors-text)",
                      }}
                      placeholder="My Theme"
                    />
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium mb-1 block transition-colors duration-300"
                      style={{ color: "var(--theme-colors-textSecondary)" }}
                    >
                      ID
                    </label>
                    <input
                      value={newTheme.id}
                      onChange={(e) => setNewTheme({ ...newTheme, id: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors duration-200"
                      style={{
                        backgroundColor: "var(--theme-colors-surface)",
                        borderColor: "var(--theme-colors-border)",
                        color: "var(--theme-colors-text)",
                      }}
                      placeholder="auto-generated"
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="text-xs font-medium mb-1 block transition-colors duration-300"
                    style={{ color: "var(--theme-colors-textSecondary)" }}
                  >
                    Description
                  </label>
                  <input
                    value={newTheme.description}
                    onChange={(e) => setNewTheme({ ...newTheme, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors duration-200"
                    style={{
                      backgroundColor: "var(--theme-colors-surface)",
                      borderColor: "var(--theme-colors-border)",
                      color: "var(--theme-colors-text)",
                    }}
                    placeholder="A brief description of your theme"
                  />
                </div>
              </div>

              {/* Colors */}
              <div className="flex flex-col gap-3">
                <h3
                  className="text-sm font-semibold uppercase tracking-wider transition-colors duration-300"
                  style={{ color: "var(--theme-colors-textMuted)" }}
                >
                  Colors
                </h3>

                {/* Color section tabs */}
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(colorSections).map(([key, { label }]) => (
                    <button
                      key={key}
                      onClick={() => setActiveColorSection(key)}
                      className="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200"
                      style={{
                        backgroundColor:
                          activeColorSection === key
                            ? "var(--theme-colors-primary)"
                            : "var(--theme-colors-surface)",
                        color:
                          activeColorSection === key
                            ? "var(--theme-colors-bg)"
                            : "var(--theme-colors-textSecondary)",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Color inputs */}
                <div className="grid grid-cols-2 gap-3">
                  {colorSections[activeColorSection].keys.map((key) => (
                    <div key={key} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={
                          newTheme.colors[key].startsWith("#")
                            ? newTheme.colors[key]
                            : "#000000"
                        }
                        onChange={(e) =>
                          setNewTheme({
                            ...newTheme,
                            colors: { ...newTheme.colors, [key]: e.target.value },
                          })
                        }
                        className="w-8 h-8 rounded-md border cursor-pointer shrink-0"
                        style={{ borderColor: "var(--theme-colors-border)" }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-medium transition-colors duration-300"
                          style={{ color: "var(--theme-colors-textSecondary)" }}
                        >
                          {key}
                        </p>
                        <p
                          className="text-xs font-mono transition-colors duration-300"
                          style={{ color: "var(--theme-colors-textMuted)" }}
                        >
                          {newTheme.colors[key]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div className="flex flex-col gap-3">
                <h3
                  className="text-sm font-semibold uppercase tracking-wider transition-colors duration-300"
                  style={{ color: "var(--theme-colors-textMuted)" }}
                >
                  Typography
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      className="text-xs font-medium mb-1 block transition-colors duration-300"
                      style={{ color: "var(--theme-colors-textSecondary)" }}
                    >
                      Body Font
                    </label>
                    <input
                      value={newTheme.typography.fontFamily}
                      onChange={(e) =>
                        setNewTheme({
                          ...newTheme,
                          typography: { ...newTheme.typography, fontFamily: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors duration-200"
                      style={{
                        backgroundColor: "var(--theme-colors-surface)",
                        borderColor: "var(--theme-colors-border)",
                        color: "var(--theme-colors-text)",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium mb-1 block transition-colors duration-300"
                      style={{ color: "var(--theme-colors-textSecondary)" }}
                    >
                      Heading Font
                    </label>
                    <input
                      value={newTheme.typography.headingFont}
                      onChange={(e) =>
                        setNewTheme({
                          ...newTheme,
                          typography: { ...newTheme.typography, headingFont: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors duration-200"
                      style={{
                        backgroundColor: "var(--theme-colors-surface)",
                        borderColor: "var(--theme-colors-border)",
                        color: "var(--theme-colors-text)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Border Radius */}
              <div className="flex flex-col gap-3">
                <h3
                  className="text-sm font-semibold uppercase tracking-wider transition-colors duration-300"
                  style={{ color: "var(--theme-colors-textMuted)" }}
                >
                  Border Radius
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {(["sm", "md", "lg", "xl", "full"] as const).map((size) => (
                    <div key={size} className="text-center">
                      <label
                        className="text-xs font-medium mb-1 block transition-colors duration-300"
                        style={{ color: "var(--theme-colors-textSecondary)" }}
                      >
                        {size}
                      </label>
                      <input
                        value={newTheme.borderRadius[size]}
                        onChange={(e) =>
                          setNewTheme({
                            ...newTheme,
                            borderRadius: {
                              ...newTheme.borderRadius,
                              [size]: e.target.value,
                            },
                          })
                        }
                        className="w-full px-2 py-1.5 rounded-md border text-xs text-center outline-none transition-colors duration-200"
                        style={{
                          backgroundColor: "var(--theme-colors-surface)",
                          borderColor: "var(--theme-colors-border)",
                          color: "var(--theme-colors-text)",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Create button */}
              <button
                onClick={handleCreateTheme}
                disabled={!newTheme.name.trim()}
                className="w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "var(--theme-colors-primary)",
                  color: "var(--theme-colors-bg)",
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = "var(--theme-colors-primaryHover)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--theme-colors-primary)";
                }}
              >
                <Plus size={16} />
                Create & Apply Theme
              </button>
            </div>
          )}

          {tab === "import" && (
            <div className="flex flex-col gap-4">
              <div>
                <h3
                  className="text-sm font-semibold mb-2 transition-colors duration-300"
                  style={{ color: "var(--theme-colors-text)" }}
                >
                  Import from JSON
                </h3>
                <p
                  className="text-xs mb-3 transition-colors duration-300"
                  style={{ color: "var(--theme-colors-textMuted)" }}
                >
                  Paste a theme JSON config or upload a .json file. The theme will be added to your
                  collection and can be activated from the Browse tab.
                </p>

                {/* File upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 rounded-lg border-2 border-dashed text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200"
                  style={{
                    borderColor: "var(--theme-colors-border)",
                    color: "var(--theme-colors-textSecondary)",
                    backgroundColor: "var(--theme-colors-surface)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--theme-colors-primary)";
                    e.currentTarget.style.color = "var(--theme-colors-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--theme-colors-border)";
                    e.currentTarget.style.color = "var(--theme-colors-textSecondary)";
                  }}
                >
                  <Upload size={16} />
                  Upload .json file
                </button>
              </div>

              {/* Text area */}
              <div>
                <label
                  className="text-xs font-medium mb-1 block transition-colors duration-300"
                  style={{ color: "var(--theme-colors-textSecondary)" }}
                >
                  Or paste JSON directly
                </label>
                <textarea
                  value={importText}
                  onChange={(e) => {
                    setImportText(e.target.value);
                    setImportError("");
                  }}
                  rows={10}
                  className="w-full px-3 py-2 rounded-lg border text-xs font-mono outline-none resize-none transition-colors duration-200"
                  style={{
                    backgroundColor: "var(--theme-colors-surface)",
                    borderColor: importError ? "var(--theme-colors-error)" : "var(--theme-colors-border)",
                    color: "var(--theme-colors-text)",
                  }}
                  placeholder='{"id": "my-theme", "name": "My Theme", "colors": {...}, ...}'
                />
                {importError && (
                  <p
                    className="text-xs mt-1 transition-colors duration-300"
                    style={{ color: "var(--theme-colors-error)" }}
                  >
                    {importError}
                  </p>
                )}
              </div>

              <button
                onClick={handleImport}
                disabled={!importText.trim()}
                className="w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "var(--theme-colors-primary)",
                  color: "var(--theme-colors-bg)",
                }}
              >
                <Upload size={16} />
                Import Theme
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const defaultThemeIds = ["midnight", "warm-sand", "ocean-breeze", "sakura", "neon-cyber"];
