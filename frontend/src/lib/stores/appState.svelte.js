// TODO: Globaler Shared Rune Store für die gesamte App.
// Exportiert $state-Variablen:
//   currentUser  – eingeloggter User (null wenn nicht eingeloggt)
//   locale       – 'de' | 'en' (aus localStorage laden)
//   notes        – Array aller geladenen Notizen
//   activeNoteId – ID der aktuell geöffneten Notiz
//   wsConnected  – Boolean: Socket.io verbunden?
//   searchQuery  – aktueller Suchbegriff
