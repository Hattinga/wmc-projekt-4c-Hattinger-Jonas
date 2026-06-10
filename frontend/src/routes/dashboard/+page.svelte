<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Icon from '$lib/components/ui/Icon.svelte';
  import NoteCard from '$lib/components/notes/NoteCard.svelte';
  import { appState } from '$lib/stores/appState.svelte.js';
  import { t, setLocale } from '$lib/i18n/index.js';
  import { escapeHtml } from '$lib/utils/markdown.js';
  import { formatDate } from '$lib/utils/date.js';
  import * as api from '$lib/services/api.js';

  let notes = $state([]);
  let selectedId = $state(null);
  let sortBy = $state('updated');
  let langOpen = $state(false);
  let creating = $state(false);

  $effect(() => {
    api.getNotes().then(r => {
      notes = r.notes ?? [];
      // Wenn selectedId nicht mehr existiert, zurücksetzen
      if (selectedId !== null && !notes.find(n => n.id === selectedId)) {
        selectedId = notes.length > 0 ? notes[0].id : null;
      } else if (selectedId === null && notes.length > 0) {
        selectedId = notes[0].id;
      }
    }).catch(() => {});
  });

  // Ordner-Filter aus der URL (?folder=<id>, von der Sidebar gesetzt)
  let activeFolderId = $derived(Number($page.url.searchParams.get('folder')) || null);

  function findFolder(tree, id) {
    for (const f of tree ?? []) {
      if (f.id === id) return f;
      const child = findFolder(f.children, id);
      if (child) return child;
    }
    return null;
  }
  let activeFolder = $derived(findFolder(appState.folders, activeFolderId));

  let selectedNote = $derived(notes.find(n => n.id === selectedId));
  let sortedNotes = $derived([...notes].sort((a, b) => {
    if (sortBy === 'alpha') return (a.title ?? '').localeCompare(b.title ?? '');
    return new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
  }));
  let folderNotes = $derived(
    activeFolderId ? sortedNotes.filter(n => n.folder_id === activeFolderId) : sortedNotes
  );
  let filteredNotes = $derived(
    appState.searchQuery
      ? folderNotes.filter(n =>
          (n.title ?? '').toLowerCase().includes(appState.searchQuery.toLowerCase()) ||
          n.content?.toLowerCase().includes(appState.searchQuery.toLowerCase())
        )
      : folderNotes
  );

  async function createNote() {
    if (creating) return;
    creating = true;
    try {
      // Im aktiven Ordner erstellen, wenn ein Ordner-Filter gesetzt ist
      const r = await api.createNote({ title: t('dashboard.newNote'), content: '', folderId: activeFolderId ?? undefined });
      goto(`/note/${r.note.id}`);
    } finally {
      creating = false;
    }
  }

  function formatWikiLinks(text) {
    if (!text) return '';
    // Erst escapen, dann nur [[Wiki-Link]]-Spans einfügen
    const escaped = escapeHtml(text);
    return escaped.replace(/\[\[([^\]]+)\]\]/g,
      '<span style="color:#e94560;font-weight:500;background:rgba(233,69,96,0.08);padding:0 3px;border-radius:3px;">$1</span>'
    );
  }
</script>

<div style="width:100%;height:100%;display:flex;font-family:Inter,system-ui,sans-serif;overflow:hidden;background:#fff;color:#1a1a2e;">

  <!-- Center: Topbar + Note list -->
  <div style="flex:1;display:flex;flex-direction:column;min-width:0;">

    <!-- Topbar -->
    <div class="pl-14 pr-5 sm:px-5" style="height:56px;border-bottom:1px solid rgba(26,26,46,0.08);display:flex;align-items:center;gap:16px;background:#fff;flex-shrink:0;">
      <div style="flex:1;max-width:420px;display:flex;align-items:center;gap:10px;background:#f6f5f2;border-radius:8px;padding:0 12px;height:36px;">
        <Icon name="search" size={15} color="#888899" />
        <input
          bind:value={appState.searchQuery}
          placeholder={t('dashboard.searchPlaceholder')}
          style="flex:1;border:none;background:transparent;outline:none;font-size:13px;color:#1a1a2e;font-family:inherit;"
        />
      </div>
      <div style="flex:1;"></div>
      <!-- Language toggle -->
      <div style="position:relative;">
        <button
          onclick={() => langOpen = !langOpen}
          style="display:flex;align-items:center;gap:6px;height:34px;padding:0 8px;border-radius:8px;border:none;background:transparent;cursor:pointer;font-size:12px;font-weight:600;font-family:inherit;"
        >
          <span>{appState.locale === 'de' ? '🇩🇪' : '🇬🇧'}</span>
          <span>{appState.locale === 'de' ? 'DE' : 'EN'}</span>
          <Icon name="chevDown" size={11} color="#888899" />
        </button>
        {#if langOpen}
          <div style="position:absolute;top:calc(100% + 4px);right:0;background:#fff;border:1px solid rgba(26,26,46,0.10);border-radius:8px;padding:4px;min-width:110px;box-shadow:0 8px 24px rgba(26,26,46,0.10);z-index:50;">
            {#each [['de', '🇩🇪', 'Deutsch'], ['en', '🇬🇧', 'English']] as [code, flag, label]}
              <button onclick={() => { setLocale(code); langOpen = false; }} style="display:flex;align-items:center;gap:8px;width:100%;border:none;background:{appState.locale === code ? '#f6f5f2' : 'transparent'};padding:7px 10px;border-radius:5px;font-size:12.5px;font-weight:500;color:#1a1a2e;cursor:pointer;font-family:inherit;">
                {flag} {label}
              </button>
            {/each}
          </div>
        {/if}
      </div>
      <!-- Avatar -->
      <div style="width:34px;height:34px;border-radius:17px;background:linear-gradient(135deg,#1a1a2e,#2d2d4a);color:#fff;font-weight:600;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;" onclick={() => goto('/settings')}>
        {(appState.currentUser?.username || 'U').slice(0, 2).toUpperCase()}
      </div>
    </div>

    <!-- Notes list area -->
    <div style="flex:1;display:flex;min-height:0;">

      <!-- Note list column -->
      <div class="w-full sm:w-[360px] flex flex-col min-h-0 shrink-0" style="border-right:1px solid rgba(26,26,46,0.08);">
        <div style="padding:20px 20px 14px;">
          <div style="display:flex;align-items:baseline;justify-content:space-between;">
            <h2 style="margin:0;font-size:19px;font-weight:700;letter-spacing:-0.4px;display:flex;align-items:center;gap:8px;">
              {activeFolder ? activeFolder.name : t('dashboard.allNotes')}
              {#if activeFolderId}
                <button onclick={() => goto('/dashboard')} title={t('dashboard.removeFilter')} aria-label={t('dashboard.removeFilter')} style="border:1px solid rgba(26,26,46,0.12);background:#f6f5f2;color:#6b6b80;border-radius:10px;padding:2px 8px;font-size:11px;font-weight:500;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:4px;">
                  <Icon name="x" size={10} /> {t('dashboard.filter')}
                </button>
              {/if}
            </h2>
            <span style="font-size:12px;color:#888899;">{filteredNotes.length} {t('dashboard.entries')}</span>
          </div>
          <div style="display:flex;gap:6px;margin-top:12px;font-size:12px;">
            {#each [['updated', t('dashboard.sortUpdated')], ['alpha', t('dashboard.sortAlpha')]] as [key, label]}
              <button
                onclick={() => sortBy = key}
                style="border:1px solid rgba(26,26,46,0.10);background:{sortBy === key ? '#1a1a2e' : '#fff'};color:{sortBy === key ? '#fff' : '#1a1a2e'};padding:4px 10px;border-radius:14px;font-size:11.5px;font-weight:500;cursor:pointer;font-family:inherit;"
              >{label}</button>
            {/each}
          </div>
        </div>
        <div style="flex:1;overflow:auto;padding:0 12px 12px;">
          {#each filteredNotes as note (note.id)}
            <NoteCard {note} selected={note.id === selectedId} onclick={() => {
              // Mobile (Preview ausgeblendet): direkt zur Notiz navigieren
              if (window.matchMedia('(max-width: 639px)').matches) goto(`/note/${note.id}`);
              else selectedId = note.id;
            }} />
          {/each}
          {#if filteredNotes.length === 0}
            <div style="padding:32px 16px;text-align:center;color:#888899;font-size:13px;">
              {notes.length === 0 ? t('dashboard.emptyNoNotes') : t('dashboard.emptyNotFound')}
            </div>
          {/if}
        </div>
      </div>

      <!-- Preview column (auf Mobile ausgeblendet – NoteCard navigiert dort direkt) -->
      <div class="hidden sm:block" style="flex:1;overflow:auto;padding:32px;min-width:0;background:#fafaf8;">
        {#if selectedNote}
          <div style="max-width:640px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
              <div style="width:8px;height:8px;border-radius:4px;background:{selectedNote.color || '#7c9eb2'};"></div>
              <span style="font-size:12px;color:#888899;font-weight:500;">{selectedNote.folder || 'Notizen'}</span>
              <span style="color:#cccfd7;">·</span>
              <span style="font-size:12px;color:#888899;">{formatDate(selectedNote.updated_at)}</span>
              <span style="flex:1;"></span>
              <button onclick={() => goto(`/note/${selectedNote.id}`)} style="height:32px;padding:0 12px;border:none;border-radius:8px;background:#e94560;color:#fff;font-weight:600;font-size:12px;cursor:pointer;font-family:inherit;">{t('dashboard.open')}</button>
            </div>
            <h1 style="margin:0;font-size:32px;font-weight:700;letter-spacing:-0.8px;margin-bottom:12px;">{selectedNote.title}</h1>
            {#if selectedNote.tags?.length}
              <div style="display:flex;gap:6px;margin-bottom:24px;flex-wrap:wrap;">
                {#each selectedNote.tags as tag}
                  <span style="font-size:11.5px;padding:3px 9px;border-radius:12px;background:#fff;border:1px solid rgba(26,26,46,0.10);color:#6b6b80;font-weight:500;">#{typeof tag === 'string' ? tag : tag.name}</span>
                {/each}
              </div>
            {/if}
            <div style="font-size:14.5px;line-height:1.65;color:#1a1a2e;">
              {@html formatWikiLinks(selectedNote.content?.slice(0, 300))}
            </div>
            <div style="margin-top:28px;padding:16px;background:#fff;border:1px solid rgba(26,26,46,0.08);border-radius:10px;">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
                <Icon name="link2" size={14} color="#e94560" />
                <span style="font-size:12.5px;font-weight:600;color:#1a1a2e;">{selectedNote.backlinks ?? 0} {t('dashboard.backlinks')}</span>
              </div>
              {#if !selectedNote.backlinks}
                <div style="font-size:12px;color:#888899;">{t('dashboard.noBacklinks')}</div>
              {/if}
            </div>
          </div>
        {:else if notes.length === 0}
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#888899;gap:12px;">
            <Icon name="penLine" size={32} color="#cccfd7" />
            <p style="margin:0;font-size:14px;">{t('dashboard.emptyFirstNote')}</p>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- FAB -->
  <button
    onclick={createNote}
    disabled={creating}
    style="position:fixed;bottom:28px;right:28px;height:48px;padding:0 18px 0 14px;border:none;border-radius:24px;background:{creating ? '#c4384f' : '#e94560'};color:#fff;font-weight:600;font-size:13.5px;cursor:{creating ? 'not-allowed' : 'pointer'};font-family:inherit;display:flex;align-items:center;gap:8px;box-shadow:0 6px 22px rgba(233,69,96,0.40),0 2px 6px rgba(233,69,96,0.20);z-index:5;"
  >
    <Icon name="plus" size={18} color="#fff" strokeWidth={2.4} />
    {creating ? '…' : t('dashboard.newNote')}
  </button>
</div>
