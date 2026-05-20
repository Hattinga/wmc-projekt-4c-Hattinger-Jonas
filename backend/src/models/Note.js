// TODO: Note-Model – DB-Zugriff für notes + note_links + note_tags.
// Exportiert:
//   Note.findAll(userId, { folderId, search })  → Array mit Tags
//   Note.findById(id, userId)                   → Notiz mit Tags
//   Note.findBacklinks(id, userId)              → Notizen die auf id zeigen
//   Note.create({ title, content, userId, folderId }) → neue Notiz
//   Note.update(id, userId, fields)             → aktualisierte Notiz
//   Note.delete(id, userId)                     → void
//   Note.updateLinks(noteId, targetIds[])       → note_links neu schreiben
