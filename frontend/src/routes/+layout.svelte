<script>
  import '../app.css';
  import { page } from '$app/stores';
  import Sidebar from '$lib/components/layout/Sidebar.svelte';

  let { children } = $props();

  let isPublicRoute = $derived($page.url.pathname === '/auth' || $page.url.pathname === '/');
</script>

{#if isPublicRoute}
  {@render children()}
{:else}
  <div style="display:flex;height:100vh;overflow:hidden;font-family:Inter,system-ui,sans-serif;">
    <Sidebar />
    <main style="flex:1;min-width:0;overflow:hidden;display:flex;flex-direction:column;">
      {@render children()}
    </main>
  </div>
{/if}
