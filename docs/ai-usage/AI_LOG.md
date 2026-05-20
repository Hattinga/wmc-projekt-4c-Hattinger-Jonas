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
<!-- Weitere Sessions hier anhängen -->
