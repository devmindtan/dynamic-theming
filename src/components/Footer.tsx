export default function Footer() {
  return (
    <footer
      className="border-t mt-12 transition-colors duration-300"
      style={{
        backgroundColor: "var(--theme-colors-bgSecondary)",
        borderColor: "var(--theme-colors-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4
              className="font-semibold text-sm mb-4 transition-colors duration-300"
              style={{
                color: "var(--theme-colors-text)",
                fontFamily: "var(--theme-typography-headingFont)",
              }}
            >
              Storecraft
            </h4>
            <p
              className="text-xs leading-relaxed transition-colors duration-300"
              style={{ color: "var(--theme-colors-textMuted)" }}
            >
              A theme-powered commerce demo. Switch themes, create your own, or import from JSON.
            </p>
          </div>
          <div>
            <h4
              className="font-semibold text-sm mb-4 transition-colors duration-300"
              style={{ color: "var(--theme-colors-text)" }}
            >
              Shop
            </h4>
            <ul className="space-y-2">
              {["Electronics", "Clothing", "Accessories", "Home"].map((item) => (
                <li key={item}>
                  <span
                    className="text-xs cursor-pointer transition-colors duration-200"
                    style={{ color: "var(--theme-colors-textMuted)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--theme-colors-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--theme-colors-textMuted)";
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4
              className="font-semibold text-sm mb-4 transition-colors duration-300"
              style={{ color: "var(--theme-colors-text)" }}
            >
              Themes
            </h4>
            <ul className="space-y-2">
              {["Browse Themes", "Create Custom", "Import JSON", "Export Config"].map((item) => (
                <li key={item}>
                  <span
                    className="text-xs cursor-pointer transition-colors duration-200"
                    style={{ color: "var(--theme-colors-textMuted)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--theme-colors-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--theme-colors-textMuted)";
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4
              className="font-semibold text-sm mb-4 transition-colors duration-300"
              style={{ color: "var(--theme-colors-text)" }}
            >
              About
            </h4>
            <ul className="space-y-2">
              {["How It Works", "Theme Schema", "GitHub", "License"].map((item) => (
                <li key={item}>
                  <span
                    className="text-xs cursor-pointer transition-colors duration-200"
                    style={{ color: "var(--theme-colors-textMuted)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--theme-colors-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--theme-colors-textMuted)";
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "var(--theme-colors-border)" }}
        >
          <p
            className="text-xs transition-colors duration-300"
            style={{ color: "var(--theme-colors-textMuted)" }}
          >
            Built with React + Vite. Themes powered by JSON configs.
          </p>
          <p
            className="text-xs transition-colors duration-300"
            style={{ color: "var(--theme-colors-textMuted)" }}
          >
            Current theme:{" "}
            <span style={{ color: "var(--theme-colors-primary)" }}>dynamic</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
