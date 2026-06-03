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
  folders: [],
  tags: [],
  notes: [],
  wsConnected: false,
});

/** Zentraler Logout-Helper – räumt Token, User und State auf. */
export function logout() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('zw-token');
    localStorage.removeItem('zw-user');
  }
  appState.currentUser = null;
}

// Cross-Tab-Sync: Logout in Tab B wird in Tab A erkannt
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'zw-token' && e.newValue === null) {
      appState.currentUser = null;
    }
  });
}
