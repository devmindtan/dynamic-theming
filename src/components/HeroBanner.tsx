import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroBanner() {
  return (
    <section
      className="relative overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: "var(--theme-colors-bgSecondary)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 transition-colors duration-300"
            style={{
              backgroundColor: "var(--theme-colors-primaryLight)",
              color: "var(--theme-colors-primary)",
            }}
          >
            <Sparkles size={12} />
            Theme-Powered Commerce
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold leading-tight mb-4 transition-colors duration-300"
            style={{
              color: "var(--theme-colors-text)",
              fontFamily: "var(--theme-typography-headingFont)",
              lineHeight: "var(--theme-typography-headingLineHeight)",
            }}
          >
            Shop with{" "}
            <span style={{ color: "var(--theme-colors-primary)" }}>your style</span>
          </h1>

          <p
            className="text-lg mb-8 transition-colors duration-300"
            style={{
              color: "var(--theme-colors-textSecondary)",
              lineHeight: "var(--theme-typography-lineHeight)",
            }}
          >
            Every theme transforms the entire experience. Switch between curated designs or create
            your own -- all from a simple JSON config.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              className="px-6 py-3 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: "var(--theme-colors-primary)",
                color: "var(--theme-colors-bg)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--theme-colors-primaryHover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--theme-colors-primary)";
              }}
            >
              Browse Collection
              <ArrowRight size={16} />
            </button>
            <button
              className="px-6 py-3 rounded-lg font-semibold text-sm border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: "transparent",
                color: "var(--theme-colors-text)",
                borderColor: "var(--theme-colors-border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--theme-colors-primary)";
                e.currentTarget.style.color = "var(--theme-colors-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--theme-colors-border)";
                e.currentTarget.style.color = "var(--theme-colors-text)";
              }}
            >
              Customize Theme
            </button>
          </div>
        </div>
      </div>

      {/* Decorative gradient */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 70% 50%, var(--theme-colors-primary), transparent 70%)`,
        }}
      />
    </section>
  );
}
