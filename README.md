# Zettlwirtschaft

Markdown-Notiz-App mit bi-direktionaler Verlinkung im Obsidian/Notion-Stil. Schulprojekt WMC 4. Klasse.

## Tech-Stack

| | Technologie |
|---|---|
| Frontend | SvelteKit (Svelte 5), Tailwind CSS, D3.js, Socket.io-client |
| Backend | Express.js, better-sqlite3, Socket.io, JWT + bcrypt |
| DB | SQLite |

## Setup

### Voraussetzungen
- Node.js 20+
- npm

### Backend starten
```bash
cd backend
cp .env.example .env        # JWT_SECRET anpassen!
npm install
node -e "import('./src/config/database.js')"   # DB initialisieren
npm run dev                 # startet auf Port 3000
```

### Frontend starten
```bash
cd frontend
cp .env.example .env
npm install
npm run dev                 # startet auf Port 5173
```

## Ordnerstruktur

```
frontend/   → SvelteKit App (Svelte 5 Runes, Tailwind)
backend/    → Express API + Socket.io Server
docs/       → Wochenprotokolle, AI-Log, Fortschritt
```

## Features

- Markdown-Editor mit Live-Preview
- `[[Note Title]]`-Syntax für bi-direktionale Links
- Graph-View (D3.js Force-Layout) aller Notizen und Links
- Ordner- und Tag-System
- Echtzeit-Updates via WebSocket
- Mehrsprachig (DE/EN)
- Responsive Design (Mobile-First)
