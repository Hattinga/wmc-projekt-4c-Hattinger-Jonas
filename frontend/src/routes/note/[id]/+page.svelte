<script>
  import { goto, beforeNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import Icon from '$lib/components/ui/Icon.svelte';
  import Toolbar from '$lib/components/editor/Toolbar.svelte';
  import MarkdownEditor from '$lib/components/editor/MarkdownEditor.svelte';
  import BacklinksPanel from '$lib/components/editor/BacklinksPanel.svelte';
  import { t } from '$lib/i18n/index.js';
  import * as api from '$lib/services/api.js';

  let noteId = $derived($page.params.id);

  let note = $state(null);
  let allNotes = $state([]);
  let title = $state('');
  let content = $state('');
  let saving = $state(false);
  let savedAt = $state(null);
  let saveError = $state('');
  let loadError = $state('');
  let backlinks = $state([]);
  let editorRef;
  let saveTimer = null; // component-local, reset on each note load

  // Load note + full notes list (needed for [[wiki-link]] preview resolution)
  $effect(() => {
    const id = noteId;
    loadError = '';
    saveError = '';
    savedAt = null;
    backlinks = [];
    clearTimeout(saveTimer);
    api.getNote(id).then(r => {
      note = r.note;
      title = note.title;
      content = note.content;
    }).catch((e) => {
      if (e.message?.includes('nicht gefunden') || e.message?.includes('404')) {
        goto('/dashboard');
      } else {
        loadError = t('editor.loadFailed');
      }
    });
    api.getNotes().then(r => { allNotes = r.notes ?? []; });
    api.getNoteBacklinks(id).then(r => { backlinks = r.backlinks ?? []; }).catch(() => {});
  });

  // Debounced autosave — 800ms nach letzter Änderung
  $effect(() => {
    const t = title;
    const c = content;
    const currentId = note?.id;
    if (!note || !currentId) return;
    if (t === note.title && c === note.content) return;
    if (!t?.trim()) return; // leerer Titel wird nicht gespeichert
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      if (note?.id !== currentId) return; // Note wurde gewechselt vor Timer-Ablauf
      saving = true;
      saveError = '';
      try {
        const r = await api.updateNote(currentId, { title: t, content: c });
        note = r.note;
        savedAt = new Date();
        api.getNoteBacklinks(currentId).then(res => { backlinks = res.backlinks ?? []; }).catch(() => {});
      } catch {
        saveError = t('editor.saveFailed');
      } finally {
        saving = false;
      }
    }, 800);
    return () => clearTimeout(saveTimer);
  });

  // Sofortiges Speichern bei Navigation (verhindert Lost-Update)
  beforeNavigate(() => {
    if (saveTimer && note) {
      clearTimeout(saveTimer);
      saveTimer = null;
      api.updateNote(note.id, { title, content }).catch(() => {});
    }
  });

  function handleFormat(tool) {
    editorRef?.applyFormat(tool);
  }

  function handleInsertLink() {
    editorRef?.insertLinkSyntax();
  }

  let deleting = $state(false);

  async function deleteNote() {
    if (!note || deleting) return;
    if (!confirm(t('editor.deleteConfirm', { title: note.title }))) return;
    deleting = true;
    try {
      clearTimeout(saveTimer);
      saveTimer = null; // verhindert Re-Save der gelöschten Note in beforeNavigate
      await api.deleteNote(note.id);
      note = null;
      goto('/dashboard');
    } catch {
      saveError = t('editor.deleteFailed');
      deleting = false;
    }
  }
</script>

<div style="width:100%;height:100%;display:flex;flex-direction:column;font-family:Inter,system-ui,sans-serif;background:#fff;overflow:hidden;color:#1a1a2e;">

  {#if loadError}
    <div style="padding:14px 20px;background:rgba(233,69,96,0.08);border-bottom:1px solid rgba(233,69,96,0.20);font-size:13px;color:#e94560;font-weight:500;">
      {loadError}
    </div>
  {/if}

  <!-- Topbar -->
  <div class="pl-14 pr-4 sm:px-4" style="height:52px;border-bottom:1px solid rgba(26,26,46,0.08);display:flex;align-items:center;gap:12px;flex-shrink:0;">
    <button onclick={() => goto('/dashboard')} style="width:34px;height:34px;border-radius:8px;border:none;background:transparent;color:#6b6b80;cursor:pointer;display:flex;align-items:center;justify-content:center;">
      <Icon name="chevLeft" size={18} />
    </button>
    <div class="hidden sm:flex" style="align-items:center;gap:6px;font-size:12.5px;color:#888899;">
      <Icon name="folder" size={13} color="#4ea8de" />
      <span>{note?.folder || 'Notizen'}</span>
      <Icon name="chevRight" size={11} />
      <span style="color:#1a1a2e;font-weight:500;">{title || '…'}</span>
    </div>
    <span style="flex:1;"></span>

    <!-- Save status badge -->
    {#if saveError}
      <div style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:500;padding:4px 10px;border-radius:12px;background:rgba(233,69,96,0.08);color:#e94560;">
        <Icon name="x" size={12} color="#e94560" strokeWidth={2.5} />
        {saveError}
      </div>
    {:else if saving || savedAt}
      <div style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:500;padding:4px 10px;border-radius:12px;background:{saving ? 'rgba(136,136,153,0.08)' : 'rgba(42,157,110,0.08)'};color:{saving ? '#888899' : '#2a9d6e'};">
        {#if saving}
          <span style="width:12px;height:12px;border:2px solid #ccc;border-top-color:#888899;border-radius:50%;display:inline-block;animation:spin 0.7s linear infinite;"></span>
          {t('editor.saving')}
        {:else}
          <Icon name="check" size={12} color="#2a9d6e" strokeWidth={2.5} />
          {t('editor.saved')}
        {/if}
      </div>
    {/if}

    {#if !title?.trim() && title !== ''}
      <div style="font-size:12px;color:#e94560;font-weight:500;">{t('editor.titleRequired')}</div>
    {/if}

    <button
      onclick={deleteNote}
      disabled={deleting}
      title={t('editor.deleteNote')} aria-label={t('editor.deleteNote')}
      style="width:34px;height:34px;border-radius:8px;border:none;background:transparent;color:#e94560;cursor:{deleting ? 'not-allowed' : 'pointer'};display:flex;align-items:center;justify-content:center;opacity:{deleting ? 0.5 : 1};"
    ><Icon name="trash" size={16} /></button>
  </div>

  <!-- Title -->
  <div class="px-4 pt-5 sm:px-7" style="flex-shrink:0;">
    <input
      bind:value={title}
      placeholder={t('editor.titlePlaceholder')}
      style="width:100%;border:none;outline:none;font-size:28px;font-weight:700;letter-spacing:-0.6px;color:#1a1a2e;font-family:inherit;background:transparent;padding:0;"
    />
  </div>

  <!-- Toolbar -->
  <Toolbar onFormat={handleFormat} onInsertLink={handleInsertLink} />

  <!-- Editor body (Mobile: Markdown/Vorschau gestapelt, ab sm nebeneinander) -->
  <div class="flex-1 flex flex-col sm:flex-row min-h-0">
    <MarkdownEditor
      bind:content
      bind:this={editorRef}
      notes={allNotes}
    />
  </div>

  <!-- Backlinks panel -->
  <BacklinksPanel {backlinks} {noteId} />
</div>

<style>
  @keyframes spin { to { transform: rotate(360deg); } }
</style>
