// Globaler Shared-State (Svelte 5 Runes)
function loadFromStorage(key, fallback) {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export const appState = $state({
  locale: loadFromStorage('zw-locale', 'de'),
  searchQuery: '',
  currentUser: loadFromStorage('zw-user', null),
});
