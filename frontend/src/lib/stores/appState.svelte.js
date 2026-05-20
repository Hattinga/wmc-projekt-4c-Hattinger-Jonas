// Globaler Shared-State (Svelte 5 Runes)
export const appState = $state({
  locale: 'de',        // 'de' | 'en'
  searchQuery: '',     // string
});
