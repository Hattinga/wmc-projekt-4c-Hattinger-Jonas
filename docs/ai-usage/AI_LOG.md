# AI-Nutzungsprotokoll – Zettlwirtschaft

## KW 21 (19.–25.05.2026)

### Session 1 – 20.05.2026
- **Tool:** Claude Code (CLI)
- **Zweck:** Projektstruktur aufsetzen
- **Prompt (Zusammenfassung):** Grundstruktur des SvelteKit + Express Projekts generieren lassen inkl. CLAUDE.md, .gitignore, schema.sql, Placeholder-Dateien
- **Ergebnis:** Vollständige Ordnerstruktur mit Placeholder-Kommentaren erstellt
- **Integration:** 1:1 übernommen als Basis für die Implementierung

---

### Session 2 – 20.05.2026
- **Tool:** Claude Code (CLI)
- **Zweck:** UI-Prototyp aller Screens aus dem Claude Design Export — bewusst ohne Backend-Logic, um zuerst Layout und Routing zu validieren bevor die Implementierung beginnt
- **Prompt (Zusammenfassung):** Design-Dateien als Basis nehmen, alle SvelteKit-Komponenten/Routen als reinen UI-Prototyp mit Demo-Daten und Routing codieren (kein API, kein Auth, kein Auto-Save)
- **Ergebnis:**
  - `Icon.svelte` – universelle Icon-Komponente (60+ Lucide-Style Icons, Svelte 5 Props)
  - `appState.svelte.js` – minimaler `$state`-Store (`locale`, `searchQuery`)
  - `i18n/index.js` + `de.json`/`en.json` – `t(key)`-Funktion mit Locale-Switching
  - `services/api.js` + `services/websocket.js` – vorbereitet, noch nicht angebunden
  - `utils/markdown.js` – Markdown→HTML Parser inkl. [[Wiki-Link]] Auflösung
  - `utils/linkParser.js` – extractLinks(), replaceLinks(), linksTo()
  - `routes/auth/+page.svelte` – Login/Register UI, Submit → `goto('/dashboard')`
  - `routes/dashboard/+page.svelte` – Topbar, Notizliste, Preview, FAB; statische Demo-Daten
  - `lib/components/layout/Sidebar.svelte` – Dunkel-Sidebar mit Ordnerbaum, Tags, User-Card
  - `lib/components/notes/NoteCard.svelte` – Wiki-Link-Vorschau, Selektions-Highlight
  - `lib/components/editor/MarkdownEditor.svelte` – Split-View, [[Notiz]]-Autocomplete, $derived Preview
  - `lib/components/editor/Toolbar.svelte` – Formatierungsbuttons + [[Notiz]]-Button
  - `lib/components/editor/BacklinksPanel.svelte` – Kollabierbare Backlink-Karten
  - `lib/components/graph/GraphView.svelte` – SVG-Graph mit Hover/Tooltip, Dot-Grid
  - `routes/note/[id]/+page.svelte` – Editor-UI, Demo-Content pro Note-ID, Status statisch "Gespeichert"
  - `routes/graph/+page.svelte` – Filter-Sidebar, Zoom-Controls, Demo-Nodes/Edges
  - `routes/settings/+page.svelte` – Profil, Sicherheit, Sprache, Darstellung, Export
  - `routes/+layout.svelte` – Route-basiertes Sidebar-Layout (öffentlich vs. App-Routen)
  - Dev-Server-Fixes: `"type": "module"` in package.json, vite.config.js Import korrigiert (`@sveltejs/kit/vite`), `postcss.config.js` erstellt
- **Integration:** Prototyp läuft vollständig ohne Backend; alle Routen navigierbar; Logic wird in KW 22 ergänzt sobald Backend steht

---

### Session 3 – 22.05.2026
- **Tool:** Claude Code (CLI)
- **Zweck:** Bugfix – Sidebar-Crash auf `/dashboard`
- **Prompt (Zusammenfassung):** `Sidebar.svelte` Zeile 95: `appState.tags.length` wirft `Cannot read properties of undefined (reading 'length')`, da `appState` nur `locale` und `searchQuery` enthält. Fix: optional chaining `appState.tags?.length` analog zu `appState.folders?.length` in Zeile 63.
- **Ergebnis:** Einzeiliger Fix in `Sidebar.svelte` – `appState.tags?.length` statt `appState.tags.length`; Build erfolgreich.
- **Integration:** Direkt übernommen; kein weiterer Handlungsbedarf bis Tags-API in KW 22 angebunden wird.

---

### Session 4 – 22.05.2026
- **Tool:** Claude Code (CLI)
- **Zweck:** LoginForm-Komponente implementieren (Unit 2)
- **Prompt (Zusammenfassung):** `LoginForm.svelte` als leerer Stub neu implementieren – Felder E-Mail + Passwort mit Icon, Passwort-Toggle (eye/eyeOff), "Eingeloggt bleiben"-Checkbox, "Passwort vergessen?"-Button, Error-Anzeige, Submit-Button mit Loading-State. Eigene CSS-Datei `loginForm.css` erstellt statt `<style>`-Block (SSR-Crash-Vermeidung).
- **Ergebnis:**
  - `lib/components/auth/loginForm.css` – neu erstellt mit allen Layout- und Interaktions-Styles
  - `lib/components/auth/LoginForm.svelte` – vollständig implementiert mit Svelte 5 Runes (`$state`, `$props`), Icon-Komponente, CSS-Import
- **Integration:** Komponente kompiliert sauber; wird in KW 22 in `routes/auth/+page.svelte` eingebunden wenn Auth-Backend angebunden wird

---

### Session 5 – 22.05.2026
- **Tool:** Claude Code (CLI)
- **Zweck:** `RegisterForm.svelte` Komponente implementieren (Unit 3)
- **Prompt (Zusammenfassung):** `RegisterForm.svelte` als leerer Stub neu implementieren – Felder Benutzername, E-Mail, Passwort, Passwort-Bestätigung mit Icons; Passwort-Toggle (eye/eyeOff); client-seitige Validierung (Passwort mind. 8 Zeichen, Passwörter müssen übereinstimmen); `onsubmit`/`loading`/`error` Props; Fehleranzeige für Validierungs- und Server-Fehler. Eigenes CSS-File `registerForm.css` statt `<style>`-Block (SSR-Crash-Vermeidung).
- **Ergebnis:**
  - `lib/components/auth/registerForm.css` – neu erstellt mit allen Layout- und Interaktions-Styles
  - `lib/components/auth/RegisterForm.svelte` – vollständig implementiert mit Svelte 5 Runes (`$state`, `$props`, `$derived`), `validationError` für client-seitige Prüfung, `displayError = $derived(validationError || error)`
- **Integration:** Build erfolgreich; `onsubmit({ username, email, password })` wird bei valider Eingabe aufgerufen; wird in KW 22 in `routes/auth/+page.svelte` eingebunden wenn Auth-Backend fertig ist.

---

### Session 6 – 22.05.2026
- **Tool:** Claude Code (CLI)
- **Zweck:** `app.css` Cleanup – Auth-Placeholder-Farbe für Light Mode aktualisieren (Unit 5)
- **Prompt (Zusammenfassung):** `.zw-auth-input::placeholder`-Farbe von dunklem `rgba(155, 155, 200, 0.35)` auf Light-Mode-Äquivalent `rgba(26, 26, 46, 0.3)` umstellen; auf stale Dark-Mode-Only-Regeln prüfen und entfernen.
- **Ergebnis:** Einzeilige Änderung in `frontend/src/app.css` – Placeholder-Farbe auf `rgba(26, 26, 46, 0.3)` aktualisiert. Keine weiteren Auth-spezifischen Dark-Mode-Farbwerte gefunden; Animationen (`.zw-node`, `.zw-edge`, `.zw-auth-card`, `.zw-auth-logo`) bleiben unverändert, da sie weiterhin vom SVG-Hintergrund der Auth-Seite genutzt werden.
- **Integration:** Build erfolgreich; Scrollbar-Styles und Animationen unverändert.

---
### Session 7 – 22.05.2026
- **Tool:** Claude Code (CLI)
- **Zweck:** Auth-Seite auf Light-Mode umschreiben, Formular-Komponenten einbinden (Unit 4)
- **Prompt (Zusammenfassung):** `routes/auth/+page.svelte` vollständig neu schreiben: Light-Mode-Palette (`#f6f5f2` Hintergrund, `#fff` Card, `#1a1a2e` Text), alle Inline-Styles in neue `authPage.css` auslagern, `LoginForm`/`RegisterForm`-Stubs einbinden, SVG-Graph-Hintergrund für helle Hintergründe angepasst (Edge-Stroke `rgba(26,26,46,0.08)`, blaue Nodes `#2d7fd3`, Blur stdDeviation `2`), `zw-auth-card`/`zw-auth-logo` Animations-Klassen beibehalten.
- **Ergebnis:**
  - `lib/components/auth/authPage.css` – neu erstellt mit BEM-artigen Klassen für alle Auth-Seiten-Elemente (Layout, Logo, Card, Tabs, Sprachauswahl, Copyright)
  - `routes/auth/+page.svelte` – vollständig überarbeitet: kein Inline-Style mehr (außer dynamischem `left` am Tab-Indikator), Light-Mode-SVG-Graph, `LoginForm`/`RegisterForm`-Props (`onsubmit`, `loading`, `error`) korrekt übergeben, Svelte 5 Runes beibehalten
- **Integration:** Build erfolgreich; Auth-Seite zeigt jetzt helles Design; Form-Stubs rendern bereits Felder (LoginForm/RegisterForm fertig implementiert); kein SSR-Crash da kein `<style>`-Block verwendet

---

## KW 22 (26.05.–01.06.2026)

### Session 8 – 28.05.2026
- **Tool:** Claude Code (CLI) — /batch Kommando (serial ausgeführt)
- **Zweck:** KW-21-Backfill – Backend-Auth vollständig implementieren + Frontend verdrahten
- **Audit-Ergebnis:** 12 von 12 Backend-Quelldateien waren reine TODO-Stubs (0% implementiert). `routes/auth/+page.svelte` feuerte `Promise.resolve()` statt echtem API-Aufruf.
- **Umgesetzte Änderungen:**
  - `backend/package.json` – `dotenv ^16.4.0` ergänzt; `better-sqlite3` auf v12.x aktualisiert (prebuilt für Node 24, kein C++ Toolset nötig)
  - `backend/src/config/database.js` – `better-sqlite3`-Verbindung, PRAGMA foreign_keys, Schema-Bootstrap via `schema.sql`
  - `backend/src/models/User.js` – `create`, `findByEmail`, `findById`, `update`, `delete` mit prepared statements; SQLITE_CONSTRAINT_UNIQUE → `DUPLICATE`-Error
  - `backend/src/middleware/auth.js` – Bearer-Token parsen, `jwt.verify`, `req.user` setzen, 401 bei fehlendem/ungültigem Token
  - `backend/src/routes/auth.js` – `POST /register`, `POST /login`, `GET /me`, `PATCH /me`; antwortet `{ token, user }` (kein `password_hash`)
  - `backend/src/index.js` – Express + CORS + JSON-Parser, nur `/api/auth` gemountet (andere Routen noch Stubs → KW 22)
  - `backend/db/seed.sql` – Placeholder-bcrypt-Hash durch echten `bcrypt.hash('password123', 10)`-Wert ersetzt
  - `frontend/src/lib/stores/appState.svelte.js` – `currentUser: null` hinzugefügt; `locale` + `currentUser` werden beim Start aus localStorage geladen
  - `frontend/src/routes/auth/+page.svelte` – `handleLogin`/`handleRegister` rufen nun `api.login`/`api.register` auf, schreiben Token + User in localStorage, setzen `appState.currentUser`
  - `frontend/src/routes/+layout.svelte` – `$effect`-Auth-Guard: leitet ohne Token auf `/auth` weiter
  - `frontend/src/lib/services/api.js` – Fehlerauswertung liest jetzt `err.error || err.message` (Backend gibt `{ error }` zurück)
- **Verifiziert:** `POST /register` → 201 + `{ token, user }` ✅; `POST /login` → 200 + Token ✅; `GET /me` mit Bearer → User ✅; falsches Passwort → 401 ✅; kein Token → Auth-Guard leitet weiter ✅
- **Integration:** Login-Flow funktioniert end-to-end. Backend-Routen für Notes/Folders/Tags/Graph und WebSocket sind bewusst auf KW 22/23 verschoben.

### Session 9 – 28.05.2026
- **Tool:** Claude (Opus 4.7, Chat)
- **Zweck:** Konzeptuelles Verständnis der JWT-Authentifizierung absichern
- **Prompt (Zusammenfassung):** „Wie funktioniert ein JWT?“ → Aufbau aus Header, Payload und Signature; „Wie sende ich den Token bei einem Request mit?“ → `Authorization: Bearer`-Header und passende Express-Middleware
- **Ergebnis:** Auth-Flow fachlich nachgezogen; JWT-Struktur und Bearer-Weitergabe klar eingeordnet
- **Integration:** Diente als Absicherung der bereits implementierten JWT-Middleware und als Grundlage für die Präsentation

### Session 10 – 28.05.2026
- **Tool:** Claude Code (CLI) — /batch Audit + /plan Bug-Fix-Sweep
- **Zweck:** 59 Audit-Funde aus KW 21/22 Code beheben (Critical, High, Medium, Low)
- **Prompt (Zusammenfassung):** `/batch` → paralleles Audit-Team durchsucht Front- und Backend; Ergebnis: 59 Funde gemeldet. `/plan fixe das alles` → alle 59 Funde in einem Sweep implementiert ohne Commits.
- **Umgesetzte Änderungen:**
  - **Critical:** Rekursiver SQLite-Trigger behoben (`AFTER UPDATE OF title,content,folder_id` verhindert Rekursion); XSS in Markdown-Preview + Dashboard-Preview via Escape-Pipeline mit `\x00N\x00`-Platzhaltern (Code-Blöcke + Wiki-Links werden vor dem Escaping extrahiert); Autosave-Race bei Note-Wechsel behoben (ID-Snapshot + Closure-Vergleich + `$effect`-Cleanup)
  - **High (Backend):** Kein zentraler Error-Handler/404 → ergänzt; `JWT_SECRET`-Fehlt-Check beim Modul-Load; leere Eingaben (title/name) → 400-Validierung; E-Mail-Format-Validierung; `folder_id`-Ownership-Check in Notes-Routen; `CIRCULAR`-Parent-Erkennung in Folder-Update; dynamisches SQL für null-fähige `folder_id`/`parent_id`-Updates
  - **High (Frontend):** 401-Auto-Logout zentral in `api.js` (`goto('/auth')`); Network-Error-Wrapping; Auth-Guard ohne Flash (synchrones `$derived` statt `$effect`); Autosave-Fehler sichtbar; Load-Error nur bei 404 weiterleiten
  - **Medium:** Cross-Tab-Logout-Sync (`storage`-Event); `logout()`-Helper im Store; FAB-Double-Submit-Guard; `selectedId`-Invalidierung nach Löschen; null-sichere Sortierung/Suche; `formatDate`-Util (neue Datei `date.js`); Sidebar `$effect` auf primitiver `userId`; Quick-Link-Counts entfernt (bis echte API); Settings-Stubs `disabled`
  - **Low:** Case-insensitive Wiki-Link-Matching; `encodeURIComponent` in Link-hrefs; `extractLinks` normalisiert; BacklinksPanel XSS-safe; i18n-Key-Fallback; `escapeHtml` exportiert und geteilt; 4 DB-Indizes ergänzt; `DROP TRIGGER IF EXISTS` für idempotentes Bootstrap; Autocomplete schließt bei Blur; Format-Cursor korrekt gesetzt; Inputs getrimmt; `aria-label`/`aria-pressed` an PW-Toggles
- **Neue Datei:** `frontend/src/lib/utils/date.js` — gemeinsame `formatDate(iso)`-Util
- **Verifiziert:** `npm run build` → ✓ built in 14.53s (nur pre-existing a11y-Warnings)
- **Integration:** Alles nochmal gecheckt und danach verfiziert durch tests 

## KW 23 (02.06.–08.06.2026)

### Session 11 – 03.06.2026
- **Tool:** Claude Code (CLI)
- **Zweck:** Alle KW23-Features implementieren (Links, Backlinks, Tags, Graph, WebSocket, Settings)
- **Prompt (Zusammenfassung):** Auf Basis der bestehenden Stubs die KW23-Meilensteine umsetzen: server-seitige `[[Link]]`-Extraktion mit `note_links`-Sync, Backlinks-Endpoint + Panel-Anbindung, Tags-CRUD mit `note_tags`-Join, `GET /api/graph`, D3.js-Force-Graph statt SVG-Demo, Socket.io mit JWT-Auth und Live-Updates, Settings-Seite verdrahten
- **Ergebnis:**
  - `backend/src/utils/linkExtractor.js` – `syncLinks(noteId, content, userId)`: extrahiert `[[Titel]]`, matched case-insensitiv gegen Notiz-Titel des Users, ersetzt Einträge in `note_links`
  - `backend/src/routes/notes.js` – `GET /:id/backlinks`; `syncLinks()` bei POST und PUT; WS-Emits bei PUT/DELETE
  - `backend/src/models/Tag.js` + `routes/tags.js` – vollständiges Tags-CRUD; Note-Queries liefern Tags mit
  - `backend/src/routes/graph.js` – Nodes (id, title) + Edges (source, target) aus `note_links`, user-scoped
  - `backend/src/websocket/handler.js` – JWT-Verify im Handshake, Room `user:<id>`, `emitNoteUpdated`/`emitNoteDeleted`
  - `frontend/src/lib/components/graph/GraphView.svelte` – D3 Force-Simulation mit Drag, Zoom/Pan, Node-Größe nach Degree
  - `frontend/src/lib/services/websocket.js` – verbindet mit Token bei Login, `note:updated`/`note:deleted` aktualisieren `appState.notes`
  - `frontend/src/routes/settings/+page.svelte` – Profil-Save, Passwort-Änderung, Theme-Toggle
- **Integration:** Komplett übernommen (Commit 03.06.); end-to-end verifiziert per Smoke-Test am 09.06. (siehe Session 12)

---

## KW 24 (09.06.–11.06.2026)

### Session 12 – 09.06.2026
- **Tool:** Claude Code (CLI) — 3 parallele Explore-Subagents für Frontend-Audit
- **Zweck:** User-gemeldete UI-Bugs prüfen (Root-Redirect, Quick-Links, fehlende Ordner-/Tag-UI) + vollständiger Funktions-Audit des Frontends
- **Prompt (Zusammenfassung):** „Prüfe generell ob Features im Frontend alle funktionsfähig/überhaupt implementiert sind" → 3 Subagents (Routen-Audit, Komponenten-/API-Abdeckung, i18n-/Tailwind-Compliance); danach Quick-Fixes umsetzen und alle Funde dokumentieren
- **Ergebnis:**
  - `docs/FRONTEND_AUDIT.md` – alle Funde klassifiziert (behoben / vor Abgabe / Backlog) inkl. API-Abdeckungsmatrix (10 von 21 Endpoints waren vom Frontend ungenutzt)
  - **Fixes:** Root-Redirect token-abhängig; Sidebar-Ordner-UI (erstellen/löschen/filtern via `?folder=`); Notiz-Löschen im Editor mit Confirm; tote UI entfernt (Quick-Links Eingang/Favoriten, Demo-Ordner/-Tags, Star/Share/Bell, Nur-Vorschau-Toggle)
  - **Verifiziert:** Build ✓; Ordner-Lifecycle per API end-to-end (Note überlebt Ordner-Löschung mit `folder_id=null`)
  - UI/UX-Pro-Max-Skill global installiert (`~/.claude/skills/`), UX-Guidelines (Confirm vor Destruktiv-Aktionen, Empty-States statt Demo-Daten) angewendet
- **Integration:** 2 Commits (docs-Audit + feat-Fixes); größere Funde (Responsive, Tag-UI, i18n-Extraktion, Graph-Filter) für 10.06. eingeplant

### Session 13 – 10.06.2026
- **Tool:** Claude Code (CLI) — /plan mit Explore- + Plan-Subagents, danach Umsetzung
- **Zweck:** Letzter Feature-Tag vor Abgabe: Responsive Layout, i18n-Extraktion, Tag-UI, Graph-Cleanup (Mittwochs-Plan aus ENDSPURT.md)
- **Prompt (Zusammenfassung):** „Lies die Docs, mach einen Tagesplan und fan out Subagents" → Explore-Agent auditierte Code-Stand vs. Meilensteine, Plan-Agent entwarf Umsetzungsstrategie (Befund: `t()` ist bereits reaktiv, nur ungenutzt; komplette Inline-Style-Migration zu riskant → gezielte Breakpoint-Fixes)
- **Ergebnis:**
  - **Graph-Cleanup:** Toter Ordner-Filter + irreführende Ordner-Farb-Legende entfernt (Graph-API liefert kein `folder_id`, Nodes sind nach `id % 10` gefärbt)
  - **Responsive:** `appState.sidebarOpen`; Sidebar <640px als Slide-in (fixed + `-translate-x-full`, Hamburger im Layout, Overlay, `afterNavigate` schließt); Editor-Split-View auf Mobile gestackt (`flex-col sm:flex-row`); Dashboard mobil als reine Liste (Preview `hidden sm:block`, NoteCard navigiert via `matchMedia` direkt); Settings-Nav als horizontale Chip-Leiste; Topbars mit `pl-14 sm:px-5` für den Hamburger. Wichtigste Falle: Inline-Style schlägt Tailwind-Klasse → betroffene Layout-Properties aus `style` entfernt
  - **i18n:** ~130 Strings aus Sidebar, Dashboard, Editor, Toolbar, BacklinksPanel, Auth-Forms, Settings-Chrome und Graph nach `de.json`/`en.json`; `t()` um `{platzhalter}`-Interpolation erweitert; Modul-Konstanten-Falle gelöst (navLinks/sections/tools speichern Keys, `t()` läuft im Markup); Sprachumschalter nutzen `setLocale()` (localStorage-Persistenz)
  - **Tag-UI:** Chips + Eingabefeld im Editor gegen vorhandene Tags-Routen; 409-Duplikat wird wiederverwendet; `api.js` behandelt leere Response-Bodies (201 ohne JSON von `POST /tags/notes/:id`)
- **Verifiziert:** `npm run build` ✓ (nur pre-existing a11y-Warnings); Tag-Flow end-to-end gegen laufendes Backend (attach 201 → Tags in Note-Response → detach 204)
- **Integration:** 4 Commits (refactor graph, feat responsive, feat i18n, feat tags)

<!-- Weitere Sessions hier anhängen -->
