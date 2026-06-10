<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { goto, afterNavigate } from '$app/navigation';
  import Sidebar from '$lib/components/layout/Sidebar.svelte';
  import Icon from '$lib/components/ui/Icon.svelte';
  import { connectWs, disconnectWs } from '$lib/services/websocket.js';
  import { appState } from '$lib/stores/appState.svelte.js';

  let { children } = $props();

  // Mobile-Sidebar nach jeder Navigation schließen (deckt alle Links + goto() ab)
  afterNavigate(() => {
    appState.sidebarOpen = false;
  });

  let isPublicRoute = $derived($page.url.pathname === '/auth' || $page.url.pathname === '/');

  // Render-Gate: Token synchron aus localStorage lesen verhindert Dashboard-Flash
  let hasToken = $derived(
    typeof localStorage !== 'undefined' ? !!localStorage.getItem('zw-token') : false
  );

  $effect(() => {
    if (!isPublicRoute && !hasToken) {
      goto('/auth');
    }
  });

  $effect(() => {
    if (hasToken) {
      connectWs();
    } else {
      disconnectWs();
    }
  });
</script>

{#if isPublicRoute}
  {@render children()}
{:else if hasToken}
  <div class="flex h-screen overflow-hidden" style="font-family:Inter,system-ui,sans-serif;">
    <!-- Hamburger (nur Mobile) -->
    <button
      onclick={() => { appState.sidebarOpen = !appState.sidebarOpen; }}
      class="sm:hidden fixed top-2.5 left-3 z-30 flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-[rgba(26,26,46,0.10)] shadow-sm"
      title="Menü" aria-label="Menü öffnen"
    >
      <Icon name="menu" size={18} color="#1a1a2e" />
    </button>

    <!-- Overlay (nur Mobile, schließt Sidebar) -->
    {#if appState.sidebarOpen}
      <div
        class="sm:hidden fixed inset-0 bg-black/40 z-40"
        onclick={() => { appState.sidebarOpen = false; }}
        aria-hidden="true"
      ></div>
    {/if}

    <Sidebar />
    <main class="flex-1 min-w-0 overflow-hidden flex flex-col">
      {@render children()}
    </main>
  </div>
{/if}
