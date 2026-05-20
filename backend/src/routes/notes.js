// TODO: Notiz-CRUD-Routen (alle mit auth-Middleware)
// GET    /           – Alle Notizen des Users (filter: folderId, search, tag)
// GET    /:id        – Einzelne Notiz mit Tags
// GET    /:id/backlinks – Notizen die auf :id verlinken (aus note_links)
// POST   /           – Neue Notiz erstellen; linkExtractor aufrufen + note_links befüllen
// PUT    /:id        – Notiz aktualisieren; note_links neu berechnen; WebSocket-Event emittieren
// DELETE /:id        – Notiz löschen (cascades note_links, note_tags)
