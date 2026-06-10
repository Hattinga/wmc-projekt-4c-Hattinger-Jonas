<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Icon from '$lib/components/ui/Icon.svelte';
  import { appState, logout } from '$lib/stores/appState.svelte.js';
  import { t } from '$lib/i18n/index.js';
  import * as api from '$lib/services/api.js';

  let { onNewNote = () => {} } = $props();

  let openFolders = $state(new Set());
  let creatingFolder = $state(false);
  let newFolderName = $state('');
  let folderError = $state('');

  // Aktiver Ordner-Filter aus der Dashboard-URL (?folder=<id>)
  let activeFolderId = $derived(Number($page.url.searchParams.get('folder')) || null);
  let onDashboard = $derived($page.url.pathname === '/dashboard');

  function buildTree(flat) {
    const ids = new Set(flat.map(f => f.id));
    const map = Object.fromEntries(flat.map(f => [f.id, { ...f, children: [] }]));
    const roots = [];
    for (const f of Object.values(map)) {
      // Orphan (unbekannter parent) und Selbstreferenz landen als Root
      const validParent = f.parent_id && ids.has(f.parent_id) && f.parent_id !== f.id;
      if (validParent) map[f.parent_id].children.push(f);
      else roots.push(f);
    }
    return roots;
  }

  async function loadFolders() {
    try {
      const r = await api.getFolders();
      appState.folders = buildTree(r.folders ?? []);
    } catch {}
  }

  // Trigger auf primitive userId, nicht auf das User-Objekt (verhindert endlose Re-Fetches)
  $effect(() => {
    const userId = appState.currentUser?.id;
    if (userId) {
      loadFolders();
      api.getTags().then(r => {
        appState.tags = r.tags ?? [];
      }).catch(() => {});
    }
  });

  // Nur Keys speichern – t() muss im Markup laufen, sonst friert die Übersetzung ein
  const navLinks = [
    { ic: 'home', key: 'nav.dashboard', href: '/dashboard' },
    { ic: 'graph', key: 'nav.graph', href: '/graph' },
    { ic: 'settings', key: 'nav.settings', href: '/settings' },
  ];

  function toggleFolder(id, event) {
    event.stopPropagation();
    if (openFolders.has(id)) openFolders.delete(id);
    else openFolders.add(id);
    openFolders = new Set(openFolders);
  }

  function filterByFolder(id) {
    goto(`/dashboard?folder=${id}`);
  }

  async function createFolder() {
    const name = newFolderName.trim();
    if (!name) return;
    folderError = '';
    try {
      await api.createFolder({ name });
      newFolderName = '';
      creatingFolder = false;
      await loadFolders();
    } catch (e) {
      folderError = e.message || t('sidebar.folderCreateError');
    }
  }

  async function removeFolder(folder, event) {
    event.stopPropagation();
    if (!confirm(t('sidebar.deleteFolderConfirm', { name: folder.name }))) return;
    try {
      await api.deleteFolder(folder.id);
      await loadFolders();
      if (activeFolderId === folder.id) goto('/dashboard');
    } catch {}
  }

  function handleLogout() {
    logout();
    goto('/auth');
  }
</script>

<aside
  class="w-60 flex flex-col shrink-0 h-full overflow-hidden fixed inset-y-0 left-0 z-50 transition-transform duration-200 sm:static sm:translate-x-0 {appState.sidebarOpen ? 'translate-x-0' : '-translate-x-full'}"
  style="background:#1a1a2e;color:#fff;"
>

  <!-- Logo -->
  <div style="padding:18px 18px 14px;display:flex;align-items:center;gap:8px;">
    <div style="width:28px;height:28px;border-radius:6px;background:#e94560;display:flex;align-items:center;justify-content:center;">
      <Icon name="penLine" size={14} color="#fff" strokeWidth={2.2} />
    </div>
    <span style="font-size:16px;font-weight:700;letter-spacing:-0.3px;color:#fff;">Zettlwirtschaft</span>
  </div>

  <!-- Alle Notizen -->
  <div style="padding:4px 10px 12px;">
    <a href="/dashboard" style="display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:7px;cursor:pointer;background:{onDashboard && !activeFolderId ? 'rgba(233,69,96,0.14)' : 'transparent'};color:{onDashboard && !activeFolderId ? '#fff' : 'rgba(255,255,255,0.78)'};font-size:13px;font-weight:500;border-left:{onDashboard && !activeFolderId ? '2px solid #e94560' : '2px solid transparent'};padding-left:{onDashboard && !activeFolderId ? '8px' : '10px'};text-decoration:none;">
      <Icon name="inbox" size={15} />
      <span style="flex:1;">{t('sidebar.allNotes')}</span>
    </a>
  </div>

  <!-- Ordner -->
  <div style="padding:6px 10px 10px;overflow-y:auto;">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 8px;">
      <span style="font-size:10.5px;font-weight:600;color:rgba(255,255,255,0.45);letter-spacing:0.8px;text-transform:uppercase;">{t('sidebar.folders')}</span>
      <button
        onclick={() => { creatingFolder = !creatingFolder; folderError = ''; }}
        title={t('sidebar.newFolder')} aria-label={t('sidebar.newFolder')}
        style="background:none;border:none;cursor:pointer;padding:2px;border-radius:4px;display:flex;"
      >
        <Icon name={creatingFolder ? 'x' : 'plus'} size={13} color="rgba(255,255,255,0.6)" />
      </button>
    </div>

    {#if creatingFolder}
      <div style="padding:2px 8px 8px;">
        <!-- svelte-ignore a11y_autofocus -->
        <input
          bind:value={newFolderName}
          onkeydown={(e) => { if (e.key === 'Enter') createFolder(); if (e.key === 'Escape') { creatingFolder = false; newFolderName = ''; } }}
          placeholder={t('sidebar.folderNamePlaceholder')}
          autofocus
          style="width:100%;box-sizing:border-box;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:6px 8px;font-size:12.5px;color:#fff;outline:none;font-family:inherit;"
        />
        {#if folderError}
          <div style="font-size:11px;color:#ff8896;padding:4px 2px 0;">{folderError}</div>
        {/if}
      </div>
    {/if}

    {#each appState.folders ?? [] as folder (folder.id)}
      <div>
        <div
          role="button" tabindex="0"
          onclick={() => filterByFolder(folder.id)}
          onkeydown={(e) => e.key === 'Enter' && filterByFolder(folder.id)}
          style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;color:{activeFolderId === folder.id ? '#fff' : 'rgba(255,255,255,0.78)'};background:{activeFolderId === folder.id ? 'rgba(233,69,96,0.14)' : 'transparent'};font-size:12.5px;font-weight:500;width:100%;box-sizing:border-box;"
        >
          {#if folder.children?.length}
            <button onclick={(e) => toggleFolder(folder.id, e)} aria-label={t('sidebar.showSubfolders')} style="background:none;border:none;cursor:pointer;padding:0;display:flex;">
              <Icon name={openFolders.has(folder.id) ? 'chevDown' : 'chevRight'} size={12} color="rgba(255,255,255,0.5)" />
            </button>
          {:else}
            <span style="width:12px;"></span>
          {/if}
          <Icon name={openFolders.has(folder.id) ? 'folderOpen' : 'folder'} size={14} color={folder.color || 'rgba(255,255,255,0.6)'} />
          <span style="flex:1;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{folder.name}</span>
          <button
            onclick={(e) => removeFolder(folder, e)}
            title={t('sidebar.deleteFolder')} aria-label={t('sidebar.deleteFolder')}
            style="background:none;border:none;cursor:pointer;padding:2px;border-radius:4px;display:flex;opacity:0.35;"
          >
            <Icon name="trash" size={12} color="#fff" />
          </button>
        </div>
        {#if openFolders.has(folder.id) && folder.children?.length}
          {#each folder.children as child (child.id)}
            <div
              role="button" tabindex="0"
              onclick={() => filterByFolder(child.id)}
              onkeydown={(e) => e.key === 'Enter' && filterByFolder(child.id)}
              style="display:flex;align-items:center;gap:8px;padding:5px 8px 5px 34px;border-radius:6px;cursor:pointer;color:{activeFolderId === child.id ? '#fff' : 'rgba(255,255,255,0.65)'};background:{activeFolderId === child.id ? 'rgba(233,69,96,0.14)' : 'transparent'};font-size:12px;font-weight:500;width:100%;box-sizing:border-box;"
            >
              <Icon name="folder" size={13} color="rgba(255,255,255,0.5)" />
              <span style="flex:1;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{child.name}</span>
              <button
                onclick={(e) => removeFolder(child, e)}
                title={t('sidebar.deleteFolder')} aria-label={t('sidebar.deleteFolder')}
                style="background:none;border:none;cursor:pointer;padding:2px;border-radius:4px;display:flex;opacity:0.35;"
              >
                <Icon name="trash" size={12} color="#fff" />
              </button>
            </div>
          {/each}
        {/if}
      </div>
    {/each}
    {#if !appState.folders?.length && !creatingFolder}
      <div style="font-size:11.5px;color:rgba(255,255,255,0.35);padding:4px 8px;">{t('sidebar.noFolders')}</div>
    {/if}
  </div>

  <!-- Tags -->
  <div style="padding:6px 10px 10px;">
    <div style="font-size:10.5px;font-weight:600;color:rgba(255,255,255,0.45);letter-spacing:0.8px;text-transform:uppercase;padding:6px 8px;">{t('sidebar.tags')}</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;padding:4px 8px 0;">
      {#each appState.tags ?? [] as tag (tag.id ?? tag.name)}
        <span style="font-size:11px;padding:3px 8px;border-radius:10px;background:oklch(0.32 0.07 {tag.hue ?? 200});color:oklch(0.92 0.08 {tag.hue ?? 200});border:1px solid oklch(0.42 0.10 {tag.hue ?? 200} / 0.6);display:inline-flex;align-items:center;gap:4px;font-weight:500;">
          #{tag.name}
        </span>
      {/each}
      {#if !appState.tags?.length}
        <span style="font-size:11.5px;color:rgba(255,255,255,0.35);">{t('sidebar.noTags')}</span>
      {/if}
    </div>
  </div>

  <div style="flex:1;"></div>

  <!-- Nav bottom links -->
  <div style="padding:4px 10px 8px;">
    {#each navLinks as link}
      <a href={link.href} style="display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:7px;color:rgba(255,255,255,0.55);font-size:12.5px;font-weight:500;text-decoration:none;">
        <Icon name={link.ic} size={14} color="rgba(255,255,255,0.5)" />
        {t(link.key)}
      </a>
    {/each}
  </div>

  <!-- User card -->
  {#if appState.currentUser}
    <div style="margin:14px;padding:12px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);">
      <div style="display:flex;align-items:center;gap:10px;font-size:12.5px;">
        <div style="width:32px;height:32px;border-radius:16px;background:linear-gradient(135deg,#e94560,#ff7858);display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:12px;flex-shrink:0;">
          {appState.currentUser.username?.slice(0,2).toUpperCase() || 'MN'}
        </div>
        <div style="min-width:0;flex:1;">
          <div style="font-weight:600;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{appState.currentUser.username}</div>
          <div style="color:rgba(255,255,255,0.5);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{appState.currentUser.email}</div>
        </div>
        <button onclick={handleLogout} style="background:none;border:none;cursor:pointer;padding:2px;border-radius:4px;" title={t('sidebar.logout')} aria-label={t('sidebar.logout')}>
          <Icon name="arrowRight" size={14} color="rgba(255,255,255,0.5)" />
        </button>
      </div>
    </div>
  {/if}
</aside>
