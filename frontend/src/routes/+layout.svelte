<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Sidebar from '$lib/components/layout/Sidebar.svelte';

  let { children } = $props();

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
</script>

{#if isPublicRoute}
  {@render children()}
{:else if hasToken}
  <div style="display:flex;height:100vh;overflow:hidden;font-family:Inter,system-ui,sans-serif;">
    <Sidebar />
    <main style="flex:1;min-width:0;overflow:hidden;display:flex;flex-direction:column;">
      {@render children()}
    </main>
  </div>
{/if}
