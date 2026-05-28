# Meilenstein-Plan vs. Ist-Fortschritt

| KW | Zeitraum | Meilenstein (Soll) | Ist-Stand | Status |
|----|----------|-------------------|-----------|--------|
| 20 | 12.–18.05. | Konzept + Setup | Konzept abgegeben ✅ | ✅ |
| 21 | 19.–25.05. | Auth + Basis-UI | Frontend-UI vollständig (Auth-Seite, Dashboard, Editor, Graph, Settings als Svelte 5 Komponenten). **Backend-Logik war Stub** – wurde in KW 22 nachgeholt. | ⚠️ |
| 22 | 26.05.–01.06. | CRUD + Editor | **KW-21-Backfill:** Auth-Backend + Frontend-Auth-Wiring. **Notes CRUD:** `Note.js` Model, `GET/POST/PUT/DELETE /api/notes`, Dashboard + Detailseite verdrahtet, Autosave. **Ordner-System:** `Folder.js` Model, `GET/POST/PUT/DELETE /api/folders`, Sidebar lädt echte Ordner per API. **Bugfix:** Wiki-Link-Navigation. **Bug-Fix-Sweep (59 Funde):** XSS-Schutz, Autosave-Race, rekursiver Trigger, 401-Auto-Logout, Auth-Flash, Folder-Ownership, Circular-Parent, Cross-Tab-Logout, Dynamic-SQL für null-fähige Felder u.v.m. | ✅ |
| 23 | 02.–08.06. | Links + Graph + WS | | ⬜ |
| 24 | 09.–11.06. | Polish + Abgabe | | ⬜ |
