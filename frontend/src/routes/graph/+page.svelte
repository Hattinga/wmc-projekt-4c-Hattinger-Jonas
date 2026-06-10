<script>
  import { goto } from '$app/navigation';
  import Icon from '$lib/components/ui/Icon.svelte';
  import GraphView from '$lib/components/graph/GraphView.svelte';
  import * as api from '$lib/services/api.js';
  import { appState } from '$lib/stores/appState.svelte.js';
  import { t } from '$lib/i18n/index.js';

  let graphData = $state({ nodes: [], edges: [] });
  let loading = $state(true);

  let graphViewRef = $state(null);

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
</script>

<div style="width:100%;height:100%;position:relative;overflow:hidden;background:var(--bg);font-family:Inter,system-ui,sans-serif;color:var(--text);">

  <!-- Topbar -->
  <div class="pl-14 pr-5 sm:px-5" style="position:absolute;top:0;left:0;right:0;height:56px;display:flex;align-items:center;gap:14px;background:var(--surface-glass);backdrop-filter:blur(10px);border-bottom:1px solid var(--border);z-index:3;">
    <button onclick={() => goto('/dashboard')} style="width:34px;height:34px;border-radius:8px;border:none;background:transparent;color:var(--text-secondary);cursor:pointer;display:flex;align-items:center;justify-content:center;">
      <Icon name="chevLeft" size={18} />
    </button>
    <h2 style="margin:0;font-size:17px;font-weight:700;letter-spacing:-0.3px;">{t('graph.title')}</h2>
    <span style="font-size:12px;color:var(--text-muted);">{filteredNodes.length} {t('graph.notes')} · {graphData.edges.length} {t('graph.connections')}</span>
    <span style="flex:1;"></span>
    <button onclick={() => graphViewRef?.reheat()} style="display:flex;align-items:center;gap:6px;height:34px;padding:0 10px;font-size:12px;font-weight:500;color:var(--text);border:1px solid var(--border-strong);border-radius:8px;background:var(--surface);cursor:pointer;font-family:inherit;">
      <Icon name="refresh" size={13} /> {t('graph.rearrange')}
    </button>
    <div style="width:34px;height:34px;border-radius:17px;background:linear-gradient(135deg,#1a1a2e,#2d2d4a);color:#fff;font-weight:600;font-size:12px;display:flex;align-items:center;justify-content:center;">
      {appState.currentUser?.username?.slice(0,2).toUpperCase() ?? 'MN'}
    </div>
  </div>

  <!-- Filter Sidebar (auf Mobile ausgeblendet, Graph braucht die volle Breite) -->
  <div class="hidden sm:flex" style="position:absolute;top:76px;left:20px;bottom:20px;width:240px;background:var(--surface);border-radius:12px;padding:16px;border:1px solid var(--border);box-shadow:0 4px 16px rgba(26,26,46,0.04);flex-direction:column;gap:14px;z-index:2;overflow:auto;">
    <div style="display:flex;align-items:center;gap:8px;background:var(--bg-muted);border-radius:7px;padding:0 10px;height:32px;">
      <Icon name="search" size={14} color="#888899" />
      <input
        bind:value={searchQuery}
        placeholder={t('graph.searchPlaceholder')}
        style="flex:1;border:none;background:transparent;outline:none;font-size:12.5px;color:var(--text);font-family:inherit;min-width:0;"
      />
    </div>

    <span style="flex:1;"></span>

    <div style="font-size:10.5px;color:var(--text-muted);border-top:1px solid var(--border);padding-top:10px;">
      <strong style="color:var(--text);">{t('graph.tipLabel')}</strong> {t('graph.tip')}
    </div>
  </div>

  <!-- Graph canvas -->
  <div class="left-0 sm:left-[280px]" style="position:absolute;top:56px;right:0;bottom:0;">
    <div style="position:relative;width:100%;height:100%;">
      {#if loading}
        <div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:14px;">
          {t('graph.loading')}
        </div>
      {:else}
        <GraphView bind:this={graphViewRef} nodes={filteredNodes} edges={graphData.edges} />
      {/if}
    </div>
  </div>
</div>
