<script>
  import { goto } from '$app/navigation';
  import Icon from '$lib/components/ui/Icon.svelte';
  import { appState } from '$lib/stores/appState.svelte.js';

  let mode = $state('login');
  let showPw = $state(false);
  let langOpen = $state(false);

  let username = $state('');
  let email = $state('');
  let password = $state('');
  let passwordConfirm = $state('');
  let rememberMe = $state(true);

  function handleSubmit() {
    goto('/dashboard');
  }

  const dotBg = `url("data:image/svg+xml,%3Csvg width='28' height='28' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23000' fill-opacity='0.06'/%3E%3C/svg%3E")`;
</script>

<div style="width:100%;height:100vh;position:relative;background:#f6f5f2;background-image:{dotBg};font-family:Inter,system-ui,sans-serif;display:flex;align-items:center;justify-content:center;overflow:hidden;">

  <!-- Accent blobs -->
  <div style="position:absolute;top:-120px;left:-80px;width:360px;height:360px;background:radial-gradient(circle,rgba(233,69,96,0.10),transparent 70%);pointer-events:none;"></div>
  <div style="position:absolute;bottom:-160px;right:-100px;width:420px;height:420px;background:radial-gradient(circle,rgba(26,26,46,0.08),transparent 70%);pointer-events:none;"></div>

  <!-- Logo -->
  <div style="position:absolute;top:56px;left:0;right:0;display:flex;justify-content:center;align-items:center;gap:8px;">
    <div style="width:30px;height:30px;border-radius:6px;background:#e94560;display:flex;align-items:center;justify-content:center;">
      <Icon name="penLine" size={16} color="#fff" strokeWidth={2.2} />
    </div>
    <span style="font-size:18px;font-weight:700;letter-spacing:-0.3px;color:#1a1a2e;">Zettlwirtschaft</span>
  </div>

  <!-- Card -->
  <div style="width:420px;background:#fff;border-radius:14px;padding:40px 40px 36px;box-shadow:0 1px 0 rgba(26,26,46,0.04),0 14px 40px rgba(26,26,46,0.08),0 2px 8px rgba(26,26,46,0.04);border:1px solid rgba(26,26,46,0.06);position:relative;z-index:1;">

    <h1 style="margin:0;font-size:26px;font-weight:700;color:#1a1a2e;letter-spacing:-0.5px;">
      {mode === 'login' ? 'Willkommen zurück' : 'Konto erstellen'}
    </h1>
    <p style="margin:6px 0 22px;font-size:13.5px;color:#6b6b80;">
      {mode === 'login' ? 'Melde dich an, um deine Notizen zu öffnen.' : 'Starte deine vernetzte Wissensbasis.'}
    </p>

    <!-- Tabs -->
    <div style="display:flex;background:#f1f0ec;border-radius:10px;padding:4px;margin-bottom:22px;position:relative;">
      <div style="position:absolute;top:4px;bottom:4px;width:calc(50% - 4px);left:{mode === 'login' ? '4px' : 'calc(50% + 0px)'};background:#fff;border-radius:7px;box-shadow:0 1px 3px rgba(26,26,46,0.08);transition:left 0.22s cubic-bezier(0.4,0,0.2,1);"></div>
      {#each ['login', 'register'] as m}
        <button
          onclick={() => { mode = m; }}
          style="flex:1;position:relative;border:none;background:transparent;padding:9px 0;font-size:13.5px;font-weight:600;color:{mode === m ? '#1a1a2e' : '#888899'};cursor:pointer;font-family:inherit;transition:color 0.2s;"
        >
          {m === 'login' ? 'Anmelden' : 'Registrieren'}
        </button>
      {/each}
    </div>

    <!-- Fields -->
    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} style="display:flex;flex-direction:column;gap:14px;">
      {#if mode === 'register'}
        <div>
          <label style="font-size:12px;font-weight:600;color:#6b6b80;display:block;margin-bottom:6px;">Benutzername</label>
          <div style="display:flex;align-items:center;border:1px solid rgba(26,26,46,0.12);border-radius:10px;background:#fafaf8;height:46px;">
            <span style="color:#a0a0b0;padding-left:12px;display:flex;"><Icon name="user" size={16} /></span>
            <input bind:value={username} placeholder="max.notiz" style="flex:1;border:none;outline:none;background:transparent;font-size:13.5px;color:#1a1a2e;font-family:inherit;padding:12px 12px 12px 8px;" />
          </div>
        </div>
      {/if}

      <div>
        <label style="font-size:12px;font-weight:600;color:#6b6b80;display:block;margin-bottom:6px;">E-Mail</label>
        <div style="display:flex;align-items:center;border:1px solid rgba(26,26,46,0.12);border-radius:10px;background:#fafaf8;height:46px;">
          <span style="color:#a0a0b0;padding-left:12px;display:flex;"><Icon name="mail" size={16} /></span>
          <input bind:value={email} type="email" placeholder="max@zettl.de" style="flex:1;border:none;outline:none;background:transparent;font-size:13.5px;color:#1a1a2e;font-family:inherit;padding:12px 12px 12px 8px;" />
        </div>
      </div>

      <div>
        <label style="font-size:12px;font-weight:600;color:#6b6b80;display:block;margin-bottom:6px;">Passwort</label>
        <div style="display:flex;align-items:center;border:1px solid rgba(26,26,46,0.12);border-radius:10px;background:#fafaf8;height:46px;">
          <span style="color:#a0a0b0;padding-left:12px;display:flex;"><Icon name="lock" size={16} /></span>
          <input bind:value={password} type={showPw ? 'text' : 'password'} placeholder="••••••••••" style="flex:1;border:none;outline:none;background:transparent;font-size:13.5px;color:#1a1a2e;font-family:inherit;padding:12px 12px 12px 8px;" />
          <button type="button" onclick={() => showPw = !showPw} style="background:none;border:none;cursor:pointer;color:#a0a0b0;padding:0 12px;display:flex;align-items:center;">
            <Icon name={showPw ? 'eyeOff' : 'eye'} size={16} />
          </button>
        </div>
      </div>

      {#if mode === 'register'}
        <div>
          <label style="font-size:12px;font-weight:600;color:#6b6b80;display:block;margin-bottom:6px;">Passwort bestätigen</label>
          <div style="display:flex;align-items:center;border:1px solid rgba(26,26,46,0.12);border-radius:10px;background:#fafaf8;height:46px;">
            <span style="color:#a0a0b0;padding-left:12px;display:flex;"><Icon name="lock" size={16} /></span>
            <input bind:value={passwordConfirm} type="password" placeholder="••••••••••" style="flex:1;border:none;outline:none;background:transparent;font-size:13.5px;color:#1a1a2e;font-family:inherit;padding:12px 12px 12px 8px;" />
          </div>
        </div>
      {/if}

      {#if mode === 'login'}
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:-2px;">
          <label style="display:flex;align-items:center;gap:7px;font-size:12.5px;color:#6b6b80;cursor:pointer;">
            <input type="checkbox" bind:checked={rememberMe} style="accent-color:#e94560;" />
            Eingeloggt bleiben
          </label>
          <a href="#" style="font-size:12.5px;color:#e94560;text-decoration:none;font-weight:500;">Passwort vergessen?</a>
        </div>
      {/if}

      <button
        type="submit"
        style="margin-top:4px;height:46px;border:none;border-radius:10px;background:#e94560;color:#fff;font-weight:600;font-size:14px;letter-spacing:-0.2px;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 14px rgba(233,69,96,0.30),inset 0 1px 0 rgba(255,255,255,0.18);"
      >
        {mode === 'login' ? 'Anmelden' : 'Konto erstellen'}
        <Icon name="arrowRight" size={16} color="#fff" strokeWidth={2.2} />
      </button>
    </form>
  </div>

  <!-- Language picker -->
  <div style="position:absolute;bottom:28px;right:28px;z-index:2;">
    <button
      onclick={() => langOpen = !langOpen}
      style="display:flex;align-items:center;gap:8px;background:#fff;border:1px solid rgba(26,26,46,0.10);border-radius:8px;padding:6px 10px;cursor:pointer;font-size:12.5px;font-weight:500;color:#1a1a2e;font-family:inherit;box-shadow:0 2px 6px rgba(26,26,46,0.04);"
    >
      <span style="font-size:14px;">{appState.locale === 'de' ? '🇩🇪' : '🇬🇧'}</span>
      {appState.locale === 'de' ? 'DE' : 'EN'}
      <Icon name="chevDown" size={12} color="#888" />
    </button>
    {#if langOpen}
      <div style="position:absolute;bottom:calc(100% + 6px);right:0;background:#fff;border:1px solid rgba(26,26,46,0.10);border-radius:8px;padding:4px;min-width:110px;box-shadow:0 8px 24px rgba(26,26,46,0.10);">
        {#each [['de', '🇩🇪', 'Deutsch'], ['en', '🇬🇧', 'English']] as [code, flag, label]}
          <button
            onclick={() => { appState.locale = code; langOpen = false; }}
            style="display:flex;align-items:center;gap:8px;width:100%;border:none;background:{appState.locale === code ? '#f6f5f2' : 'transparent'};padding:7px 10px;border-radius:5px;font-size:12.5px;font-weight:500;color:#1a1a2e;cursor:pointer;font-family:inherit;text-align:left;"
          >
            <span>{flag}</span> {label}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <div style="position:absolute;bottom:32px;left:28px;font-size:11.5px;color:#a0a0b0;">© 2026 Zettlwirtschaft</div>
</div>
