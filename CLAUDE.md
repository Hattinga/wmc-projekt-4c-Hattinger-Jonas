# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt

Markdown-Notiz-App mit bi-direktionaler Verlinkung (Obsidian/Notion-Stil). Schulprojekt, Einzelarbeit, Abgabe 11.06.2026, Präsentation ab 12.06 (10min, auf Englisch).

## Tech-Stack

- **Frontend:** SvelteKit (Svelte 5 mit Runes), Tailwind CSS, marked.js/markdown-it, D3.js, Socket.io-client
- **Backend:** Express.js, better-sqlite3, Socket.io, JWT + bcrypt
- **Sprache:** JavaScript (kein TypeScript)

## Entwicklungs-Befehle

```bash
# Frontend (im frontend/ Verzeichnis)
npm install
npm run dev          # Dev-Server starten (Port 5173)
npm run build        # Produktions-Build
npm run preview      # Build-Preview

# Backend (im backend/ Verzeichnis)
npm install
npm run dev          # nodemon (Port 3000)
npm start            # Produktionsstart

# Datenbank initialisieren
cd backend && node -e "require('./src/config/database.js')"
# oder: sqlite3 db/zettlwirtschaft.db < db/schema.sql
```

## Architektur

### Kommunikationsschichten
- **REST API** (`/api/*`) → CRUD-Operationen für Notes, Folders, Tags, Auth
- **WebSocket (Socket.io)** → nur Echtzeit-Updates (z.B. wenn ein anderer Tab eine Note ändert)
- **Kein SSR** → SvelteKit im SPA-Modus (adapter-static oder adapter-node)

### State-Management
Einziger globaler Store: `frontend/src/lib/stores/appState.svelte.js` als Svelte 5 Shared Rune.
Enthält: `currentUser`, `locale`, `notes`, `activeNoteId`, `wsConnected`, `searchQuery`.
**Kein Writable/Derived Store** – ausschließlich `$state`/`$derived` Runes.

### Bi-direktionale Links
- `[[Note Title]]`-Syntax im Markdown-Editor
- `frontend/src/lib/utils/linkParser.js` parsed Links client-seitig für Live-Preview
- `backend/src/utils/linkExtractor.js` parsed Links server-seitig beim Speichern
- Backend aktualisiert `note_links`-Tabelle (source_id, target_id) bei jedem Save
- `GET /graph` gibt Nodes + Edges für D3.js zurück

### Datenbankschema (SQLite)
Tabellen: `users`, `notes`, `note_links`, `folders`, `tags`, `note_tags` – Details in `backend/db/schema.sql`

## Architektur-Regeln

- Svelte 5 Runes: `$state`, `$derived`, `$effect`, `$props` – **kein** `let`-basiertes reaktives System, kein `writable()`
- CSS: Tailwind Utility Classes, Mobile-First. Breakpoints: <640px / 640–1024px / >1024px
- i18n: `t('key')` aus `frontend/src/lib/i18n/index.js`, Texte in `de.json`/`en.json`
- Komponenten: PascalCase (`NoteCard.svelte`), Dateien/Ordner: camelCase (`linkParser.js`)
- SQLite DB: `backend/db/zettlwirtschaft.db` (nicht committen – in .gitignore)

## Meilenstein-Plan

| KW | Zeitraum | Fokus |
|----|----------|-------|
| 21 | 19.–25.05. | Auth (JWT), Dashboard-Layout, Sidebar, Tailwind, i18n-Grundstruktur |
| 22 | 26.05.–01.06. | Notiz-CRUD, Markdown-Editor + Live-Preview, Ordner-System |
| 23 | 02.–08.06. | `[[Note]]`-Syntax, Backlinks, Graph-View (D3.js), WebSocket-Integration |
| 24 | 09.–11.06. | Responsive Feinschliff, Bugfixes, Doku, Tests |

## Dokumentation

- Nach jeder Session: `docs/ai-usage/AI_LOG.md` aktualisieren
- Ende der Woche: Protokoll in `docs/protokolle/KWxx_*.md` nach Template ausfüllen
- `docs/FORTSCHRITT.md` aktuell halten (Soll vs. Ist)
- Commits auf Deutsch, mind. 2–3×/Woche (werden KI-geprüft)
