<script>
  import { goto } from '$app/navigation';
  import Icon from '$lib/components/ui/Icon.svelte';
  import { appState, logout } from '$lib/stores/appState.svelte.js';
  import { setLocale } from '$lib/i18n/index.js';
  import * as api from '$lib/services/api.js';

  let activeSection = $state('profil');

  // Theme — persisted in localStorage
  let theme = $state(
    (typeof localStorage !== 'undefined' ? localStorage.getItem('zw-theme') : null) || 'system'
  );

  $effect(() => {
    if (typeof document === 'undefined') return;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('zw-theme', theme);
  });

  // Profile fields
  let username = $state(appState.currentUser?.username || '');
  let email = $state(appState.currentUser?.email || '');

  let profileSaving = $state(false);
  let profileError = $state('');
  let profileSaved = $state(false);
  let profileSavedTimer = 0;

  async function saveProfile() {
    profileError = '';
    profileSaved = false;
    profileSaving = true;
    try {
      const result = await api.updateMe({ username, email });
      appState.currentUser = result.user;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('zw-user', JSON.stringify(result.user));
      }
      profileSaved = true;
      clearTimeout(profileSavedTimer);
      profileSavedTimer = setTimeout(() => { profileSaved = false; }, 3000);
    } catch (err) {
      profileError = err.message;
    } finally {
      profileSaving = false;
    }
  }

  // Password fields
  let currentPassword = $state('');
  let newPassword = $state('');
  let newPasswordConfirm = $state('');

  let passwordSaving = $state(false);
  let passwordError = $state('');
  let passwordSaved = $state(false);
  let passwordSavedTimer = 0;

  async function changePassword() {
    passwordError = '';
    passwordSaved = false;

    if (!currentPassword) {
      passwordError = 'Bitte das aktuelle Passwort eingeben.';
      return;
    }
    if (newPassword.length < 8) {
      passwordError = 'Neues Passwort muss mindestens 8 Zeichen haben.';
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      passwordError = 'Neue Passwörter stimmen nicht überein.';
      return;
    }

    passwordSaving = true;
    try {
      await api.updateMe({ password: newPassword, currentPassword });
      passwordSaved = true;
      currentPassword = '';
      newPassword = '';
      newPasswordConfirm = '';
      clearTimeout(passwordSavedTimer);
      passwordSavedTimer = setTimeout(() => { passwordSaved = false; }, 3000);
    } catch (err) {
      passwordError = err.message;
    } finally {
      passwordSaving = false;
    }
  }

  let compactMode = $state(false);
  let animations = $state(true);

  function handleDeleteAccount() {
    const confirmed = confirm(
      'Konto wirklich löschen? Alle Notizen und Backlinks werden unwiderruflich entfernt.'
    );
    if (!confirmed) return;
    alert('Konto löschen ist noch nicht implementiert.');
  }

  function handleLogout() {
    logout();
    goto('/auth');
  }

  const sections = [
    { id: 'profil', ic: 'user', label: 'Profil' },
    { id: 'sicherheit', ic: 'lock', label: 'Sicherheit' },
    { id: 'sprache', ic: 'globe', label: 'Sprache' },
    { id: 'darstellung', ic: 'sun', label: 'Darstellung' },
    { id: 'export', ic: 'download', label: 'Export & Backup' },
    { id: 'benachrichtigungen', ic: 'bell', label: 'Benachrichtigungen' },
  ];
</script>

<div style="width:100%;height:100%;display:flex;flex-direction:column;font-family:Inter,system-ui,sans-serif;background:#fafaf8;overflow:hidden;color:#1a1a2e;">

  <!-- Topbar -->
  <div style="height:56px;border-bottom:1px solid rgba(26,26,46,0.08);display:flex;align-items:center;padding:0 20px;gap:14px;background:#fff;flex-shrink:0;">
    <button onclick={() => goto('/dashboard')} style="width:34px;height:34px;border-radius:8px;border:none;background:transparent;color:#6b6b80;cursor:pointer;display:flex;align-items:center;justify-content:center;">
      <Icon name="chevLeft" size={18} />
    </button>
    <h2 style="margin:0;font-size:17px;font-weight:700;letter-spacing:-0.3px;">Einstellungen</h2>
    <span style="flex:1;"></span>
    <div style="width:34px;height:34px;border-radius:17px;background:linear-gradient(135deg,#1a1a2e,#2d2d4a);color:#fff;font-weight:600;font-size:12px;display:flex;align-items:center;justify-content:center;">
      {appState.currentUser?.username?.slice(0,2).toUpperCase() || 'MN'}
    </div>
  </div>

  <div style="flex:1;display:flex;overflow:hidden;">

    <!-- Section nav -->
    <div style="width:220px;padding:24px 14px;border-right:1px solid rgba(26,26,46,0.06);flex-shrink:0;overflow:auto;">
      {#each sections as s}
        <button
          onclick={() => activeSection = s.id}
          style="display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:7px;cursor:pointer;width:100%;border:1px solid {activeSection === s.id ? 'rgba(26,26,46,0.08)' : 'transparent'};background:{activeSection === s.id ? '#fff' : 'transparent'};color:{activeSection === s.id ? '#1a1a2e' : '#6b6b80'};font-size:13px;font-weight:{activeSection === s.id ? 600 : 500};margin-bottom:2px;box-shadow:{activeSection === s.id ? '0 1px 2px rgba(26,26,46,0.04)' : 'none'};font-family:inherit;text-align:left;"
        >
          <Icon name={s.ic} size={15} color={activeSection === s.id ? '#e94560' : '#888899'} />
          {s.label}
        </button>
      {/each}
    </div>

    <!-- Content -->
    <div style="flex:1;overflow:auto;padding:32px 48px;">
      <div style="max-width:640px;">

        {#if activeSection === 'profil'}
          <div style="margin-bottom:32px;">
            <h3 style="margin:0 0 4px;font-size:17px;font-weight:700;letter-spacing:-0.3px;">Profil</h3>
            <p style="margin:0 0 18px;font-size:12.5px;color:#888899;">Wie andere dich in Zettlwirtschaft sehen.</p>

            <!-- Avatar -->
            <div style="display:flex;gap:18px;align-items:center;margin-bottom:18px;">
              <div style="width:72px;height:72px;border-radius:36px;background:linear-gradient(135deg,#e94560,#ff7858);color:#fff;font-weight:700;font-size:24px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(233,69,96,0.30);">
                {username.slice(0,2).toUpperCase()}
              </div>
              <div>
                <button disabled style="height:34px;padding:0 14px;border:1px solid rgba(26,26,46,0.12);border-radius:8px;background:#fff;color:#888899;font-weight:500;font-size:12.5px;cursor:not-allowed;font-family:inherit;display:block;margin-bottom:6px;opacity:0.6;">Bild ändern</button>
                <span style="font-size:11.5px;color:#888899;">JPG, PNG · max. 2 MB</span>
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:14px;">
              <div>
                <label style="font-size:12px;font-weight:600;color:#6b6b80;display:block;margin-bottom:6px;">Benutzername</label>
                <input
                  type="text"
                  bind:value={username}
                  style="width:100%;height:42px;padding:0 14px;border:1px solid rgba(26,26,46,0.12);border-radius:9px;background:#fff;font-size:13.5px;color:#1a1a2e;font-family:inherit;outline:none;box-sizing:border-box;"
                />
              </div>
              <div>
                <label style="font-size:12px;font-weight:600;color:#6b6b80;display:block;margin-bottom:6px;">E-Mail</label>
                <input
                  type="email"
                  bind:value={email}
                  style="width:100%;height:42px;padding:0 14px;border:1px solid rgba(26,26,46,0.12);border-radius:9px;background:#fff;font-size:13.5px;color:#1a1a2e;font-family:inherit;outline:none;box-sizing:border-box;"
                />
              </div>
              {#if profileError}
                <p style="margin:0;font-size:12.5px;color:#e94560;">{profileError}</p>
              {/if}
              {#if profileSaved}
                <p style="margin:0;font-size:12.5px;color:#22c55e;">Profil gespeichert.</p>
              {/if}
              <button
                onclick={saveProfile}
                disabled={profileSaving}
                style="height:42px;border:none;border-radius:9px;background:{profileSaving ? '#888899' : '#e94560'};color:#fff;font-weight:600;font-size:13.5px;cursor:{profileSaving ? 'not-allowed' : 'pointer'};font-family:inherit;opacity:{profileSaving ? 0.7 : 1};"
              >
                {profileSaving ? 'Wird gespeichert…' : 'Änderungen speichern'}
              </button>
            </div>
          </div>

        {:else if activeSection === 'sicherheit'}
          <div style="margin-bottom:32px;">
            <h3 style="margin:0 0 4px;font-size:17px;font-weight:700;letter-spacing:-0.3px;">Sicherheit</h3>
            <p style="margin:0 0 18px;font-size:12.5px;color:#888899;">Passwort und Zwei-Faktor-Authentifizierung.</p>
            <div style="display:flex;flex-direction:column;gap:14px;">
              {#each [['Aktuelles Passwort', currentPassword, (v) => currentPassword = v], ['Neues Passwort', newPassword, (v) => newPassword = v], ['Neues Passwort wiederholen', newPasswordConfirm, (v) => newPasswordConfirm = v]] as [label, val, setter]}
                <div>
                  <label style="font-size:12px;font-weight:600;color:#6b6b80;display:block;margin-bottom:6px;">{label}</label>
                  <input type="password" value={val} oninput={(e) => setter(e.currentTarget.value)} placeholder="••••••••••" style="width:100%;height:42px;padding:0 14px;border:1px solid rgba(26,26,46,0.12);border-radius:9px;background:#fff;font-size:13.5px;color:#1a1a2e;font-family:inherit;outline:none;box-sizing:border-box;" />
                </div>
              {/each}
              {#if passwordError}
                <p style="margin:0;font-size:12.5px;color:#e94560;">{passwordError}</p>
              {/if}
              {#if passwordSaved}
                <p style="margin:0;font-size:12.5px;color:#22c55e;">Passwort geändert.</p>
              {/if}
              <button
                onclick={changePassword}
                disabled={passwordSaving}
                style="height:42px;border:none;border-radius:9px;background:{passwordSaving ? '#888899' : '#e94560'};color:#fff;font-weight:600;font-size:13.5px;cursor:{passwordSaving ? 'not-allowed' : 'pointer'};font-family:inherit;opacity:{passwordSaving ? 0.7 : 1};"
              >
                {passwordSaving ? 'Wird gespeichert…' : 'Passwort ändern'}
              </button>
              <div style="display:flex;align-items:center;gap:14px;padding:10px 0;border-bottom:1px solid rgba(26,26,46,0.06);">
                <div style="flex:1;">
                  <div style="font-size:13.5px;font-weight:500;">Zwei-Faktor-Authentifizierung</div>
                  <div style="font-size:12px;color:#888899;margin-top:2px;">Sichere dein Konto mit einer Authenticator-App.</div>
                </div>
                <button disabled style="width:38px;height:22px;border-radius:11px;background:rgba(26,26,46,0.20);border:none;cursor:not-allowed;position:relative;opacity:0.6;">
                  <div style="position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:9px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></div>
                </button>
              </div>
            </div>
          </div>

        {:else if activeSection === 'sprache'}
          <div style="margin-bottom:32px;">
            <h3 style="margin:0 0 4px;font-size:17px;font-weight:700;letter-spacing:-0.3px;">Sprache</h3>
            <p style="margin:0 0 18px;font-size:12.5px;color:#888899;">Wähle deine bevorzugte Sprache.</p>
            <div style="position:relative;max-width:320px;">
              <select value={appState.locale} onchange={(e) => setLocale(e.currentTarget.value)} style="width:100%;height:44px;padding:0 36px 0 14px;border:1px solid rgba(26,26,46,0.12);border-radius:9px;background:#fff;font-size:13.5px;color:#1a1a2e;font-family:inherit;cursor:pointer;appearance:none;">
                <option value="de">🇩🇪 Deutsch</option>
                <option value="en">🇬🇧 English</option>
              </select>
              <span style="position:absolute;right:14px;top:15px;color:#888899;pointer-events:none;"><Icon name="chevDown" size={14} /></span>
            </div>
          </div>

        {:else if activeSection === 'darstellung'}
          <div style="margin-bottom:32px;">
            <h3 style="margin:0 0 4px;font-size:17px;font-weight:700;letter-spacing:-0.3px;">Darstellung</h3>
            <p style="margin:0 0 18px;font-size:12.5px;color:#888899;">Light oder Dark Mode.</p>
            <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px;">
              {#each [['light', 'Hell', '#fff', '#1a1a2e'], ['dark', 'Dunkel', '#1a1a2e', '#fff'], ['system', 'System', 'linear-gradient(135deg,#fff 50%,#1a1a2e 50%)', '#1a1a2e']] as [key, label, bg, fg]}
                <button
                  onclick={() => theme = key}
                  style="width:130px;padding:10px;border-radius:10px;background:#fff;border:2px solid {theme === key ? '#e94560' : 'rgba(26,26,46,0.10)'};cursor:pointer;font-family:inherit;text-align:center;"
                >
                  <div style="height:60px;border-radius:6px;background:{bg};margin-bottom:8px;border:1px solid rgba(26,26,46,0.08);display:flex;align-items:flex-end;padding:6px;gap:4px;">
                    <div style="width:22px;height:6px;background:{fg};opacity:0.4;border-radius:1px;"></div>
                    <div style="width:14px;height:6px;background:{fg};opacity:0.6;border-radius:1px;"></div>
                  </div>
                  <div style="font-size:12.5px;font-weight:600;color:#1a1a2e;">{label}</div>
                </button>
              {/each}
            </div>
            {#each [[compactMode, (v) => compactMode = v, 'Kompakter Modus', 'Reduziert Abstände in Listen und Sidebar.'], [animations, (v) => animations = v, 'Vorschau-Animationen', 'Sanfte Übergänge zwischen Notizen.']] as [val, setter, label, desc]}
              <div style="display:flex;align-items:center;gap:14px;padding:10px 0;border-bottom:1px solid rgba(26,26,46,0.06);">
                <div style="flex:1;">
                  <div style="font-size:13.5px;font-weight:500;">{label}</div>
                  <div style="font-size:12px;color:#888899;margin-top:2px;">{desc}</div>
                </div>
                <button disabled style="width:38px;height:22px;border-radius:11px;background:rgba(26,26,46,0.20);border:none;cursor:not-allowed;position:relative;opacity:0.6;">
                  <div style="position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:9px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></div>
                </button>
              </div>
            {/each}
          </div>

        {:else if activeSection === 'export'}
          <div style="margin-bottom:32px;">
            <h3 style="margin:0 0 4px;font-size:17px;font-weight:700;letter-spacing:-0.3px;">Export & Backup</h3>
            <p style="margin:0 0 18px;font-size:12.5px;color:#888899;">Lade deine Notizen als ZIP herunter oder synchronisiere automatisch.</p>
            <div style="padding:16px 18px;background:#fff;border:1px solid rgba(26,26,46,0.08);border-radius:10px;display:flex;align-items:center;gap:14px;">
              <div style="width:40px;height:40px;border-radius:10px;flex-shrink:0;background:rgba(233,69,96,0.10);color:#e94560;display:flex;align-items:center;justify-content:center;">
                <Icon name="archive" size={18} color="#e94560" />
              </div>
              <div style="flex:1;">
                <div style="font-size:13.5px;font-weight:600;">Alle Notizen exportieren</div>
                <div style="font-size:12px;color:#888899;margin-top:2px;">ZIP-Archiv mit Markdown-Dateien</div>
              </div>
              <button disabled style="height:38px;padding:0 16px;border:none;border-radius:8px;background:#888899;color:#fff;font-weight:600;font-size:13px;cursor:not-allowed;font-family:inherit;display:flex;align-items:center;gap:7px;opacity:0.7;">
                <Icon name="download" size={14} color="#fff" /> .zip herunterladen
              </button>
            </div>
            <div style="height:12px;"></div>
            <div style="display:flex;align-items:center;gap:14px;padding:10px 0;border-bottom:1px solid rgba(26,26,46,0.06);">
              <div style="flex:1;">
                <div style="font-size:13.5px;font-weight:500;">Automatisches Backup</div>
                <div style="font-size:12px;color:#888899;margin-top:2px;">Wöchentlich auf verbundenen Cloud-Speicher.</div>
              </div>
              <button disabled style="width:38px;height:22px;border-radius:11px;background:rgba(26,26,46,0.20);border:none;cursor:not-allowed;position:relative;opacity:0.6;">
                <div style="position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:9px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></div>
              </button>
            </div>
          </div>
        {/if}

        <!-- Konto löschen + Abmelden -->
        <div style="margin-top:24px;padding:14px 18px;border:1px solid rgba(233,69,96,0.20);border-radius:10px;background:rgba(233,69,96,0.04);display:flex;align-items:center;gap:14px;">
          <Icon name="trash" size={16} color="#e94560" />
          <div style="flex:1;">
            <div style="font-size:13.5px;font-weight:600;color:#e94560;">Konto löschen</div>
            <div style="font-size:12px;color:#888899;margin-top:2px;">Endgültig — alle Notizen und Backlinks werden gelöscht.</div>
          </div>
          <button onclick={handleDeleteAccount} style="height:34px;padding:0 14px;border:1px solid rgba(233,69,96,0.40);background:#fff;color:#e94560;border-radius:7px;font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit;">Löschen</button>
        </div>

        <div style="height:16px;"></div>

        <button onclick={handleLogout} style="width:100%;height:42px;border:1px solid rgba(26,26,46,0.12);border-radius:9px;background:#fff;color:#1a1a2e;font-weight:600;font-size:13.5px;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;">
          <Icon name="arrowRight" size={15} /> Abmelden
        </button>

        <div style="height:32px;"></div>
      </div>
    </div>
  </div>
</div>
