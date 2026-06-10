<script>
  import Icon from '$lib/components/ui/Icon.svelte';
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n/index.js';
  import { escapeHtml } from '$lib/utils/markdown.js';

  let { backlinks = [], noteId = '' } = $props();
  let open = $state(true);

  const folderColors = {
    'Arbeit': '#e94560', 'Entwicklung': '#4ea8de',
    'Tagebuch': '#ffb627', 'Notizen': '#7c9eb2',
  };

  function renderPreview(text) {
    if (!text) return '';
    const escaped = escapeHtml(text);
    return escaped.replace(/\[\[([^\]]+)\]\]/g,
      '<span style="color:#e94560;font-weight:500;">$1</span>'
    );
  }
</script>

<div style="border-top:1px solid rgba(26,26,46,0.10);background:#fff;flex-shrink:0;">
  <!-- Header -->
  <div style="width:100%;height:44px;padding:0 20px;display:flex;align-items:center;gap:10px;">
    <button
      onclick={() => open = !open}
      style="display:flex;align-items:center;gap:10px;flex:1;cursor:pointer;border:none;background:transparent;font-family:inherit;padding:0;height:100%;"
      aria-expanded={open}
    >
      <Icon name={open ? 'chevDown' : 'chevRight'} size={14} color="#888899" />
      <Icon name="link2" size={14} color="#e94560" />
      <span style="font-size:13px;font-weight:600;color:#1a1a2e;">{backlinks.length} Backlinks</span>
      <span style="font-size:12px;color:#888899;">· {t('editor.backlinksHint')}</span>
    </button>
    <button
      onclick={() => goto('/graph')}
      style="width:28px;height:28px;border-radius:6px;border:none;background:transparent;color:#6b6b80;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;"
      aria-label={t('editor.openGraph')}
    >
      <Icon name="graph" size={13} />
    </button>
  </div>

  {#if open}
    <div style="padding:4px 20px 16px;display:flex;gap:10px;overflow-x:auto;">
      {#each backlinks as note (note.id)}
        <button
          onclick={() => goto(`/note/${note.id}`)}
          style="min-width:220px;padding:10px 12px;background:#fafaf8;border:1px solid rgba(26,26,46,0.08);border-radius:8px;flex-shrink:0;text-align:left;cursor:pointer;font-family:inherit;"
        >
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
            <Icon name="fileText" size={11} color={folderColors[note.folder] || '#7c9eb2'} />
            <span style="font-size:10.5px;color:#888899;">{note.folder}</span>
          </div>
          <div style="font-size:13px;font-weight:600;color:#1a1a2e;margin-bottom:4px;">{note.title}</div>
          <div style="font-size:11.5px;color:#6b6b80;line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
            {@html renderPreview(note.preview || note.content?.slice(0, 80) || '')}
          </div>
        </button>
      {/each}
      {#if backlinks.length === 0}
        <div style="font-size:12.5px;color:#888899;padding:4px 0;">{t('editor.noBacklinks')}</div>
      {/if}
    </div>
  {/if}
</div>
