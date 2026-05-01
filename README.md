# RavenGrid

Vrstvená CSS architektura postavená na nativních `@layer`. Design tokeny, moderní reset, CSS Grid,
Container Queries, dark mode, volitelná PostCSS pipeline. Bez JS frameworků, bez CSS závislostí třetích stran.

Extrahováno z osobního projektu [Ravenstern](https://ravenstern.com) — od začátku navrženo jako soběstačný systém.

---

## Co dostaneš

- **@layer kaskáda** — explicitní priorita, žádné `!important`
- **Design tokeny** — barvy, spacing, typografie, stíny, animace — vše definováno jednou
- **CSS Grid** — fixed columns, auto-fit, holy grail, sidebar, dashboard layouts
- **Container Queries** — komponenty reagující na svého rodiče, ne na viewport
- **Dark mode** — automatický (`prefers-color-scheme`) + manuální přepínač (`[data-theme]`)
- **PostCSS pipeline** — volitelná, `postcss-import` + `cssnano` pro produkci
- **BEM naming** — předvídatelné, čitelné selektory
- **Přístupnost** — focus-visible, sr-only, prefers-reduced-motion

---

## Quick start

### Varianta A — přímé linkování

```html
<script src="static/js/theme-toggle.js"></script>  <!-- před CSS, kvůli dark mode flash -->
<link rel="stylesheet" href="static/css/index.css">
```

### Varianta B — PostCSS build

```bash
cd static
npm install
npm run dev      # watch mode, bez minifikace
npm run build    # produkce → dist/style.css
```

```html
<link rel="stylesheet" href="static/dist/style.css">
```

### Vlastní projektová vrstva

Vytvoř soubor mimo `@layer` — jeho pravidla automaticky přebijí vše z knihovny:

```css
/* _mujprojekt.css — MIMO @layer, vždy vyhraje */
:root {
  --color-primary: #7c3aed;  /* přepíšeš jakýkoli token */
}

.moje-komponenta { /* přepíšeš cokoli z _components.css */ }
```

Nalinkuj ho po `index.css`:

```html
<link rel="stylesheet" href="static/css/index.css">
<link rel="stylesheet" href="static/css/_mujprojekt.css">
```

---

## Struktura souborů

```
ravengrid/
├── index.html              ← Showcase landing page
├── CLAUDE.md               ← Instrukce pro Claude Code
├── README.md               ← Tento soubor
│
└── static/
    ├── package.json        ← PostCSS CLI + závislosti
    ├── postcss.config.js   ← PostCSS pipeline
    ├── js/
    │   └── theme-toggle.js ← Dark/light přepínač (vanilla JS)
    ├── css/
    │   ├── index.css           ← Entry point — @layer pořadí, responzivní utility
    │   ├── _tokens.css         ← Design tokeny (barvy, spacing, typografie, …)
    │   ├── _reset.css          ← Moderní CSS reset + base elementy
    │   ├── _fonts.css          ← Šablona pro font loading (@font-face)
    │   ├── _theme-toggle.css   ← [data-theme] overrides + toggle tlačítko
    │   ├── _grid.css           ← CSS Grid + flexbox utility třídy
    │   ├── _containers.css     ← Container Queries + komponenty (card, nav, form-grid)
    │   ├── _components.css     ← UI komponenty (btn, input, badge, alert, avatar, …)
    │   ├── _utilities.css      ← Helper utility třídy
    │   └── _project.css        ← Showcase vrstva — MIMO @layer, glassmorphism UI
    └── images/
        └── assets/
            ├── RA1.jpg         ← Pozaďová textura (showcase)
            └── ravenstern2.png ← Logo
```

---

## Architektura

### @layer kaskáda

Pořadí vrstev je deklarováno jednou v `index.css`:

```
reset → tokens → layout → components → utilities → prose
```

Nižší vrstva = nižší priorita. Cokoliv mimo `@layer` (tvůj projektový soubor) přebije vše bez `!important`.

| Vrstva | Soubor(y) | Obsah |
|---|---|---|
| `reset` | `_reset.css` | Browser normalizace, base elementy |
| `tokens` | `_tokens.css` | CSS custom properties — single source of truth |
| `layout` | `_grid.css`, `_containers.css` | Grid, flexbox, container queries |
| `components` | `_components.css`, `_theme-toggle.css` | Znovupoužitelné UI komponenty |
| `utilities` | `_utilities.css` | Single-purpose helper třídy |
| `prose` | `index.css` (inline) | Styly pro formátovaný obsah |
| *(mimo @layer)* | `_project.css` | Projektové overrides — vždy vyhrají |

### Kde co měnit

| Typ změny | Správný soubor |
|---|---|
| Token (spacing, barva, typografie, radius) | `_tokens.css` |
| Projektový token (glow, glass, portal) | `_project.css` |
| Sdílená UI komponenta (btn, badge, alert) | `_components.css` |
| Layout utility (.container, grid třídy) | `_grid.css` nebo `index.css` |
| Container query komponenta (card, nav) | `_containers.css` |
| Dark mode, theme-toggle tlačítko | `_theme-toggle.css` |
| Nová stránka / projektová vrstva | nový `_nazev.css` mimo @layer |

---

## Design tokeny

Všechny vizuální hodnoty jsou CSS custom properties v `_tokens.css`.
Přepisuješ je v projektovém souboru mimo `@layer`.

### Barvy

```css
/* Sémantické tokeny — používej tyto, ne primitivní hex hodnoty */
--color-primary           /* #3b82f6 — modrý akcent */
--color-primary-hover
--color-primary-light     /* focus ring pozadí */
--color-text-primary      /* hlavní text */
--color-text-secondary    /* popisky, metadata */
--color-bg-base           /* pozadí stránky */
--color-bg-subtle         /* lehce odlišené plochy */
--color-bg-muted          /* karty, sekce */
--color-border            /* standardní ohraničení */
--color-border-focus      /* focus ring */
--color-success / -bg / -fg
--color-warning / -bg / -fg
--color-error   / -bg / -fg / -hover / -focus
```

### Spacing

Základ 4px. Číselná škála + aliasy pro čitelnost:

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

### Typografie

```css
--font-sans / --font-serif / --font-mono
--text-xs → --text-6xl    /* 0.75rem → 3.75rem, modular scale ×1.25 */
--weight-light / normal / medium / semibold / bold / black
--leading-tight / snug / normal / relaxed / loose
--tracking-tight / normal / wide / wider / widest
```

### Animace

```css
--duration-fast / base / slow / slower    /* 100ms → 500ms */
--ease-out / ease-in / ease-in-out / ease-bounce

/* Skládej podle potřeby: */
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

Funguje ve dvou vrstvách:

**1. `_tokens.css` — systémová preference (automaticky)**
```css
@media (prefers-color-scheme: dark) {
  :root { /* přepíšou se sémantické barevné tokeny */ }
}
```

**2. `_theme-toggle.css` — manuální přepínač**
```css
[data-theme="dark"]  { /* stejné hodnoty jako media query */ }
[data-theme="light"] { /* explicitní světlé hodnoty */ }
```

`theme-toggle.js` se načítá v `<head>` *před* CSS aby se předešlo záblesku špatného tématu.
Priorita: `localStorage` → `prefers-color-scheme` → fallback `light`.

Tlačítko potřebuje `id="theme-toggle"` a ikony s třídami `.theme-toggle__icon--sun` a `.theme-toggle__icon--moon`.

---

## PostCSS pipeline

Volitelná — při vývoji lze linkovat soubory přímo. Pro produkci:

```bash
cd static
npm install
```

| Příkaz | Výstup | Poznámka |
|---|---|---|
| `npm run dev` | `dist/style.css` (watch) | Bez minifikace, zachovány komentáře |
| `npm run build` | `dist/style.css` + source map | Minifikace přes cssnano |
| `npm run build:clean` | Smaže `dist/`, pak build | Pro čistý produkční deployment |

**Pluginy:**
- `postcss-import` — spojí všechny `@import` do jednoho souboru
- `cssnano` — minifikace v produkci (`NODE_ENV=production`)

`cssnano` konfigurován s `mergeRules: false` (chrání `@layer` pořadí) a `reduceIdents: false` (zachovává názvy CSS custom properties).

---

## Browser support

| Funkce | Minimální podpora |
|---|---|
| CSS `@layer` | Chrome 99, Firefox 97, Safari 15.4 |
| Container Queries | Chrome 105, Firefox 110, Safari 16 |
| CSS subgrid | Chrome 117, Firefox 71, Safari 16 |
| `backdrop-filter` | Chrome 76, Firefox 103, Safari 9 (prefixed) |
| `100svh` | Chrome 108, Firefox 101, Safari 15.4 |

Cílová základna: prohlížeče z roku 2022 a novější.

---

## Licence

MIT — viz [LICENSE](LICENSE).
