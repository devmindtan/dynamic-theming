---
name: dynamic-theme-engine
description: Runtime theming system that transforms the entire UI by injecting CSS custom properties from a JSON config object. Supports real-time theme switching, custom theme creation via visual editor, and import/export of theme configs as JSON files. No rebuild or page reload required.
---

# Dynamic Theme Engine

## Overview

A runtime theming engine that transforms the entire UI by injecting CSS custom properties from a JSON config. No rebuild, no page reload -- just swap the config object and every component updates instantly via `var(--theme-*)`.

This is NOT a CSS-class-based theming system (like Tailwind dark mode toggles). It is a **data-driven CSS variable injection system** where a single JSON object defines every visual property of the entire application.

## When to Use This Skill

- **Building a white-label/SaaS product** where each tenant needs a branded look
- **Creating a design system playground** where users can preview and tweak themes live
- **Adding user-customizable appearance** to any React app (like VS Code themes, Figma plugins)
- **Prototyping multiple brand directions** without maintaining separate CSS files
- **Building a theme marketplace** where users can share and import visual presets
- **Any project where the visual identity must change at runtime** without rebuilding

## When NOT to Use This Skill

- You only need a simple light/dark toggle (use CSS class toggling instead)
- You need SSR with theme-critical first paint (CSS variables flash on hydration)
- Your project uses CSS Modules or styled-components exclusively (this system relies on global CSS variables + inline styles)
- You need theme-specific layout changes (this system handles visual properties only, not component structure)

## Architecture

```
ThemeConfig (JSON/TS object)
    |
    v
flattenToCSSVars()  -->  { "--theme-colors-bg": "#0a0e1a", "--theme-colors-primary": "#3b82f6", ... }
    |
    v
applyTheme()  -->  document.documentElement.style.setProperty(key, value) for each var
    |
    v
Components use  -->  style={{ color: "var(--theme-colors-text)", backgroundColor: "var(--theme-colors-surface)" }}
```

The core insight: **a flat key-value map of CSS variables is the universal interface between any theme config and any component**. The `flattenToCSSVars` function recursively walks the nested ThemeConfig and produces `--theme-{section}-{key}` pairs. `applyTheme` writes them all to `:root`. Components read them via `var()`. This means:

- Adding a new property to ThemeConfig automatically creates its CSS variable (zero wiring)
- Any component can opt into theming by reading a variable (zero coupling to ThemeContext)
- Theme switching is O(n) where n = number of properties (typically ~50, trivially fast)

## ThemeConfig Schema

Every theme is a `ThemeConfig` object with this exact shape:

```typescript
interface ThemeConfig {
  id: string;            // unique slug, e.g. "midnight", "my-custom-theme"
  name: string;          // display name
  description: string;   // short description
  author: string;        // who made it
  version: string;       // semver, e.g. "1.0.0"
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
}
```

### ThemeColors (24 properties)

| Group | Keys | Purpose |
|-------|------|---------|
| Background | `bg`, `bgSecondary`, `bgTertiary` | Page-level backgrounds, darkest to lightest |
| Surface | `surface`, `surfaceHover` | Card/panel backgrounds |
| Border | `border`, `borderLight` | Border colors |
| Text | `text`, `textSecondary`, `textMuted` | Text hierarchy, highest to lowest contrast |
| Brand | `primary`, `primaryHover`, `primaryLight`, `secondary`, `secondaryHover`, `accent`, `accentHover` | Brand identity colors with hover/light variants |
| Semantic | `success`, `warning`, `error` | Status colors |
| Effects | `shadow`, `overlay` | Box-shadow color (can be rgba), modal overlay |

### ThemeTypography

| Key | Example | Purpose |
|-----|---------|---------|
| `fontFamily` | `'Inter', system-ui, sans-serif` | Body text font stack |
| `headingFont` | `'Georgia', serif` | Heading font stack (can differ from body) |
| `fontSizeBase` | `16px` | Root font size |
| `fontSizeSm` | `14px` | Small text |
| `fontSizeLg` | `18px` | Large text |
| `fontSizeXl` | `20px` | Extra large |
| `fontSize2xl` | `24px` | Section headings |
| `fontSize3xl` | `30px` | Page headings |
| `lineHeight` | `1.5` | Body line height |
| `headingLineHeight` | `1.2` | Heading line height |

### ThemeSpacing

8px base unit with a consistent scale:

`unit` (8px), `xs` (4px), `sm` (8px), `md` (16px), `lg` (24px), `xl` (32px), `2xl` (48px), `3xl` (64px)

### ThemeBorderRadius

`sm`, `md`, `lg`, `xl`, `full` (9999px for pills/circles)

## CSS Variable Naming Convention

The `flattenToCSSVars()` function recursively flattens the ThemeConfig into CSS variables using the pattern:

```
--theme-{section}-{key}
```

Examples:
- `ThemeConfig.colors.primary` --> `--theme-colors-primary`
- `ThemeConfig.typography.fontFamily` --> `--theme-typography-fontFamily`
- `ThemeConfig.spacing.md` --> `--theme-spacing-md`
- `ThemeConfig.borderRadius.lg` --> `--theme-borderRadius-lg`

**Any new property added to ThemeConfig automatically gets a CSS variable** -- no extra wiring needed.

## How to Use Theme Variables in Components

Every component uses inline `style` props with CSS variables. Never hardcode colors.

### Basic Usage

```tsx
// CORRECT -- uses theme variables
<div style={{
  backgroundColor: "var(--theme-colors-surface)",
  color: "var(--theme-colors-text)",
  borderColor: "var(--theme-colors-border)",
  fontFamily: "var(--theme-typography-fontFamily)",
}}>
```

```tsx
// WRONG -- hardcoded, won't change with theme
<div style={{
  backgroundColor: "#ffffff",
  color: "#1a1a1a",
}}>
```

### Hover/Interactive States

CSS variables can't be used in Tailwind's `hover:` prefix with inline styles. Use `onMouseEnter`/`onMouseLeave` instead:

```tsx
<button
  style={{ backgroundColor: "var(--theme-colors-primary)" }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "var(--theme-colors-primaryHover)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = "var(--theme-colors-primary)";
  }}
>
  Click me
</button>
```

### Conditional Styling Based on Theme

If you need to branch logic based on the active theme (e.g., different layouts for dark vs light), access the full theme object:

```tsx
const { currentTheme } = useTheme();
const isDark = currentTheme.colors.bg.startsWith("#0") || currentTheme.colors.bg.startsWith("#1");

return (
  <div style={{ opacity: isDark ? 0.9 : 1 }}>
    {/* conditional rendering based on theme characteristics */}
  </div>
);
```

### Fallback Values

CSS `var()` supports fallbacks for safety when a variable might not exist:

```tsx
style={{ color: "var(--theme-colors-text, #1a1a1a)" }}
```

### Using `color-mix()` for Transparency

For semi-transparent backgrounds (like a frosted header), use CSS `color-mix()`:

```tsx
style={{
  backgroundColor: "color-mix(in srgb, var(--theme-colors-bg) 85%, transparent)",
}}
```

### Using Theme Spacing and Border Radius

Spacing and border radius variables work the same way:

```tsx
<div style={{
  padding: "var(--theme-spacing-md)",       // 16px
  gap: "var(--theme-spacing-sm)",            // 8px
  borderRadius: "var(--theme-borderRadius-lg)", // 12px
}}>
```

## ThemeContext API

```typescript
const { currentTheme, themes, setTheme, addTheme, removeTheme, exportTheme, importTheme } = useTheme();
```

| Method | Signature | Behavior |
|--------|-----------|----------|
| `setTheme` | `(id: string) => void` | Switches to theme by ID, applies CSS vars, saves to localStorage |
| `addTheme` | `(theme: ThemeConfig) => void` | Adds or replaces theme by ID, persists custom themes |
| `removeTheme` | `(id: string) => void` | Deletes custom theme. Default themes are protected (no-op). If active theme is deleted, falls back to first default |
| `exportTheme` | `(id: string) => string` | Returns pretty-printed JSON string of the theme |
| `importTheme` | `(json: string) => boolean` | Parses JSON, validates `id`+`name`+`colors` exist, adds to collection. Returns success boolean |

## localStorage

| Key | What it stores |
|-----|---------------|
| `ecommerce-themes` | JSON array of custom themes only (defaults are always loaded from code) |
| `ecommerce-active-theme` | The `id` string of the currently active theme |

On load: default themes are merged with stored custom themes: `[...defaultThemes, ...customThemes]`.

## Adding a New Default Theme

1. Add the `ThemeConfig` object to the array in `src/data/themes.ts`
2. Add its `id` to the `defaultThemeIds` array in `src/components/ThemeEditor.tsx` (this protects it from deletion)
3. Done -- it appears in the Browse tab automatically

## Creating a Custom Theme at Runtime

Users can create themes three ways:

### 1. Via Theme Studio UI (Create tab)

- Fill in name, description
- Pick colors with native color pickers (organized by section: Core, Borders, Text, Brand, Semantic, Effects)
- Set typography and border radius
- Click "Create & Apply Theme" -- it's added to the collection and activated

### 2. Via JSON Import (Import tab)

- Paste JSON or upload a `.json` file
- Must have at minimum: `id`, `name`, `colors`
- System validates and adds to collection

### 3. Via Code

```typescript
const myTheme: ThemeConfig = {
  id: "my-theme",
  name: "My Theme",
  description: "Custom theme",
  author: "Me",
  version: "1.0.0",
  colors: {
    bg: "#1a1a2e",
    bgSecondary: "#16213e",
    bgTertiary: "#0f3460",
    surface: "#1a1a2e",
    surfaceHover: "#16213e",
    border: "#2a2a4a",
    borderLight: "#3a3a5a",
    text: "#e0e0ff",
    textSecondary: "#a0a0cc",
    textMuted: "#6060aa",
    primary: "#e94560",
    primaryHover: "#c73650",
    primaryLight: "#2a1520",
    secondary: "#0f3460",
    secondaryHover: "#0a2648",
    accent: "#f5c518",
    accentHover: "#d4a812",
    success: "#22c55e",
    warning: "#eab308",
    error: "#ef4444",
    shadow: "rgba(0, 0, 0, 0.3)",
    overlay: "rgba(0, 0, 0, 0.6)",
  },
  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",
    headingFont: "'Inter', system-ui, sans-serif",
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
addTheme(myTheme);
setTheme("my-theme");
```

## Exporting a Theme

Themes can be exported as JSON two ways:
- **Copy to clipboard**: `exportTheme(id)` returns a JSON string
- **Download as file**: Creates a Blob and triggers download as `theme-{id}.json`

The exported JSON is a complete `ThemeConfig` object that can be re-imported on any instance.

## Complete Theme JSON Example

Here is a minimal valid theme JSON that can be imported:

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

## Important Caveats

### 1. No Tailwind Color Classes

Never use Tailwind color utilities like `bg-white`, `text-gray-900`, `border-gray-200`. These are hardcoded and will NOT change with the theme. Always use inline `style` with `var(--theme-*)`.

```tsx
// BAD
<div className="bg-white text-gray-900 border-gray-200">

// GOOD
<div style={{
  backgroundColor: "var(--theme-colors-surface)",
  color: "var(--theme-colors-text)",
  borderColor: "var(--theme-colors-border)",
}}>
```

### 2. Hover States Require Event Handlers

Since we use inline styles (not CSS classes), Tailwind's `hover:` modifier doesn't work with CSS variables. You must use `onMouseEnter`/`onMouseLeave`:

```tsx
<button
  style={{ backgroundColor: "var(--theme-colors-primary)" }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = "var(--theme-colors-primaryHover)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = "var(--theme-colors-primary)";
  }}
>
```

### 3. Transition on Theme Switch

Add `transition-colors duration-300` (or similar) to elements that should animate when the theme changes. Without it, the switch is instant (which may be desired for some elements).

### 4. Color Picker Limitations

The HTML `<input type="color">` only supports hex colors (`#rrggbb`). For `shadow` and `overlay` which use `rgba()`, the color picker will show black. Users must type rgba values manually in the JSON import tab for these properties.

### 5. Font Loading

If a theme specifies a Google Font (e.g., `'Inter'`, `'DM Sans'`), the font must be loaded via `@import` in `index.css` or a `<link>` tag in `index.html`. Otherwise the browser falls back to the next font in the stack. The current project pre-loads Inter, DM Sans, and JetBrains Mono.

### 6. SSR/Hydration Flash

On server-side rendered apps, CSS variables are not available during the initial HTML render. The page will flash with fallback values before the theme is applied on the client. For SSR, consider inlining the theme in a `<style>` tag in the HTML `<head>`.

### 7. localStorage Size Limit

localStorage has a ~5MB limit. Each theme JSON is roughly 1-2KB, so you can store hundreds of custom themes before hitting the limit. However, if you store large base64 images in theme configs, you will hit the limit quickly.

### 8. Default Themes Are Immutable

The `removeTheme()` function is a no-op for default theme IDs. This is enforced by checking against the `defaultThemeIds` array. If you add a new default theme, you MUST add its ID to this array in `ThemeEditor.tsx`.

## File Structure

```
src/
  types/theme.ts          -- ThemeConfig, CartItem, Product interfaces
  data/themes.ts          -- defaultThemes array (5 built-in themes)
  data/products.ts        -- mock product data (not theme-related)
  context/ThemeContext.tsx -- ThemeProvider, useTheme(), flattenToCSSVars, applyTheme, localStorage
  context/CartContext.tsx  -- CartProvider, useCart() (not theme-related)
  components/ThemeEditor.tsx -- Theme Studio modal (Browse/Create/Import tabs)
  components/Header.tsx   -- Uses palette icon to open ThemeEditor
  components/*.tsx         -- All use var(--theme-*) for styling
  index.css              -- @import fonts, body uses var(--theme-*) with fallbacks
```

## Key Rules

1. **Never hardcode colors/fonts** -- always use `var(--theme-*)` in inline styles
2. **Every new component must use theme variables** -- no Tailwind color classes like `bg-white` or `text-gray-900`
3. **Hover states use onMouseEnter/onMouseLeave** -- not Tailwind `hover:` classes
4. **Default themes are immutable** -- `removeTheme()` is a no-op for default theme IDs
5. **Import validation requires `id`, `name`, `colors`** -- other sections fall back to defaults if missing
6. **CSS variables update in real-time** -- no rebuild or reload needed when switching themes
7. **The flattenToCSSVars function is the single source of truth** -- adding any new property to ThemeConfig automatically creates its CSS variable
8. **Always add transition classes** on elements that should animate during theme switches
