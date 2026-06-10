<script>
  import Icon from '$lib/components/ui/Icon.svelte';
  import { t } from '$lib/i18n/index.js';

  let { onFormat = () => {}, onInsertLink = () => {} } = $props();

  // Nur Keys speichern – t() muss im Markup laufen, sonst friert die Übersetzung ein
  const tools = [
    { ic: 'bold', key: 'editor.tools.bold', shortcut: '⌘B', syntax: '**' },
    { ic: 'italic', key: 'editor.tools.italic', shortcut: '⌘I', syntax: '*' },
    null,
    { ic: 'h1', key: 'editor.tools.h1', prefix: '# ' },
    { ic: 'h2', key: 'editor.tools.h2', prefix: '## ' },
    { ic: 'h3', key: 'editor.tools.h3', prefix: '### ' },
    null,
    { ic: 'list', key: 'editor.tools.list', prefix: '- ' },
    { ic: 'quote', key: 'editor.tools.quote', prefix: '> ' },
    { ic: 'code', key: 'editor.tools.code', syntax: '`' },
    { ic: 'link', key: 'editor.tools.link', shortcut: '⌘K' },
    null,
  ];
</script>

<div style="height:44px;border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 12px;gap:2px;flex-shrink:0;background:var(--surface);">
  {#each tools as tool, i}
    {#if tool === null}
      <div style="width:1px;height:18px;background:var(--border);margin:0 4px;"></div>
    {:else}
      <button
        title="{t(tool.key)}{tool.shortcut ? ' (' + tool.shortcut + ')' : ''}"
        onclick={() => onFormat(tool)}
        style="width:30px;height:30px;border:none;background:transparent;color:var(--text-secondary);cursor:pointer;border-radius:6px;display:flex;align-items:center;justify-content:center;"
        onmouseenter={(e) => e.currentTarget.style.background = 'var(--bg-muted)'}
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

</div>
