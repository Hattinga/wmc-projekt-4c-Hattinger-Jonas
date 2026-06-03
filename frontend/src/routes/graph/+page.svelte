<script>
  import { goto } from '$app/navigation';
  import Icon from '$lib/components/ui/Icon.svelte';
  import GraphView from '$lib/components/graph/GraphView.svelte';
  import * as api from '$lib/services/api.js';
  import { appState } from '$lib/stores/appState.svelte.js';

  const FOLDER_COLORS = {
    'Arbeit':       '#e94560',
    'Entwicklung':  '#4ea8de',
    'Tagebuch':     '#ffb627',
    'Notizen':      '#7c9eb2',
  };
  const DEFAULT_FOLDER_COLOR = '#888899';

  function folderColor(name) {
    return FOLDER_COLORS[name] ?? DEFAULT_FOLDER_COLOR;
  }

  let graphData = $state({ nodes: [], edges: [] });
  let loading = $state(true);

  let graphViewRef = $state(null);

  let activeFilters = $state(new Set());
  let searchQuery = $state('');

  $effect(() => {
    api.getGraph()
      .then(data => {
        graphData = data ?? { nodes: [], edges: [] };
      })
      .catch(err => {
        console.error('Graph load error:', err);
        graphData = { nodes: [], edges: [] };
      })
      .finally(() => {
        loading = false;
      });
  });

  let filteredNodes = $derived(
    searchQuery
      ? graphData.nodes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : graphData.nodes
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
    <span style="font-size:12px;color:#888899;">{filteredNodes.length} Notizen · {graphData.edges.length} Verbindungen</span>
    <span style="flex:1;"></span>
    <button onclick={() => graphViewRef?.reheat()} style="display:flex;align-items:center;gap:6px;height:34px;padding:0 10px;font-size:12px;font-weight:500;color:#1a1a2e;border:1px solid rgba(26,26,46,0.10);border-radius:8px;background:#fff;cursor:pointer;font-family:inherit;">
      <Icon name="refresh" size={13} /> Neu anordnen
    </button>
    <div style="width:34px;height:34px;border-radius:17px;background:linear-gradient(135deg,#1a1a2e,#2d2d4a);color:#fff;font-weight:600;font-size:12px;display:flex;align-items:center;justify-content:center;">
      {appState.currentUser?.username?.slice(0,2).toUpperCase() ?? 'MN'}
    </div>
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
      {#each appState.folders as f}
        {@const fc = folderColor(f.name)}
        <label style="display:flex;align-items:center;gap:8px;padding:5px 6px;border-radius:5px;cursor:pointer;font-size:12.5px;color:#1a1a2e;background:{activeFilters.has(f.id) ? 'rgba(233,69,96,0.04)' : 'transparent'};">
          <div style="width:14px;height:14px;border-radius:4px;background:{activeFilters.has(f.id) ? fc : '#fff'};border:1.5px solid {activeFilters.has(f.id) ? fc : 'rgba(26,26,46,0.20)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            {#if activeFilters.has(f.id)}<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>{/if}
          </div>
          <input type="checkbox" checked={activeFilters.has(f.id)} onchange={() => toggleFilter(f.id)} style="display:none;" />
          <span style="flex:1;font-weight:{activeFilters.has(f.id) ? 500 : 400};">{f.name}</span>
        </label>
      {/each}
      {#if appState.folders.length === 0}
        <div style="font-size:11.5px;color:#888899;padding:4px 6px;">Keine Ordner vorhanden</div>
      {/if}
    </div>

    <div>
      <div style="font-size:10px;font-weight:600;color:#888899;letter-spacing:0.8px;text-transform:uppercase;margin-bottom:6px;">Tags</div>
      <div style="font-size:11.5px;color:#888899;padding:4px 6px;">Kommt in KW 23</div>
    </div>

    <span style="flex:1;"></span>

    <div style="font-size:10.5px;color:#888899;border-top:1px solid rgba(26,26,46,0.06);padding-top:10px;">
      <strong style="color:#1a1a2e;">Tipp:</strong> Klicke auf einen Node, um zur Notiz zu springen. Ziehe Nodes um sie neu zu positionieren.
    </div>
  </div>

  <!-- Graph canvas -->
  <div style="position:absolute;top:56px;left:280px;right:0;bottom:0;">
    <div style="position:relative;width:100%;height:100%;">
      {#if loading}
        <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#888899;font-size:14px;">
          Graph wird geladen…
        </div>
      {:else}
        <GraphView bind:this={graphViewRef} nodes={filteredNodes} edges={graphData.edges} />
      {/if}

      <!-- Legend -->
      {#if appState.folders.length > 0}
        <div style="position:absolute;left:24px;bottom:24px;background:#fff;border-radius:10px;padding:10px 14px;border:1px solid rgba(26,26,46,0.08);box-shadow:0 4px 16px rgba(26,26,46,0.04);display:flex;align-items:center;gap:14px;font-size:11.5px;color:#6b6b80;">
          {#each appState.folders as f}
            <div style="display:flex;align-items:center;gap:5px;">
              <div style="width:9px;height:9px;border-radius:4.5px;background:{folderColor(f.name)};"></div>
              {f.name}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
