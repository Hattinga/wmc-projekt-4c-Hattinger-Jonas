// Theme-Handling (light / dark / system).
// Layout initialisiert beim Start, Settings schaltet um.

export function getStoredTheme() {
  if (typeof localStorage === 'undefined') return 'system';
  return localStorage.getItem('zw-theme') || 'system';
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  const systemDark =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const dark = theme === 'dark' || (theme === 'system' && systemDark);
  document.documentElement.classList.toggle('dark', dark);
}

export function setTheme(theme) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('zw-theme', theme);
  }
  applyTheme(theme);
}
