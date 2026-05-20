// TODO: Fetch-Wrapper für alle REST-API Aufrufe.
// Liest JWT aus localStorage, setzt Authorization-Header automatisch.
// Basis-URL aus import.meta.env.PUBLIC_API_URL.
//
// Exportierte Funktionen (Beispiele):
//   getNotes(folderId?)   → GET /notes
//   getNote(id)           → GET /notes/:id
//   createNote(data)      → POST /notes
//   updateNote(id, data)  → PUT /notes/:id
//   deleteNote(id)        → DELETE /notes/:id
//   login(email, pw)      → POST /auth/login
//   register(data)        → POST /auth/register
//   getGraph()            → GET /graph
