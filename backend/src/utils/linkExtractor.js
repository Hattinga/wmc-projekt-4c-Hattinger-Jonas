// TODO: Server-seitiger Parser für [[Note Title]]-Syntax.
// Exportiert:
//   extractTitles(content: string) → string[]
//     Gibt alle verlinkten Notiz-Titel zurück (dedupliziert).
//   resolveTitleIds(titles[], userId, db) → number[]
//     Löst Titel zu Notiz-IDs auf (nur Notizen des gleichen Users).
// Wird in notes.js nach PUT/POST aufgerufen um note_links zu aktualisieren.
