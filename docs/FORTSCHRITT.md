# Meilenstein-Plan vs. Ist-Fortschritt

| KW | Zeitraum | Meilenstein (Soll) | Ist-Stand | Status |
|----|----------|-------------------|-----------|--------|
| 20 | 12.–18.05. | Konzept + Setup | Konzept abgegeben ✅ | ✅ |
| 21 | 19.–25.05. | Auth + Basis-UI | Frontend-UI vollständig (Auth-Seite, Dashboard, Editor, Graph, Settings als Svelte 5 Komponenten). **Backend-Logik war Stub** – wurde in KW 22 nachgeholt. | ⚠️ |
| 22 | 26.05.–01.06. | CRUD + Editor | **KW-21-Backfill:** Backend vollständig implementiert – `database.js` (better-sqlite3), `User.js` Model, JWT-Middleware, Auth-Routen (`/register`, `/login`, `/me`), Express Bootstrap. Frontend verdrahtet: `api.login`/`api.register` in Auth-Seite, `appState.currentUser` + localStorage-Hydration, Auth-Guard in Layout. Login-Flow end-to-end funktionsfähig. | 🔄 |
| 23 | 02.–08.06. | Links + Graph + WS | | ⬜ |
| 24 | 09.–11.06. | Polish + Abgabe | | ⬜ |
