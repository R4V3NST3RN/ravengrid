/**
 * theme-toggle.js — Dark Mode Přepínač
 * =====================================
 *
 * Co tento skript dělá:
 * - Načte uložené téma z localStorage při startu stránky
 * - Přepíná data-theme atribut na <html> elementu
 * - Uloží volbu uživatele do localStorage (přetrvá mezi návštěvami)
 * - Pokud uživatel ještě nevybral, respektuje systémové nastavení
 *
 * Použití:
 * ────────
 * 1. Přidej do HTML (nejlépe v <head> před </head> pro zabránění bliknutí):
 *    <script src="js/theme-toggle.js"></script>
 *
 * 2. Přidej tlačítko do HTML:
 *    <button class="theme-toggle" id="theme-toggle" aria-label="Přepnout téma">
 *      <svg class="icon theme-toggle__icon theme-toggle__icon--sun">...</svg>
 *      <svg class="icon theme-toggle__icon theme-toggle__icon--moon">...</svg>
 *    </button>
 *
 * 3. Hotovo — skript si najde tlačítko podle id="theme-toggle" automaticky.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'theme';
  const DARK        = 'dark';
  const LIGHT       = 'light';

  /**
   * Zjistí preferované téma v tomto pořadí:
   * 1. Uložená volba v localStorage
   * 2. Systémové nastavení (prefers-color-scheme)
   * 3. Výchozí: light
   */
  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === DARK || stored === LIGHT) return stored;

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? DARK
      : LIGHT;
  }

  /**
   * Aplikuje téma na <html> element.
   * CSS pak reaguje přes [data-theme="dark"] selektor.
   */
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
  }

  /**
   * Přepne téma a uloží volbu.
   */
  function toggleTheme() {
    const current = document.documentElement.dataset.theme;
    const next    = current === DARK ? LIGHT : DARK;
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  /* ── Inicializace ───────────────────────────────────────────────────────── */

  // Aplikuj téma okamžitě (v <head>) → zabraňuje bliknutí při načtení
  applyTheme(getPreferredTheme());

  // Připoj event listener na tlačítko po načtení DOMu
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
    }
  });

  // Reaguj na změnu systémového nastavení (uživatel změní OS téma)
  // — jen pokud uživatel ještě nevybral manuálně
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', function (e) {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? DARK : LIGHT);
      }
    });

})();
