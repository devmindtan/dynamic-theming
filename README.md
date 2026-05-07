# Storecraft -- Dynamic Theme Engine

A runtime theming system for React that transforms the entire UI by injecting CSS custom properties from a JSON config. Switch themes instantly, create your own, or import from a file -- no rebuild, no page reload.

## What This Project Is About

The core feature of this project is the **Dynamic Theme Engine**. The e-commerce UI exists solely as a testbed to demonstrate how the theme system works in a real interface with diverse components (cards, sidebars, modals, forms, navigation).

The theme engine is not a simple light/dark toggle. It is a **data-driven CSS variable injection system** where a single JSON object defines every visual property -- colors, typography, spacing, border radius -- and the entire application re-renders in real-time when that object changes.

## How It Works

```
ThemeConfig (JSON)
    |
    v
flattenToCSSVars()  -->  CSS custom properties on :root
    |
    v
Components read  -->  style={{ color: "var(--theme-colors-text)" }}
```

1. A `ThemeConfig` JSON object defines the theme (24 colors, 9 typography props, 8 spacing values, 5 border radii)
2. `flattenToCSSVars()` recursively flattens it into `--theme-{section}-{key}` CSS variables
3. `applyTheme()` writes them all to `document.documentElement`
4. Every component reads from CSS variables via inline `style` props
5. Switching themes = replacing the CSS variables = instant UI transformation

## Theme Studio

Click the palette icon in the header to open the Theme Studio with three tabs:

### Browse

Switch between 5 built-in themes. Copy any theme's JSON to clipboard or download it as a `.json` file.

### Create

Build a custom theme with:

- Color pickers organized by category (Core, Borders, Text, Brand, Semantic, Effects)
- Typography inputs (body font, heading font)
- Border radius controls
- Name and description

Click "Create & Apply Theme" to add it to your collection and activate it.

### Import

Paste a theme JSON or upload a `.json` file. The system validates that `id`, `name`, and `colors` exist, then adds it to the theme collection.

## Built-in Themes

| Theme            | Vibe                       | Font Style                 | Border Radius  |
| ---------------- | -------------------------- | -------------------------- | -------------- |
| **Midnight**     | Dark navy, electric blue   | Inter (sans-serif)         | Moderate (8px) |
| **Warm Sand**    | Earthy terracotta, cozy    | Georgia (serif)            | Sharp (4px)    |
| **Ocean Breeze** | Coastal teal, seafoam      | DM Sans (sans-serif)       | Rounded (10px) |
| **Sakura**       | Blush pink, rose gold      | Noto Serif JP (serif)      | Moderate (8px) |
| **Neon Cyber**   | Cyberpunk, neon green/cyan | JetBrains Mono (monospace) | Sharp (2px)    |

## Theme JSON Structure

A complete theme config looks like this:

```json
{
  "id": "forest-night",
  "name": "Forest Night",
  "description": "Deep forest greens with warm amber accents",
  "author": "Designer",
  "version": "1.0.0",
  "colors": {
    "bg": "#0b1a0b",
    "bgSecondary": "#0f250f",
    "bgTertiary": "#153015",
    "surface": "#1a3a1a",
    "surfaceHover": "#224422",
    "border": "#2a5a2a",
    "borderLight": "#3a6a3a",
    "text": "#d4e8d4",
    "textSecondary": "#a0c8a0",
    "textMuted": "#6a9a6a",
    "primary": "#4ade80",
    "primaryHover": "#22c55e",
    "primaryLight": "#0a2a0a",
    "secondary": "#d97706",
    "secondaryHover": "#b45309",
    "accent": "#fbbf24",
    "accentHover": "#f59e0b",
    "success": "#22c55e",
    "warning": "#eab308",
    "error": "#ef4444",
    "shadow": "rgba(0, 0, 0, 0.3)",
    "overlay": "rgba(0, 0, 0, 0.6)"
  },
  "typography": {
    "fontFamily": "'Inter', system-ui, sans-serif",
    "headingFont": "'Inter', system-ui, sans-serif",
    "fontSizeBase": "16px",
    "fontSizeSm": "14px",
    "fontSizeLg": "18px",
    "fontSizeXl": "20px",
    "fontSize2xl": "24px",
    "fontSize3xl": "30px",
    "lineHeight": "1.5",
    "headingLineHeight": "1.2"
  },
  "spacing": {
    "unit": "8px",
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px",
    "2xl": "48px",
    "3xl": "64px"
  },
  "borderRadius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "xl": "16px",
    "full": "9999px"
  }
}
```

## Key Design Decisions

- **CSS variables, not CSS classes**: Variables can be read by any component at any nesting level without class propagation. They also support fallback values and work with `color-mix()` for transparency.
- **Inline styles, not Tailwind color classes**: Tailwind classes like `bg-white` are hardcoded at build time. Inline `style` with `var()` reads the live value at render time.
- **JSON as the config format**: JSON is universally parseable, easy to share, and can be stored in localStorage, databases, or files. No build step required.
- **Recursive flattening**: Adding a new property to ThemeConfig automatically creates its CSS variable. No manual wiring.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS (layout utilities only, not color classes)
- Lucide React (icons)
- localStorage (theme persistence)

## The E-commerce UI

The product grid, cart sidebar, hero banner, and header are demo components that exercise the theme system across different UI patterns. They are not the focus of this project -- they exist to prove that the theme engine works comprehensively.

See `dynamic-theme-engine/SKILL.md` for the full technical documentation of the theme system.
