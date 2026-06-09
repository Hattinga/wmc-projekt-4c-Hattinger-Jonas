<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  // Direkt anhand des Tokens entscheiden statt Doppel-Hop über den Layout-Guard
  onMount(() => {
    const hasToken = !!localStorage.getItem('zw-token');
    goto(hasToken ? '/dashboard' : '/auth', { replaceState: true });
  });
</script>
