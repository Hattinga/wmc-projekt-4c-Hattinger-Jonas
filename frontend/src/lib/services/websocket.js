// TODO: Socket.io Client-Logik.
// Verbindet sich mit PUBLIC_WS_URL, sendet JWT zur Authentifizierung.
// Lauscht auf Events:
//   'note:updated'  → aktualisiert notes[] im globalen $state
//   'note:deleted'  → entfernt Notiz aus notes[]
// Exportiert connect(), disconnect(), und wsConnected-Status.
