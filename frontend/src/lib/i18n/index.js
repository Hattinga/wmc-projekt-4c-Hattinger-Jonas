import de from './de.json';
import en from './en.json';
import { appState } from '../stores/appState.svelte.js';

const translations = { de, en };

/**
 * Übersetzt einen Schlüssel (Dot-Notation) in die aktuelle Sprache.
 * Beispiel: t('notes.newNote') → 'Neue Notiz' (DE)
 * Platzhalter: t('sidebar.deleteFolderConfirm', { name: 'Arbeit' }) ersetzt {name}.
 * Fallback: gibt den Schlüssel zurück wenn Übersetzung fehlt.
 */
export function t(key, params) {
  const locale = appState.locale;
  const dict = translations[locale] || translations.de;
  const result = key.split('.').reduce((obj, k) => obj?.[k], dict);
  if (typeof result === 'string' && params) {
    return result.replace(/\{(\w+)\}/g, (m, p) => params[p] ?? m);
  }
  return result ?? key;
}

/**
 * Setzt die Sprache und speichert sie in localStorage.
 */
export function setLocale(locale) {
  if (locale !== 'de' && locale !== 'en') return;
  appState.locale = locale;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('zw-locale', locale);
  }
}
