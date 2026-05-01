# RavenGrid — CLAUDE.md

## Přehled projektu

**RavenGrid** je veřejný CSS framework extrahovaný z osobního projektu Ravenstern.
Vrstvená architektura na nativních `@layer`, design tokeny v `_tokens.css`,
Container Queries, dark mode, volitelná PostCSS pipeline. Bez JS frameworků,
bez CSS závislostí třetích stran.

Soubor `_project.css` (mimo `@layer`) je showcase vrstva — obsahuje tokeny
a komponenty pro demo landing page (`index.html`), nikoliv součást framework core.

---

## Struktura souborů

```
/
├── index.html              ← Showcase landing page
├── CLAUDE.md               ← Tento soubor
├── README.md               ← Dokumentace pro vývojáře
│
└── static/
    ├── package.json        ← PostCSS CLI + závislosti
    ├── postcss.config.js   ← postcss-import + cssnano
    ├── js/
    │   └── theme-toggle.js ← Dark/light přepínač, načítá se před CSS
    ├── css/
    │   ├── index.css           ← Entry point — @layer pořadí, responzivní utility
    │   ├── _tokens.css         ← Design tokeny — single source of truth
    │   ├── _reset.css          ← Moderní CSS reset + base elementy
    │   ├── _fonts.css          ← Šablona pro @font-face (vše zakomentováno)
    │   ├── _theme-toggle.css   ← [data-theme] overrides + toggle tlačítko
    │   ├── _grid.css           ← CSS Grid, flexbox, layout patterny
    │   ├── _containers.css     ← Container Queries + card/nav/form komponenty
    │   ├── _components.css     ← UI komponenty: btn, input, badge, alert, avatar
    │   ├── _utilities.css      ← Helper třídy: text, spacing, display, pozice
    │   └── _project.css        ← Showcase vrstva — MIMO @layer, glassmorphism UI
    └── images/
        └── assets/
            ├── RA1.jpg         ← Pozaďová textura (showcase)
            └── ravenstern2.png ← Logo / favicon
```

---

## CSS architektura — kde co měnit

### @layer priorita (od nejnižší po nejvyšší)

```
reset → tokens → layout → components → utilities → prose
                                                        ↑ (vše v @layer)
_project.css   (MIMO @layer — vždy přebije)
```

### Pravidlo výběru souboru

| Typ změny | Správný soubor |
|---|---|
| Token (spacing, barva, typografie, radius, stín) | `_tokens.css` |
| Projektový token (glow, glass-bg, portal-*) | `_project.css` |
| Sdílená UI komponenta (btn, badge, alert, avatar) | `_components.css` |
| Showcase komponenta (showcase-card, btn--portal, bg-stack) | `_project.css` |
| Layout utility (.container, .grid, .layout-*) | `_grid.css` |
| Responzivní utility (md:grid-cols-2 apod.) | `index.css` |
| Container query komponenta (card, nav, form-grid, stat-box) | `_containers.css` |
| Dark mode, theme-toggle tlačítko | `_theme-toggle.css` |
| Fonty, @font-face | `_fonts.css` |
| Nová stránka (projektová vrstva) | nový `_nazev-stranky.css` mimo @layer |

---

## Aktuální tokeny

### Spacing škála (`_tokens.css`)

```
--space-0:    0
--space-px:   1px
--space-0-5:  0.125rem  (  2px)
--space-1:    0.25rem   (  4px)
--space-2:    0.5rem    (  8px)   ← --space-xs
--space-3:    0.75rem   ( 12px)   ← --space-sm
--space-4:    1rem      ( 16px)   ← --space-md  (base)
--space-5:    1.25rem   ( 20px)
--space-6:    1.5rem    ( 24px)   ← --space-lg
--space-7:    1.75rem   ( 28px)
--space-8:    2rem      ( 32px)   ← --space-xl
--space-10:   2.5rem    ( 40px)
--space-12:   3rem      ( 48px)   ← --space-2xl
--space-16:   4rem      ( 64px)   ← --space-3xl
--space-20:   5rem      ( 80px)
--space-24:   6rem      ( 96px)
--space-32:   8rem      (128px)
```

**POZOR:** Pokud použiješ `var(--neexistující-token)` v shorthand vlastnosti jako `padding`,
**celá deklarace se zahodí** (CSS fallback na `initial`). Vždy ověř, že token existuje.

### Breakpointy (`index.css`)

| Název | Hodnota | Poznámka |
|---|---|---|
| (mobile first) | 0px | výchozí |
| `sm` | 640px | — |
| `md` | 768px | navýší `--text-base` na 1.0625rem |
| `lg` | 1024px | — |
| `xl` | 1280px | — |
| `2xl` | 1536px | — |

Responzivní utility třídy používají escapovaný colon: `.md\:grid-cols-2`, `.lg\:grid-cols-3`.

---

## Pravidla pro Claude Code

### Smíš
- Upravovat jakýkoli CSS soubor v `static/css/`
- Přidávat nové CSS soubory pro nové stránky / projektové vrstvy
- Upravovat `index.html` a jiné HTML soubory
- Číst a upravovat `CLAUDE.md` a `README.md`
- Spouštět git příkazy pro čtení stavu (`git status`, `git diff`, `git log`)
- Navrhovat commit messages, **ALE nespouštět `git commit` bez explicitního pokynu**

### Nesmíš
- Spouštět `git commit`, `git push`, `git merge`, `git rebase` bez explicitního pokynu
- Měnit `static/package.json` nebo `static/postcss.config.js` bez explicitního pokynu
- Instalovat npm balíčky bez explicitního pokynu
- Mazat existující soubory

---

## Workflow pro opravy

1. Přečti si relevantní CSS soubory (kontext je klíčový — neměň naslepo)
2. Identifikuj správný soubor dle tabulky výše
3. Proveď minimální cílenou změnu
4. Navrhni commit message ve formátu `typ(scope): popis`

### Typy commitů

| Typ | Kdy |
|---|---|
| `fix` | Oprava bugu |
| `feat` | Nová funkce |
| `refactor` | Přepis bez změny chování |
| `style` | Kosmetické CSS změny (barvy, spacing bez dopadu na layout) |
| `docs` | Změna dokumentace |

Příklady: `fix(tokens): add missing --space-7`, `feat(grid): add .layout-masonry`, `docs: rewrite README for RavenGrid`

---

## Aktivní stránky

| Soubor | CSS | Popis |
|---|---|---|
| `index.html` | `index.css` + `_project.css` | Showcase / hero portal |

---

## Kde jsou screenshoty / design reference

Screenshoty a vizuální reference se přikládají přímo do chatu při zadávání úkolů.
Claude Code pracuje s kódem a popisem, ne s uloženými referenčními obrázky.
