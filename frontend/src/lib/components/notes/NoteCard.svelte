<script>
  import Icon from '$lib/components/ui/Icon.svelte';
  import { escapeHtml } from '$lib/utils/markdown.js';
  import { formatDate } from '$lib/utils/date.js';

  let { note, selected = false, onclick = () => {} } = $props();

  const folderColors = {
    'Arbeit': '#e94560',
    'Entwicklung': '#4ea8de',
    'Tagebuch': '#ffb627',
    'Notizen': '#7c9eb2',
  };

  let color = $derived(note.color || folderColors[note.folder] || '#7c9eb2');

  function renderPreview(text) {
    if (!text) return '';
    const escaped = escapeHtml(text);
    return escaped.replace(/\[\[([^\]]+)\]\]/g,
      '<span style="color:#e94560;font-weight:500;background:rgba(233,69,96,0.08);padding:0 3px;border-radius:3px;">$1</span>'
    );
  }
</script>

<div
  {onclick}
  role="button"
  tabindex="0"
  onkeydown={(e) => e.key === 'Enter' && onclick()}
  style="padding:12px 14px;border-radius:8px;cursor:pointer;background:{selected ? '#fff' : 'transparent'};border:1px solid {selected ? 'rgba(233,69,96,0.40)' : 'transparent'};box-shadow:{selected ? '0 2px 8px rgba(26,26,46,0.06)' : 'none'};margin-bottom:4px;position:relative;transition:all 0.15s;"
>
  {#if selected}
    <div style="position:absolute;left:-1px;top:12px;bottom:12px;width:3px;background:#e94560;border-radius:2px;"></div>
  {/if}

  <!-- Header: Ordner + Datum -->
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
    <div style="width:6px;height:6px;border-radius:3px;background:{color};flex-shrink:0;"></div>
    <span style="font-size:11px;color:#888899;font-weight:500;">{note.folder || 'Notizen'}</span>
    <span style="flex:1;"></span>
    <span style="font-size:11px;color:#888899;">{formatDate(note.updated_at)}</span>
  </div>

  <!-- Titel -->
  <div style="font-size:14px;font-weight:600;color:#1a1a2e;margin-bottom:4px;letter-spacing:-0.2px;">{note.title}</div>

  <!-- Vorschau -->
  <div
    style="font-size:12.5px;color:#6b6b80;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;"
  >
    {@html renderPreview(note.preview || note.content?.slice(0, 120) || '')}
  </div>

  <!-- Tags -->
  {#if note.tags?.length}
    <div style="display:flex;gap:4px;margin-top:8px;flex-wrap:wrap;">
      {#each note.tags.slice(0, 3) as tag}
        <span style="font-size:10.5px;padding:1px 6px;border-radius:8px;background:#f1f0ec;color:#6b6b80;font-weight:500;">#{typeof tag === 'string' ? tag : tag.name}</span>
      {/each}
    </div>
  {/if}
</div>
