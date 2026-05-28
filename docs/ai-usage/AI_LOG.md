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

### 
<!-- Weitere Sessions hier anhängen -->
