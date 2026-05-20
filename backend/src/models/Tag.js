// TODO: Tag-Model – DB-Zugriff für tags + note_tags.
// Exportiert:
//   Tag.findAll(userId)                    → Tags mit Notiz-Anzahl
//   Tag.create({ name, userId })           → neuer Tag (UNIQUE per User)
//   Tag.delete(id, userId)                 → void
//   Tag.addToNote(tagId, noteId)           → note_tags-Eintrag
//   Tag.removeFromNote(tagId, noteId)      → void
