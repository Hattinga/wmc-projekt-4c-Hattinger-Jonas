# Frontend-Audit (09.06.2026)

Vollständiger Funktions-Audit des Frontends vor der Abgabe. Jedes interaktive Element wurde
geprüft und klassifiziert. Status-Spalte zeigt den Stand **nach** den Fixes vom 09.06.

## Behoben am 09.06. ✅

| Fund | Ort | Fix |
|------|-----|-----|
| `/` leitet nicht auf /auth weiter (Doppel-Hop über Layout-Guard, `/` ist Public-Route) | `routes/+page.svelte`, `+layout.svelte:10` | Root prüft Token direkt → /auth oder /dashboard |
| Quick-Links "Eingang"/"Favoriten" zeigen dieselbe Seite (`?filter=` wird nie gelesen, kein Starred-Konzept im Backend) | `Sidebar.svelte:39-41` | Tote Links entfernt, ein funktionierender "Alle Notizen"-Link |
| Kein Ordner-Erstellen/-Löschen im UI (Backend + api.js existierten ungenutzt) | `Sidebar.svelte` | +‑Button mit Inline-Input, Lösch-Button, Klick filtert Dashboard |
| Ordner-Klick tut nichts | `Sidebar.svelte:104` | Klick setzt `?folder=<id>` am Dashboard |
| Dashboard ignoriert Ordner-Filter | `dashboard/+page.svelte` | liest `folder`-Query-Param, filtert Notizen, FAB erstellt Note im aktiven Ordner |
| Notiz löschen nirgends möglich (DELETE-Endpoint ungenutzt) | `note/[id]/+page.svelte:137` | Toter "more"-Button → Lösch-Button mit Confirm |
| Demo-Fallback-Ordner/-Tags ("Arbeit", "Entwicklung", #sprint …) erscheinen bei leerer DB und wirken echt | `Sidebar.svelte:162-179` | Fallback entfernt, leerer Zustand zeigt Hinweis |
| Tote Buttons: Star/Share (Dashboard-Preview + Editor), Notification-Bell, "Nur Vorschau"-Toggle (Handler nie übergeben) | `dashboard:82,153,154`, `note/[id]:135-137`, `Toolbar.svelte:51` | entfernt |

## Geplant vor Abgabe — erledigt am 10.06. ✅

| Fund | Ort | Umsetzung (10.06.) |
|------|-----|--------------------|
| Kein responsives Layout: fixe Sidebar (240px), 0 Breakpoints, 273 Inline-Styles statt Tailwind (CLAUDE.md-Vorgabe: Mobile-First) | alle Komponenten, v.a. `+layout.svelte` | ✅ Sidebar <640px als Slide-in (Hamburger + Overlay, `appState.sidebarOpen`), Editor-Split-View gestackt, Dashboard mobil als Liste, Settings-Nav als Chip-Leiste. Gezielte Breakpoint-Fixes statt Komplett-Migration der Inline-Styles. |
| Tag-Zuweisung fehlt im UI (Backend-Endpoints `POST/DELETE /tags/notes/:noteId` + api.js-Funktionen existieren ungenutzt) | `note/[id]/+page.svelte` | ✅ Tag-Chips + Eingabefeld im Editor; 409-Duplikate werden wiederverwendet; api.js-Fix für leere Response-Bodies |
| i18n nur ~2% genutzt: ~250 hartcodierte deutsche Strings, Sprachumschalter wechselt `locale` aber nichts Sichtbares (CLAUDE.md-Vorgabe: `t('key')`) | 11 Svelte-Dateien | ✅ ~130 Strings (alle Hauptscreens: Sidebar, Dashboard, Editor, Auth, Settings-Chrome, Graph) über `t()`; `setLocale()` mit localStorage; Settings-Stub-Texte bewusst ausgenommen |
| Graph: Ordner-Filter-Checkboxen togglen State, der nie angewendet wird (`filteredNodes` nutzt nur `searchQuery`) | `graph/+page.svelte:42-53` | ✅ Entfernt (Anwenden hätte Backend-Änderung gebraucht: kein `folder_id` im Graph-Endpoint); irreführende Ordner-Farb-Legende ebenfalls raus |

**Bonus-Fund 10.06.:** Graph-Edges klebten bei (0,0) — `simulationEdges` wurde nicht pro Tick neu zugewiesen, D3 mutiert am Svelte-Proxy vorbei. Gefixt; sichtbar erst mit dicht vernetztem Seed-Graphen (24 Notizen, 53 Links).

## Offen — bewusst nicht vor Abgabe (Backlog) ⬜

| Fund | Ort | Anmerkung |
|------|-----|-----------|
| Settings-Stubs: 2FA, Avatar-Upload, Kompakt-Modus, Animationen, ZIP-Export, Auto-Backup, Konto löschen | `settings/+page.svelte` | sichtbar `disabled` bzw. Alert "nicht implementiert" — ehrlich gekennzeichnet, kein Backend |
| `GET /auth/me` wird vom Frontend nie aufgerufen | `api.js:52` | User kommt aus localStorage; ok für Scope |
| Ordner umbenennen / Farbe / Note in Ordner verschieben (Editor-Dropdown) | Sidebar/Editor | Backend (`PUT /folders/:id`, `folderId` bei Note-Update) vorhanden; UI fehlt |
| Notes verschieben zwischen Ordnern per Drag & Drop | Dashboard | nice-to-have |
| Cmd+K-Hinweis im Suchfeld ohne Shortcut-Handler | `dashboard:77` | Hinweis entfernen oder Handler ergänzen |
| Tags im Graph filtern ("Kommt in KW 23"-Platzhalter) | `graph/+page.svelte:104` | nach Tag-UI sinnvoll |
| Backlinks-Zähler in Dashboard-Preview zeigt immer 0 (Liste wird nicht geladen) | `dashboard:170` | Detailseite zeigt Backlinks korrekt |

## API-Abdeckung (Stand 09.06., vor Fixes)

Backend-Endpoints gesamt: 21 — davon vom Frontend genutzt: 11.
Ungenutzt waren: `GET /auth/me`, `DELETE /notes/:id`, Folder-CRUD (POST/PUT/DELETE), Tag-CRUD
(POST/DELETE), Tag-Zuweisung (POST/DELETE `/tags/notes/…`). Die Fixes vom 09.06. + Tag-UI am
10.06. schließen die wichtigsten Lücken.
