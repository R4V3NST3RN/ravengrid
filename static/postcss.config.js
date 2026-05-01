/* ==========================================================================
   postcss.config.js — PostCSS konfigurace
   ==========================================================================

   Co tento soubor dělá:
   ─────────────────────
   Řídí jak PostCSS zpracuje tvoje CSS soubory.
   Výsledkem je jeden optimalizovaný soubor dist/style.css.

   Pluginy:
     postcss-import  → spojí všechny @import do jednoho souboru
     cssnano         → minifikuje výstup (jen v produkci)

   Spuštění:
   ─────────
     npm run dev        → vývoj, sleduje změny, BEZ minifikace
     npm run build      → produkce, minifikovaný dist/style.css + sourcemap
     npm run build:clean → smaže dist/ a vytvoří znovu

   Výstup:
   ───────
     dist/style.css     → toto linkuješ v HTML projektu
     dist/style.css.map → sourcemap pro DevTools (vidíš původní soubory)

   Jak linkovat v HTML:
   ─────────────────────
     <link rel="stylesheet" href="dist/style.css">

   Poznámka k @layer:
   ──────────────────
   postcss-import zachovává @layer wrappery ze zdrojových souborů.
   Pořadí vrstev deklarované v index.css zůstane zachováno i po spojení.
   ========================================================================== */

module.exports = (ctx) => {
  const isProduction = ctx.env === 'production';

  return {
    plugins: {

      /* ── postcss-import ─────────────────────────────────────────────────
         Nahradí @import direktivy obsahem příslušných souborů.
         Výsledek: jeden CSS soubor místo 6 HTTP requestů.

         Důležité: musí být první plugin — ostatní pluginy pak vidí
         celý spojený kód, ne jen index.css s @import řádky.
         ──────────────────────────────────────────────────────────────── */
      'postcss-import': {},

      /* ── cssnano ────────────────────────────────────────────────────────
         Minifikuje výsledný CSS soubor:
         - Odstraní komentáře a bílé znaky
         - Zkrátí hodnoty (0px → 0, #ffffff → #fff...)
         - Sloučí duplicitní pravidla

         Aktivní POUZE v produkci (NODE_ENV=production).
         Ve vývoji (npm run dev) jsou komentáře zachovány → snadnější debug.
         ──────────────────────────────────────────────────────────────── */
      'cssnano': isProduction
        ? {
            preset: ['default', {
              /* Zachovat @layer deklarace — cssnano je někdy optimalizuje
                 způsobem který může změnit pořadí vrstev */
              mergeRules: false,
              /* Zachovat naše CSS custom properties (tokeny) */
              reduceIdents: false,
            }]
          }
        : false,

    }
  };
};
