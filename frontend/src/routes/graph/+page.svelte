<script>
  import { goto } from '$app/navigation';
  import Icon from '$lib/components/ui/Icon.svelte';
  import GraphView from '$lib/components/graph/GraphView.svelte';

  const DEMO_NODES = [
    { id: 'svelte-5-runes', label: 'Svelte 5 Runes', x: 0.50, y: 0.42, r: 24, color: '#4ea8de', folder: 'Entwicklung', preview: '$state, $derived und $effect ersetzen…' },
    { id: 'projektmanagement', label: 'Projektmanagement', x: 0.30, y: 0.30, r: 20, color: '#e94560', folder: 'Arbeit', preview: 'Sprint-Planung mit Pair-Programming-Slots…' },
    { id: 'express-js-api', label: 'Express.js API', x: 0.72, y: 0.30, r: 22, color: '#4ea8de', folder: 'Entwicklung', preview: 'Middleware-Reihenfolge: helmet → cors → bodyParser…' },
    { id: 'bi-direktionale-links', label: 'Bi-direktionale Links', x: 0.50, y: 0.66, r: 26, color: '#7c9eb2', folder: 'Notizen', preview: 'Jede Notiz kennt ihre Eltern und Kinder…' },
    { id: 'docker-compose', label: 'Docker Compose', x: 0.85, y: 0.50, r: 16, color: '#4ea8de', folder: 'Entwicklung' },
    { id: 'wochenrückblick', label: 'KW 19 Rückblick', x: 0.18, y: 0.55, r: 14, color: '#ffb627', folder: 'Tagebuch' },
    { id: 'shape-up', label: 'Shape Up', x: 0.35, y: 0.78, r: 16, color: '#7c9eb2', folder: 'Notizen' },
    { id: 'jwt-auth', label: 'JWT Auth', x: 0.88, y: 0.20, r: 12, color: '#4ea8de', folder: 'Entwicklung' },
    { id: 'zettelkasten-method', label: 'Zettelkasten Methode', x: 0.65, y: 0.82, r: 15, color: '#7c9eb2', folder: 'Notizen' },
  ];

  const DEMO_EDGES = [
    ['svelte-5-runes', 'projektmanagement'],
    ['svelte-5-runes', 'express-js-api'],
    ['svelte-5-runes', 'bi-direktionale-links'],
    ['express-js-api', 'docker-compose'],
    ['express-js-api', 'jwt-auth'],
    ['projektmanagement', 'shape-up'],
    ['projektmanagement', 'wochenrückblick'],
    ['bi-direktionale-links', 'zettelkasten-method'],
    ['bi-direktionale-links', 'shape-up'],
  ];

  const folders = [
    { id: 'arbeit', name: 'Arbeit', count: 12, color: '#e94560' },
    { id: 'entwicklung', name: 'Entwicklung', count: 23, color: '#4ea8de' },
    { id: 'tagebuch', name: 'Tagebuch', count: 47, color: '#ffb627' },
    { id: 'notizen', name: 'Notizen', count: 38, color: '#7c9eb2' },
  ];

  const tags = [
    { name: 'sprint', count: 12, color: '#e94560' },
    { name: 'svelte', count: 18, color: '#4ea8de' },
    { name: 'zettelkasten', count: 9, color: '#7c9eb2' },
    { name: 'reflektion', count: 14, color: '#888899' },
  ];

  let activeFilters = $state(new Set(['arbeit', 'entwicklung', 'tagebuch', 'notizen']));
  let searchQuery = $state('');

  let filteredNodes = $derived(
    searchQuery
      ? DEMO_NODES.filter(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()))
      : DEMO_NODES
  );

  function toggleFilter(id) {
    const next = new Set(activeFilters);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    activeFilters = next;
  }
</script>

<div style="width:100%;height:100%;position:relative;overflow:hidden;background:#fafaf8;font-family:Inter,system-ui,sans-serif;color:#1a1a2e;">

  <!-- Topbar -->
  <div style="position:absolute;top:0;left:0;right:0;height:56px;display:flex;align-items:center;padding:0 20px;gap:14px;background:rgba(255,255,255,0.85);backdrop-filter:blur(10px);border-bottom:1px solid rgba(26,26,46,0.08);z-index:3;">
    <button onclick={() => goto('/dashboard')} style="width:34px;height:34px;border-radius:8px;border:none;background:transparent;color:#6b6b80;cursor:pointer;display:flex;align-items:center;justify-content:center;">
      <Icon name="chevLeft" size={18} />
    </button>
    <h2 style="margin:0;font-size:17px;font-weight:700;letter-spacing:-0.3px;">Graph-Ansicht</h2>
    <span style="font-size:12px;color:#888899;">{filteredNodes.length} Notizen · {DEMO_EDGES.length} Verbindungen</span>
    <span style="flex:1;"></span>
    <button style="display:flex;align-items:center;gap:6px;height:34px;padding:0 10px;font-size:12px;font-weight:500;color:#1a1a2e;border:1px solid rgba(26,26,46,0.10);border-radius:8px;background:#fff;cursor:pointer;font-family:inherit;">
      <Icon name="refresh" size={13} /> Neu anordnen
    </button>
    <div style="width:34px;height:34px;border-radius:17px;background:linear-gradient(135deg,#1a1a2e,#2d2d4a);color:#fff;font-weight:600;font-size:12px;display:flex;align-items:center;justify-content:center;">MN</div>
  </div>

  <!-- Filter Sidebar -->
  <div style="position:absolute;top:76px;left:20px;bottom:20px;width:240px;background:#fff;border-radius:12px;padding:16px;border:1px solid rgba(26,26,46,0.08);box-shadow:0 4px 16px rgba(26,26,46,0.04);display:flex;flex-direction:column;gap:14px;z-index:2;overflow:auto;">
    <div style="display:flex;align-items:center;gap:8px;background:#f6f5f2;border-radius:7px;padding:0 10px;height:32px;">
      <Icon name="search" size={14} color="#888899" />
      <input
        bind:value={searchQuery}
        placeholder="Im Graphen suchen…"
        style="flex:1;border:none;background:transparent;outline:none;font-size:12.5px;color:#1a1a2e;font-family:inherit;min-width:0;"
      />
    </div>

    <div>
      <div style="font-size:10px;font-weight:600;color:#888899;letter-spacing:0.8px;text-transform:uppercase;margin-bottom:6px;">Ordner</div>
      {#each folders as f}
        <label style="display:flex;align-items:center;gap:8px;padding:5px 6px;border-radius:5px;cursor:pointer;font-size:12.5px;color:#1a1a2e;background:{activeFilters.has(f.id) ? 'rgba(233,69,96,0.04)' : 'transparent'};">
          <div style="width:14px;height:14px;border-radius:4px;background:{activeFilters.has(f.id) ? f.color : '#fff'};border:1.5px solid {activeFilters.has(f.id) ? f.color : 'rgba(26,26,46,0.20)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            {#if activeFilters.has(f.id)}<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>{/if}
          </div>
          <input type="checkbox" checked={activeFilters.has(f.id)} onchange={() => toggleFilter(f.id)} style="display:none;" />
          <span style="flex:1;font-weight:{activeFilters.has(f.id) ? 500 : 400};">{f.name}</span>
          <span style="font-size:11px;color:#888899;">{f.count}</span>
        </label>
      {/each}
    </div>

    <div>
      <div style="font-size:10px;font-weight:600;color:#888899;letter-spacing:0.8px;text-transform:uppercase;margin-bottom:6px;">Tags</div>
      {#each tags as tag}
        <label style="display:flex;align-items:center;gap:8px;padding:5px 6px;border-radius:5px;cursor:pointer;font-size:12.5px;color:#1a1a2e;">
          <div style="width:14px;height:14px;border-radius:4px;background:{tag.color};border:1.5px solid {tag.color};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <span style="flex:1;">#{tag.name}</span>
          <span style="font-size:11px;color:#888899;">{tag.count}</span>
        </label>
      {/each}
    </div>

    <span style="flex:1;"></span>

    <div style="font-size:10.5px;color:#888899;border-top:1px solid rgba(26,26,46,0.06);padding-top:10px;">
      <strong style="color:#1a1a2e;">Tipp:</strong> Klicke auf einen Node, um zur Notiz zu springen.
    </div>
  </div>

  <!-- Graph canvas -->
  <div style="position:absolute;top:56px;left:280px;right:0;bottom:0;">
    <div style="position:relative;width:100%;height:100%;">
      <GraphView nodes={filteredNodes} edges={DEMO_EDGES} />

      <!-- Zoom controls -->
      <div style="position:absolute;right:24px;bottom:24px;display:flex;flex-direction:column;background:#fff;border-radius:10px;overflow:hidden;border:1px solid rgba(26,26,46,0.10);box-shadow:0 4px 16px rgba(26,26,46,0.08);">
        <button style="width:36px;height:36px;border:none;background:transparent;color:#6b6b80;cursor:pointer;display:flex;align-items:center;justify-content:center;"><Icon name="plus" size={14} strokeWidth={2.2} /></button>
        <div style="height:1px;background:rgba(26,26,46,0.08);"></div>
        <div style="font-size:11px;color:#6b6b80;text-align:center;padding:5px 0;font-weight:500;min-width:40px;">100%</div>
        <div style="height:1px;background:rgba(26,26,46,0.08);"></div>
        <button style="width:36px;height:36px;border:none;background:transparent;color:#6b6b80;cursor:pointer;display:flex;align-items:center;justify-content:center;"><Icon name="x" size={11} strokeWidth={2.2} /></button>
        <div style="height:1px;background:rgba(26,26,46,0.08);"></div>
        <button style="width:36px;height:36px;border:none;background:transparent;color:#6b6b80;cursor:pointer;display:flex;align-items:center;justify-content:center;"><Icon name="maximize" size={14} strokeWidth={2} /></button>
      </div>

      <!-- Legend -->
      <div style="position:absolute;left:24px;bottom:24px;background:#fff;border-radius:10px;padding:10px 14px;border:1px solid rgba(26,26,46,0.08);box-shadow:0 4px 16px rgba(26,26,46,0.04);display:flex;align-items:center;gap:14px;font-size:11.5px;color:#6b6b80;">
        {#each folders as f}
          <div style="display:flex;align-items:center;gap:5px;">
            <div style="width:9px;height:9px;border-radius:4.5px;background:{f.color};"></div>
            {f.name}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
