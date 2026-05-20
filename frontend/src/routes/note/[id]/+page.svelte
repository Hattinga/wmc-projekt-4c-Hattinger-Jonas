<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Icon from '$lib/components/ui/Icon.svelte';
  import Toolbar from '$lib/components/editor/Toolbar.svelte';
  import MarkdownEditor from '$lib/components/editor/MarkdownEditor.svelte';
  import BacklinksPanel from '$lib/components/editor/BacklinksPanel.svelte';
  import { appState } from '$lib/stores/appState.svelte.js';

  let noteId = $derived($page.params.id);

  const DEMO_NOTES = {
    'svelte-5-runes': { title: 'Svelte 5 Runes', folder: 'Entwicklung', content: DEMO_CONTENT },
    'projektmanagement': { title: 'Projektmanagement', folder: 'Arbeit', content: '# Projektmanagement\n\nSprint-Planung mit Pair-Programming-Slots. Diskussion mit [[Express.js API]]-Team.\n\n## Aktuelle Sprints\n\n- Sprint 12: Backend-Auth\n- Sprint 13: Frontend-Editor' },
    'express-js-api': { title: 'Express.js API', folder: 'Entwicklung', content: '# Express.js API\n\nMiddleware-Reihenfolge: helmet → cors → bodyParser → routes → errorHandler.\n\n```js\napp.use(helmet());\napp.use(cors());\napp.use(express.json());\n```' },
    'bi-direktionale-links': { title: 'Bi-direktionale Links', folder: 'Notizen', content: '# Bi-direktionale Links\n\nJede [[Notiz]] kennt ihre Eltern und Kinder. Backlinks sind keine Pflicht — sie sind ein Nebenprodukt sauberer Verlinkung.\n\n> **Tipp:** Nutze [[Wiki-Links]] um Konzepte zu verbinden.' },
  };

  let note = $derived(DEMO_NOTES[noteId] || { title: 'Neue Notiz', folder: 'Notizen', content: '' });
  let title = $state('');
  let content = $state('');
  let editorRef;

  $effect(() => {
    title = note.title;
    content = note.content;
  });

  const DEMO_BACKLINKS = [
    { id: 'express-js-api', title: 'Express.js API', preview: '…Auth via JWT, siehe [[Svelte 5 Runes]] Client…', folder: 'Entwicklung' },
    { id: 'projektmanagement', title: 'Projektmanagement', preview: '…Migration von [[Projektmanagement]]-Tool läuft…', folder: 'Arbeit' },
  ];

  function handleFormat(tool) {
    editorRef?.applyFormat(tool);
  }

  function handleInsertLink() {
    editorRef?.insertLinkSyntax();
  }
</script>

<div style="width:100%;height:100%;display:flex;flex-direction:column;font-family:Inter,system-ui,sans-serif;background:#fff;overflow:hidden;color:#1a1a2e;">

  <!-- Topbar -->
  <div style="height:52px;border-bottom:1px solid rgba(26,26,46,0.08);display:flex;align-items:center;padding:0 16px;gap:12px;flex-shrink:0;">
    <button onclick={() => goto('/dashboard')} style="width:34px;height:34px;border-radius:8px;border:none;background:transparent;color:#6b6b80;cursor:pointer;display:flex;align-items:center;justify-content:center;">
      <Icon name="chevLeft" size={18} />
    </button>
    <div style="display:flex;align-items:center;gap:6px;font-size:12.5px;color:#888899;">
      <Icon name="folder" size={13} color="#4ea8de" />
      <span>{note.folder}</span>
      <Icon name="chevRight" size={11} />
      <span style="color:#1a1a2e;font-weight:500;">{title}</span>
    </div>
    <span style="flex:1;"></span>

    <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:#2a9d6e;font-weight:500;background:rgba(42,157,110,0.08);padding:4px 10px;border-radius:12px;">
      <Icon name="check" size={12} color="#2a9d6e" strokeWidth={2.5} />
      Gespeichert
    </div>

    <button style="width:34px;height:34px;border-radius:8px;border:none;background:transparent;color:#6b6b80;cursor:pointer;display:flex;align-items:center;justify-content:center;"><Icon name="star" size={16} /></button>
    <button style="width:34px;height:34px;border-radius:8px;border:none;background:transparent;color:#6b6b80;cursor:pointer;display:flex;align-items:center;justify-content:center;"><Icon name="share" size={16} /></button>
    <button style="width:34px;height:34px;border-radius:8px;border:none;background:transparent;color:#6b6b80;cursor:pointer;display:flex;align-items:center;justify-content:center;"><Icon name="moreH" size={16} /></button>
  </div>

  <!-- Title -->
  <div style="padding:20px 28px 0;flex-shrink:0;">
    <input
      bind:value={title}
      placeholder="Titel…"
      style="width:100%;border:none;outline:none;font-size:28px;font-weight:700;letter-spacing:-0.6px;color:#1a1a2e;font-family:inherit;background:transparent;padding:0;"
    />
  </div>

  <!-- Toolbar -->
  <Toolbar onFormat={handleFormat} onInsertLink={handleInsertLink} />

  <!-- Editor body -->
  <div style="flex:1;display:flex;min-height:0;">
    <MarkdownEditor
      bind:content
      bind:this={editorRef}
      notes={[]}
    />
  </div>

  <!-- Backlinks panel -->
  <BacklinksPanel backlinks={DEMO_BACKLINKS} {noteId} />
</div>

<script context="module">
  const DEMO_CONTENT = `# Svelte 5 Runes

Svelte 5 ersetzt die alten \`$:\` Reactive Statements durch **Runes** — explizite Primitives, die überall im Code funktionieren, nicht nur in \`.svelte\`-Dateien.

## Die drei wichtigsten Runes

- \`$state\` — reaktive Werte, ersetzt \`let\` in Komponenten
- \`$derived\` — abgeleitete Werte, ersetzt \`$:\`
- \`$effect\` — Seiteneffekte, ersetzt \`onMount\` + \`$:\`

## Beispiel

\`\`\`js
let count = $state(0);
let doubled = $derived(count * 2);

$effect(() => {
  console.log('count ist jetzt', count);
});
\`\`\`

Die Migration von [[Projektmanagement]]-Tool läuft. Siehe auch [[Express.js API]] für den Backend-Teil und [[Bi-direktionale Links]] für die Verlinkungslogik.

> **Tipp:** Runes funktionieren auch außerhalb von Komponenten in \`.svelte.js\`-Dateien.
`;
</script>
