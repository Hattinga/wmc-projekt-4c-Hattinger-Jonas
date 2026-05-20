<script>
  import Icon from '$lib/components/ui/Icon.svelte';

  let { onFormat = () => {}, onInsertLink = () => {}, onTogglePreview = () => {} } = $props();

  const tools = [
    { ic: 'bold', label: 'Fett', shortcut: '⌘B', syntax: '**' },
    { ic: 'italic', label: 'Kursiv', shortcut: '⌘I', syntax: '*' },
    null,
    { ic: 'h1', label: 'Überschrift 1', prefix: '# ' },
    { ic: 'h2', label: 'Überschrift 2', prefix: '## ' },
    { ic: 'h3', label: 'Überschrift 3', prefix: '### ' },
    null,
    { ic: 'list', label: 'Liste', prefix: '- ' },
    { ic: 'quote', label: 'Zitat', prefix: '> ' },
    { ic: 'code', label: 'Code', syntax: '`' },
    { ic: 'link', label: 'Link', shortcut: '⌘K' },
    null,
  ];
</script>

<div style="height:44px;border-bottom:1px solid rgba(26,26,46,0.06);display:flex;align-items:center;padding:0 12px;gap:2px;flex-shrink:0;background:#fff;">
  {#each tools as tool, i}
    {#if tool === null}
      <div style="width:1px;height:18px;background:rgba(26,26,46,0.08);margin:0 4px;"></div>
    {:else}
      <button
        title="{tool.label}{tool.shortcut ? ' (' + tool.shortcut + ')' : ''}"
        onclick={() => onFormat(tool)}
        style="width:30px;height:30px;border:none;background:transparent;color:#6b6b80;cursor:pointer;border-radius:6px;display:flex;align-items:center;justify-content:center;"
        onmouseenter={(e) => e.currentTarget.style.background = '#f1f0ec'}
        onmouseleave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <Icon name={tool.ic} size={15} />
      </button>
    {/if}
  {/each}

  <!-- [[Notiz]]-Button -->
  <button
    onclick={onInsertLink}
    style="display:flex;align-items:center;gap:6px;height:28px;padding:0 10px;border-radius:6px;border:1px solid rgba(233,69,96,0.30);background:rgba(233,69,96,0.06);color:#e94560;font-weight:600;font-size:12px;cursor:pointer;font-family:inherit;"
  >
    <Icon name="link2" size={13} color="#e94560" />
    [[Notiz]]
    <span style="font-size:10px;opacity:0.7;margin-left:2px;">⌘L</span>
  </button>

  <span style="flex:1;"></span>

  <button
    onclick={onTogglePreview}
    style="height:28px;padding:0 12px;border:1px solid rgba(26,26,46,0.10);background:#fff;color:#1a1a2e;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:6px;"
  >
    <Icon name="eye" size={12} /> Nur Vorschau
  </button>
</div>
