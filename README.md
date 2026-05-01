# RavenGrid

Layered CSS architecture built on native `@layer`. Design tokens, modern reset, CSS Grid,
Container Queries, dark mode, optional PostCSS pipeline. No JS frameworks, no third-party CSS dependencies.

Extracted from the personal project [Ravenstern](https://ravenstern.com) — designed as a self-contained system from the start.

---

## What you get

- **@layer cascade** — explicit priority, no `!important`
- **Design tokens** — colors, spacing, typography, shadows, animations — defined once
- **CSS Grid** — fixed columns, auto-fit, holy grail, sidebar, dashboard layouts
- **Container Queries** — components responding to their parent, not the viewport
- **Dark mode** — automatic (`prefers-color-scheme`) + manual toggle (`[data-theme]`)
- **PostCSS pipeline** — optional, `postcss-import` + `cssnano` for production
- **BEM naming** — predictable, readable selectors
- **Accessibility** — focus-visible, sr-only, prefers-reduced-motion

---

## Quick start

### Option A — direct linking

```html
<script src="static/js/theme-toggle.js"></script>  <!-- before CSS, to prevent dark mode flash -->
<link rel="stylesheet" href="static/css/index.css">
```

### Option B — PostCSS build

```bash
cd static
npm install
npm run dev      # watch mode, no minification
npm run build    # production → dist/style.css
```

```html
<link rel="stylesheet" href="static/dist/style.css">
```

### Custom project layer

Create a file outside `@layer` — its rules will automatically override everything from the library:

```css
/* _myproject.css — outside @layer, always wins */
:root {
  --color-primary: #7c3aed;  /* override any token */
}

.my-component { /* override anything from _components.css */ }
```

Link it after `index.css`:

```html
<link rel="stylesheet" href="static/css/index.css">
<link rel="stylesheet" href="static/css/_myproject.css">
```

---

## File structure

```
ravengrid/
├── index.html              ← Showcase landing page
├── CLAUDE.md               ← Claude Code instructions
├── README.md               ← This file
│
└── static/
    ├── package.json        ← PostCSS CLI + dependencies
    ├── postcss.config.js   ← PostCSS pipeline
    ├── js/
    │   └── theme-toggle.js ← Dark/light toggle (vanilla JS)
    ├── css/
    │   ├── index.css           ← Entry point — @layer order, responsive utilities
    │   ├── _tokens.css         ← Design tokens (colors, spacing, typography, …)
    │   ├── _reset.css          ← Modern CSS reset + base elements
    │   ├── _fonts.css          ← Font loading template (@font-face)
    │   ├── _theme-toggle.css   ← [data-theme] overrides + toggle button
    │   ├── _grid.css           ← CSS Grid + flexbox utility classes
    │   ├── _containers.css     ← Container Queries + components (card, nav, form-grid)
    │   ├── _components.css     ← UI components (btn, input, badge, alert, avatar, …)
    │   ├── _utilities.css      ← Helper utility classes
    │   └── _project.css        ← Showcase layer — outside @layer, glassmorphism UI
    └── images/
        └── assets/
            ├── RA1.jpg         ← Background texture (showcase)
            └── ravenstern2.png ← Logo
```

---

## Architecture

### @layer cascade

Layer order is declared once in `index.css`:

```
reset → tokens → layout → components → utilities → prose
```

Lower layers have lower priority. Anything outside `@layer` (your project file) overrides everything without `!important`.

| Layer | File(s) | Contents |
|---|---|---|
| `reset` | `_reset.css` | Browser normalization, base elements |
| `tokens` | `_tokens.css` | CSS custom properties — single source of truth |
| `layout` | `_grid.css`, `_containers.css` | Grid, flexbox, container queries |
| `components` | `_components.css`, `_theme-toggle.css` | Reusable UI components |
| `utilities` | `_utilities.css` | Single-purpose helper classes |
| `prose` | `index.css` (inline) | Styles for formatted content |
| *(outside @layer)* | `_project.css` | Project overrides — always win |

### Where to make changes

| Type of change | Correct file |
|---|---|
| Token (spacing, color, typography, radius) | `_tokens.css` |
| Project token (glow, glass, portal) | `_project.css` |
| Shared UI component (btn, badge, alert) | `_components.css` |
| Layout utility (.container, grid classes) | `_grid.css` or `index.css` |
| Container query component (card, nav) | `_containers.css` |
| Dark mode, theme-toggle button | `_theme-toggle.css` |
| New page / project layer | new `_name.css` outside @layer |

---

## Design tokens

All visual values are CSS custom properties in `_tokens.css`. Override them in your project file outside `@layer`.

### Colors

```css
/* Semantic tokens — use these, not raw hex values */
--color-primary           /* #3b82f6 — blue accent */
--color-primary-hover
--color-primary-light     /* focus ring background */
--color-text-primary      /* main text */
--color-text-secondary    /* labels, metadata */
--color-bg-base           /* page background */
--color-bg-subtle         /* slightly differentiated surfaces */
--color-bg-muted          /* cards, sections */
--color-border            /* standard border */
--color-border-focus      /* focus ring */
--color-success / -bg / -fg
--color-warning / -bg / -fg
--color-error   / -bg / -fg / -hover / -focus
```

### Spacing

4px base. Numeric scale + aliases for readability:

```css
--space-1:   0.25rem  /*  4px */
--space-2:   0.5rem   /*  8px */    /* ← --space-xs */
--space-3:   0.75rem  /* 12px */    /* ← --space-sm */
--space-4:   1rem     /* 16px */    /* ← --space-md  (base) */
--space-5:   1.25rem  /* 20px */
--space-6:   1.5rem   /* 24px */    /* ← --space-lg */
--space-7:   1.75rem  /* 28px */
--space-8:   2rem     /* 32px */    /* ← --space-xl */
--space-10:  2.5rem   /* 40px */
--space-12:  3rem     /* 48px */    /* ← --space-2xl */
--space-16:  4rem     /* 64px */    /* ← --space-3xl */
--space-20:  5rem     /* 80px */
--space-24:  6rem     /* 96px */
--space-32:  8rem     /* 128px */
```

### Typography

```css
--font-sans / --font-serif / --font-mono
--text-xs → --text-6xl    /* 0.75rem → 3.75rem, modular scale ×1.25 */
--weight-light / normal / medium / semibold / bold / black
--leading-tight / snug / normal / relaxed / loose
--tracking-tight / normal / wide / wider / widest
```

### Animations

```css
--duration-fast / base / slow / slower    /* 100ms → 500ms */
--ease-out / ease-in / ease-in-out / ease-bounce

/* Compose as needed: */
.btn   { transition: var(--transition-color), var(--transition-transform); }
.card  { transition: var(--transition-base); }
```

### Z-index stack

```css
/* -1 → 600 */
--z-below / base / raised / dropdown / sticky / overlay / modal / toast / tooltip
```

---

## Dark mode

Works in two layers:

**1. `_tokens.css` — system preference (automatic)**
```css
@media (prefers-color-scheme: dark) {
  :root { /* override semantic color tokens */ }
}
```

**2. `_theme-toggle.css` — manual toggle**
```css
[data-theme="dark"]  { /* same values as the media query */ }
[data-theme="light"] { /* explicit light values */ }
```

`theme-toggle.js` is loaded in `<head>` *before* CSS to prevent a flash of incorrect theme. Priority: `localStorage` → `prefers-color-scheme` → fallback `light`.

The button requires `id="theme-toggle"` and icons with classes `.theme-toggle__icon--sun` and `.theme-toggle__icon--moon`.

---

## PostCSS pipeline

Optional — during development you can link files directly. For production:

```bash
cd static
npm install
```

| Command | Output | Notes |
|---|---|---|
| `npm run dev` | `dist/style.css` (watch) | No minification, comments preserved |
| `npm run build` | `dist/style.css` + source map | Minified via cssnano |
| `npm run build:clean` | Deletes `dist/`, then builds | For a clean production deployment |

**Plugins:**
- `postcss-import` — bundles all `@import` statements into a single file
- `cssnano` — minification in production (`NODE_ENV=production`)

`cssnano` is configured with `mergeRules: false` (preserves `@layer` order) and `reduceIdents: false` (preserves CSS custom property names).

---

## Browser support

| Feature | Minimum support |
|---|---|
| CSS `@layer` | Chrome 99, Firefox 97, Safari 15.4 |
| Container Queries | Chrome 105, Firefox 110, Safari 16 |
| CSS subgrid | Chrome 117, Firefox 71, Safari 16 |
| `backdrop-filter` | Chrome 76, Firefox 103, Safari 9 (prefixed) |
| `100svh` | Chrome 108, Firefox 101, Safari 15.4 |

Target baseline: browsers from 2022 onwards.

---

## License

MIT — see [LICENSE](LICENSE).
