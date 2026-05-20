<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Icon from '$lib/components/ui/Icon.svelte';
  import { appState } from '$lib/stores/appState.svelte.js';

  let { onNewNote = () => {} } = $props();

  let openFolders = $state(new Set(['entwicklung']));

  const quickLinks = [
    { ic: 'inbox', label: 'Eingang', count: 3, href: '/dashboard?filter=inbox' },
    { ic: 'star', label: 'Favoriten', count: 8, href: '/dashboard?filter=starred' },
    { ic: 'clock', label: 'Zuletzt', count: 12, href: '/dashboard', active: true },
  ];

  const navLinks = [
    { ic: 'home', label: 'Dashboard', href: '/dashboard' },
    { ic: 'graph', label: 'Graph', href: '/graph' },
    { ic: 'settings', label: 'Einstellungen', href: '/settings' },
  ];

  function toggleFolder(id) {
    if (openFolders.has(id)) openFolders.delete(id);
    else openFolders.add(id);
    openFolders = new Set(openFolders);
  }

  function logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('zw-token');
      localStorage.removeItem('zw-user');
    }
    appState.currentUser = null;
    goto('/auth');
  }
</script>

<aside style="width:240px;background:#1a1a2e;color:#fff;display:flex;flex-direction:column;flex-shrink:0;height:100%;overflow:hidden;">

  <!-- Logo -->
  <div style="padding:18px 18px 14px;display:flex;align-items:center;gap:8px;">
    <div style="width:28px;height:28px;border-radius:6px;background:#e94560;display:flex;align-items:center;justify-content:center;">
      <Icon name="penLine" size={14} color="#fff" strokeWidth={2.2} />
    </div>
    <span style="font-size:16px;font-weight:700;letter-spacing:-0.3px;color:#fff;">Zettlwirtschaft</span>
  </div>

  <!-- Quick links -->
  <div style="padding:4px 10px 12px;">
    {#each quickLinks as item}
      <a href={item.href} style="display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:7px;cursor:pointer;background:{item.active ? 'rgba(233,69,96,0.14)' : 'transparent'};color:{item.active ? '#fff' : 'rgba(255,255,255,0.78)'};font-size:13px;font-weight:500;border-left:{item.active ? '2px solid #e94560' : '2px solid transparent'};padding-left:{item.active ? '8px' : '10px'};text-decoration:none;">
        <Icon name={item.ic} size={15} />
        <span style="flex:1;">{item.label}</span>
        <span style="font-size:11px;opacity:0.55;">{item.count}</span>
      </a>
    {/each}
  </div>

  <!-- Ordner -->
  <div style="padding:6px 10px 10px;">
    <div style="font-size:10.5px;font-weight:600;color:rgba(255,255,255,0.45);letter-spacing:0.8px;text-transform:uppercase;padding:6px 8px;">Ordner</div>
    {#each appState.folders.length ? appState.folders : defaultFolders as folder}
      <div>
        <button
          onclick={() => folder.children && toggleFolder(folder.id)}
          style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;color:rgba(255,255,255,0.78);font-size:12.5px;font-weight:500;width:100%;border:none;background:transparent;"
        >
          {#if folder.children}
            <Icon name={openFolders.has(folder.id) ? 'chevDown' : 'chevRight'} size={12} color="rgba(255,255,255,0.5)" />
          {:else}
            <span style="width:12px;"></span>
          {/if}
          <Icon name={openFolders.has(folder.id) ? 'folderOpen' : 'folder'} size={14} color={folder.color || 'rgba(255,255,255,0.6)'} />
          <span style="flex:1;text-align:left;">{folder.name}</span>
          <span style="font-size:11px;opacity:0.5;">{folder.count}</span>
        </button>
        {#if openFolders.has(folder.id) && folder.children}
          {#each folder.children as child}
            <button style="display:flex;align-items:center;gap:8px;padding:5px 8px 5px 34px;border-radius:6px;cursor:pointer;color:rgba(255,255,255,0.65);font-size:12px;font-weight:500;width:100%;border:none;background:transparent;">
              <Icon name="folder" size={13} color="rgba(255,255,255,0.5)" />
              <span style="flex:1;text-align:left;">{child.name}</span>
              <span style="font-size:11px;opacity:0.4;">{child.count}</span>
            </button>
          {/each}
        {/if}
      </div>
    {/each}
  </div>

  <!-- Tags -->
  <div style="padding:6px 10px 10px;">
    <div style="font-size:10.5px;font-weight:600;color:rgba(255,255,255,0.45);letter-spacing:0.8px;text-transform:uppercase;padding:6px 8px;">Tags</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;padding:4px 8px 0;">
      {#each appState.tags.length ? appState.tags : defaultTags as tag}
        <span style="font-size:11px;padding:3px 8px;border-radius:10px;background:oklch(0.32 0.07 {tag.hue});color:oklch(0.92 0.08 {tag.hue});border:1px solid oklch(0.42 0.10 {tag.hue} / 0.6);display:inline-flex;align-items:center;gap:4px;font-weight:500;cursor:pointer;">
          #{tag.name}
          <span style="opacity:0.5;font-size:10px;">{tag.count}</span>
        </span>
      {/each}
    </div>
  </div>

  <div style="flex:1;"></div>

  <!-- Nav bottom links -->
  <div style="padding:4px 10px 8px;">
    {#each navLinks as link}
      <a href={link.href} style="display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:7px;color:rgba(255,255,255,0.55);font-size:12.5px;font-weight:500;text-decoration:none;">
        <Icon name={link.ic} size={14} color="rgba(255,255,255,0.5)" />
        {link.label}
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
        <button onclick={logout} style="background:none;border:none;cursor:pointer;padding:2px;border-radius:4px;" title="Abmelden">
          <Icon name="arrowRight" size={14} color="rgba(255,255,255,0.5)" />
        </button>
      </div>
    </div>
  {/if}
</aside>

<script context="module">
  // Fallback-Daten für Entwicklung (werden durch API ersetzt)
  const defaultFolders = [
    { id: 'arbeit', name: 'Arbeit', count: 12, color: '#e94560', children: [
      { id: 'meetings', name: 'Meetings', count: 5 },
      { id: 'sprints', name: 'Sprints', count: 7 },
    ]},
    { id: 'entwicklung', name: 'Entwicklung', count: 23, color: '#4ea8de', children: [
      { id: 'frontend', name: 'Frontend', count: 9 },
      { id: 'backend', name: 'Backend', count: 8 },
    ]},
    { id: 'tagebuch', name: 'Tagebuch', count: 47, color: '#ffb627' },
    { id: 'notizen', name: 'Notizen', count: 38, color: '#7c9eb2' },
  ];
  const defaultTags = [
    { name: 'sprint', count: 12, hue: 0 },
    { name: 'svelte', count: 18, hue: 25 },
    { name: 'zettelkasten', count: 9, hue: 200 },
    { name: 'reflektion', count: 14, hue: 280 },
  ];
</script>
