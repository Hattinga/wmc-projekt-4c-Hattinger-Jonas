// Temporäres Smoke-Test-Skript für die Abgabe-Checkliste (11.06.) — wird nach dem Lauf gelöscht.
// Deckt die API/WS-Punkte der Test-Checkliste ab; Browser-Punkte werden manuell geprüft.
import { io } from 'socket.io-client';

const API = 'http://localhost:3000/api';
const results = [];
let token = null;

function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? '✅' : '❌'} ${name}${detail ? ' — ' + detail : ''}`);
}

async function req(method, path, body, useToken = true) {
  const res = await fetch(API + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(useToken && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch { /* leerer Body */ }
  return { status: res.status, data };
}

const stamp = Date.now();
const email = `smoke${stamp}@test.local`;
const password = 'testpass123';
const password2 = 'neuespass456';

// ── 1. Auth ──────────────────────────────────────────────
let r = await req('GET', '/health', null, false);
check('Health-Check', r.status === 200 && r.data?.status === 'ok');

r = await req('POST', '/auth/register', { username: `smoke${stamp}`, email, password }, false);
check('Register → 201 + Token', r.status === 201 && !!r.data?.token);
token = r.data?.token;

r = await req('POST', '/auth/login', { email, password: 'falschesPasswort' }, false);
check('Login falsches Passwort → 401', r.status === 401);

r = await req('POST', '/auth/login', { email, password }, false);
check('Login korrekt → 200 + Token', r.status === 200 && !!r.data?.token);
token = r.data?.token;

r = await req('GET', '/notes', null, false);
check('GET /notes ohne Token → 401 (Auth-Guard)', r.status === 401);

r = await req('GET', '/auth/me');
check('GET /me mit Token → 200', r.status === 200 && r.data?.user?.email === email);

// ── 3. Ordner: erstellen / verschachteln / löschen ──────
r = await req('POST', '/folders', { name: 'Smoke-Parent' });
check('Ordner erstellen → 201', r.status === 201);
const parentFolder = r.data?.folder;

r = await req('POST', '/folders', { name: 'Smoke-Child', parentId: parentFolder?.id });
check('Unterordner erstellen → 201', r.status === 201 && r.data?.folder?.parent_id === parentFolder?.id);
const childFolder = r.data?.folder;

// ── 2. Notes: erstellen / editieren / löschen ────────────
r = await req('POST', '/notes', { title: `Smoke Target ${stamp}`, content: 'Ich bin das Ziel.' });
check('Note erstellen → 201', r.status === 201);
const target = r.data?.note;

r = await req('POST', '/notes', {
  title: `Smoke Source ${stamp}`,
  content: `Verweist auf [[Smoke Target ${stamp}]].`,
  folderId: childFolder?.id,
});
check('Note mit [[Wiki-Link]] + Ordner erstellen → 201', r.status === 201);
const source = r.data?.note;

r = await req('PUT', `/notes/${source?.id}`, {
  title: source?.title,
  content: `Editiert (Autosave-Simulation). Link bleibt: [[Smoke Target ${stamp}]].`,
});
check('Note editieren (PUT, wie Autosave) → 200', r.status === 200);

// ── 4. Backlinks ─────────────────────────────────────────
r = await req('GET', `/notes/${target?.id}/backlinks`);
const hasBacklink = r.data?.backlinks?.some(b => b.id === source?.id);
check('Backlink Quelle→Ziel vorhanden', r.status === 200 && hasBacklink,
  `${r.data?.backlinks?.length ?? 0} Backlink(s)`);

// ── 5. Graph ─────────────────────────────────────────────
r = await req('GET', '/graph');
const nodes = r.data?.nodes ?? [];
const edges = r.data?.edges ?? [];
const hasNodes = nodes.some(n => n.id === target?.id) && nodes.some(n => n.id === source?.id);
const hasEdge = edges.some(e => (e.source === source?.id && e.target === target?.id));
check('Graph: Nodes + Edge des Links korrekt', r.status === 200 && hasNodes && hasEdge,
  `${nodes.length} Nodes, ${edges.length} Edges`);

// ── Tags (Editor-Tag-UI nutzt diese Endpoints) ───────────
r = await req('POST', '/tags', { name: `smoke-tag-${stamp}` });
const tag = r.data?.tag;
check('Tag erstellen → 201', r.status === 201);
r = await req('POST', `/tags/notes/${source?.id}`, { tagId: tag?.id });
check('Tag an Note hängen → 2xx', r.status >= 200 && r.status < 300);
r = await req('GET', `/notes/${source?.id}`);
check('Note-Response enthält Tag', r.data?.note?.tags?.some(t => t.id === tag?.id));

// ── 6. WebSocket: Live-Events (simuliert zweiten Tab) ────
const wsResult = await new Promise((resolve) => {
  const seen = { updated: false, created: false, deleted: false };
  const socket = io('http://localhost:3000', { auth: { token } });
  const timer = setTimeout(() => { socket.close(); resolve(seen); }, 5000);
  const finish = () => {
    if (seen.updated && seen.created && seen.deleted) {
      clearTimeout(timer); socket.close(); resolve(seen);
    }
  };
  socket.on('note:updated', (n) => { if (n.id === source.id) { seen.updated = true; finish(); } });
  socket.on('note:created', () => { seen.created = true; finish(); });
  socket.on('note:deleted', () => { seen.deleted = true; finish(); });
  socket.on('connect', async () => {
    await req('PUT', `/notes/${source.id}`, { title: source.title, content: 'WS-Test-Update' });
    const c = await req('POST', '/notes', { title: `Smoke WS ${stamp}`, content: 'temp' });
    await req('DELETE', `/notes/${c.data?.note?.id}`);
  });
  socket.on('connect_error', (err) => {
    clearTimeout(timer); resolve({ error: err.message });
  });
});
check('WS note:updated empfangen', wsResult.updated === true, wsResult.error ?? '');
check('WS note:created empfangen', wsResult.created === true);
check('WS note:deleted empfangen', wsResult.deleted === true);

// ── 9. Settings: Profil + Passwort ───────────────────────
r = await req('PATCH', '/auth/me', { username: `smoke${stamp}-edit` });
check('Profil (Username) ändern → 200', r.status === 200 && r.data?.user?.username === `smoke${stamp}-edit`);

r = await req('PATCH', '/auth/me', { password: password2 });
check('Passwort ändern → 200', r.status === 200);

r = await req('POST', '/auth/login', { email, password }, false);
check('Login mit altem Passwort → 401', r.status === 401);

r = await req('POST', '/auth/login', { email, password: password2 }, false);
check('Login mit neuem Passwort → 200', r.status === 200);
token = r.data?.token;

// ── Aufräumen + Ordner-Löschen-Test ──────────────────────
r = await req('DELETE', `/notes/${source?.id}`);
check('Note löschen → 2xx', r.status >= 200 && r.status < 300);
await req('DELETE', `/notes/${target?.id}`);
await req('DELETE', `/tags/${tag?.id}`);

r = await req('DELETE', `/folders/${parentFolder?.id}`);
check('Ordner (mit Unterordner) löschen → 2xx', r.status >= 200 && r.status < 300);
r = await req('GET', '/folders');
const leftover = r.data?.folders?.filter(f => [parentFolder?.id, childFolder?.id].includes(f.id)) ?? [];
check('Keine Smoke-Ordner übrig', leftover.length === 0, leftover.length ? `übrig: ${leftover.map(f => f.name)}` : '');

// ── Fazit ────────────────────────────────────────────────
const failed = results.filter(x => !x.ok);
console.log(`\n${results.length - failed.length}/${results.length} Checks bestanden.`);
if (failed.length) {
  console.log('Fehlgeschlagen:', failed.map(f => f.name).join(' | '));
  process.exit(1);
}
