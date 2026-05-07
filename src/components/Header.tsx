import { Search, ShoppingCart, Palette, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenThemeEditor: () => void;
}

export default function Header({ searchQuery, onSearchChange, onOpenThemeEditor }: HeaderProps) {
  const { totalItems, toggleCart } = useCart();
  const { currentTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300"
      style={{
        backgroundColor: `color-mix(in srgb, var(--theme-colors-bg) 85%, transparent)`,
        borderColor: "var(--theme-colors-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors duration-300"
              style={{
                backgroundColor: "var(--theme-colors-primary)",
                color: "var(--theme-colors-bg)",
              }}
            >
              S
            </div>
            <span
              className="text-lg font-semibold hidden sm:block transition-colors duration-300"
              style={{
                color: "var(--theme-colors-text)",
                fontFamily: "var(--theme-typography-headingFont)",
              }}
            >
              Storecraft
            </span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 focus-within:ring-2"
              style={{
                backgroundColor: "var(--theme-colors-surface)",
                borderColor: "var(--theme-colors-border)",
                focusWithinRingColor: "var(--theme-colors-primary)",
              }}
            >
              <Search
                size={16}
                style={{ color: "var(--theme-colors-textMuted)" }}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm transition-colors duration-300"
                style={{
                  color: "var(--theme-colors-text)",
                  fontFamily: "var(--theme-typography-fontFamily)",
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenThemeEditor}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                color: "var(--theme-colors-textSecondary)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--theme-colors-surfaceHover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              title="Theme Editor"
            >
              <Palette size={20} />
            </button>

            <button
              onClick={toggleCart}
              className="relative p-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                color: "var(--theme-colors-textSecondary)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--theme-colors-surfaceHover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center transition-colors duration-300"
                  style={{
                    backgroundColor: "var(--theme-colors-primary)",
                    color: "var(--theme-colors-bg)",
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg md:hidden transition-all duration-200"
              style={{ color: "var(--theme-colors-textSecondary)" }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {mobileMenuOpen && (
          <div className="pb-4 md:hidden">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: "var(--theme-colors-surface)",
                borderColor: "var(--theme-colors-border)",
              }}
            >
              <Search size={16} style={{ color: "var(--theme-colors-textMuted)" }} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
                style={{
                  color: "var(--theme-colors-text)",
                  fontFamily: "var(--theme-typography-fontFamily)",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Active theme indicator */}
      <div
        className="h-0.5 transition-all duration-500"
        style={{ backgroundColor: "var(--theme-colors-primary)" }}
      />
    </header>
  );
}
