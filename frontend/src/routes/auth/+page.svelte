<script>
  import { goto } from '$app/navigation';
  import Icon from '$lib/components/ui/Icon.svelte';
  import { appState } from '$lib/stores/appState.svelte.js';
  import { t, setLocale } from '$lib/i18n/index.js';
  import * as api from '$lib/services/api.js';
  import LoginForm from '$lib/components/auth/LoginForm.svelte';
  import RegisterForm from '$lib/components/auth/RegisterForm.svelte';
  import '$lib/components/auth/authPage.css';

  let mode = $state('login');
  let langOpen = $state(false);
  let loading = $state(false);
  let error = $state('');

  async function handleAuth(apiFn) {
    loading = true;
    error = '';
    try {
      await apiFn();
      goto('/dashboard');
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  function handleLogin(data) {
    return handleAuth(async () => {
      const r = await api.login(data.email, data.password);
      localStorage.setItem('zw-token', r.token);
      localStorage.setItem('zw-user', JSON.stringify(r.user));
      appState.currentUser = r.user;
    });
  }

  function handleRegister(data) {
    return handleAuth(async () => {
      const r = await api.register(data.username, data.email, data.password);
      localStorage.setItem('zw-token', r.token);
      localStorage.setItem('zw-user', JSON.stringify(r.user));
      appState.currentUser = r.user;
    });
  }

  /*
   * BACKGROUND OPTIONS — change .auth-page background in authPage.css:
   *
   * A) Current: #f6f5f2 + animated SVG knowledge-graph (default)
   *
   * B) Dark library photo — search unsplash.com: "dark library atmospheric books moody"
   *    Save to frontend/static/bg-library.jpg, set background: url('/bg-library.jpg') center/cover
   *    Add a dark overlay: <div style="position:absolute;inset:0;background:rgba(4,4,16,0.55);">
   *
   * C) Abstract network → "neural network abstract dark glowing lines"
   * D) Misty forest     → "dark forest fog atmospheric night"
   * E) Old parchment    → "vintage parchment paper macro texture"
   */
</script>

<div class="auth-page">

  <!--
    BACKGROUND: animated knowledge-graph (SVG).
    Replace this entire <svg> with an <img> for a photo background.
    Animation classes (zw-node, zw-edge) are defined in app.css.
  -->
  <svg class="auth-page-svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="glow-red" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="glow-blue" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <!-- Halo rings (light-mode opacity) -->
    <circle class="zw-node n1"  cx="86"   cy="108" r="20" fill="rgba(233,69,96,0.08)"/>
    <circle class="zw-node n5"  cx="360"  cy="612" r="26" fill="rgba(233,69,96,0.08)"/>
    <circle class="zw-node n9"  cx="1066" cy="558" r="22" fill="rgba(233,69,96,0.08)"/>
    <circle class="zw-node n12" cx="1382" cy="792" r="20" fill="rgba(233,69,96,0.08)"/>
    <circle class="zw-node n4"  cx="320"  cy="200" r="22" fill="rgba(45,127,211,0.08)"/>
    <circle class="zw-node n8"  cx="1008" cy="162" r="26" fill="rgba(45,127,211,0.08)"/>
    <circle class="zw-node n11" cx="1354" cy="126" r="20" fill="rgba(45,127,211,0.08)"/>

    <!-- Edges (dark on light bg) -->
    <line class="zw-edge e1"  x1="86"   y1="108" x2="320"  y2="200" stroke="rgba(26,26,46,0.08)" stroke-width="0.8"/>
    <line class="zw-edge e2"  x1="86"   y1="108" x2="216"  y2="468" stroke="rgba(26,26,46,0.08)" stroke-width="0.8"/>
    <line class="zw-edge e3"  x1="216"  y1="468" x2="360"  y2="612" stroke="rgba(26,26,46,0.08)" stroke-width="0.8"/>
    <line class="zw-edge e4"  x1="216"  y1="468" x2="144"  y2="720" stroke="rgba(26,26,46,0.08)" stroke-width="0.8"/>
    <line class="zw-edge e5"  x1="320"  y1="200" x2="360"  y2="612" stroke="rgba(26,26,46,0.08)" stroke-width="0.8"/>
    <line class="zw-edge e6"  x1="320"  y1="200" x2="605"  y2="72"  stroke="rgba(26,26,46,0.08)" stroke-width="0.8"/>
    <line class="zw-edge e7"  x1="605"  y1="72"  x2="835"  y2="54"  stroke="rgba(26,26,46,0.08)" stroke-width="0.8"/>
    <line class="zw-edge e8"  x1="605"  y1="72"  x2="1008" y2="162" stroke="rgba(26,26,46,0.06)" stroke-width="0.7"/>
    <line class="zw-edge e9"  x1="360"  y1="612" x2="547"  y2="828" stroke="rgba(26,26,46,0.08)" stroke-width="0.8"/>
    <line class="zw-edge e10" x1="547"  y1="828" x2="893"  y2="846" stroke="rgba(26,26,46,0.08)" stroke-width="0.8"/>
    <line class="zw-edge e11" x1="1008" y1="162" x2="1066" y2="558" stroke="rgba(26,26,46,0.08)" stroke-width="0.8"/>
    <line class="zw-edge e12" x1="1008" y1="162" x2="1354" y2="126" stroke="rgba(26,26,46,0.08)" stroke-width="0.8"/>
    <line class="zw-edge e13" x1="1066" y1="558" x2="1210" y2="342" stroke="rgba(26,26,46,0.08)" stroke-width="0.8"/>
    <line class="zw-edge e14" x1="1066" y1="558" x2="1296" y2="648" stroke="rgba(26,26,46,0.08)" stroke-width="0.8"/>
    <line class="zw-edge e15" x1="1210" y1="342" x2="1296" y2="648" stroke="rgba(26,26,46,0.08)" stroke-width="0.8"/>
    <line class="zw-edge e16" x1="1296" y1="648" x2="1382" y2="792" stroke="rgba(26,26,46,0.08)" stroke-width="0.8"/>
    <line class="zw-edge e17" x1="1354" y1="126" x2="835"  y2="54"  stroke="rgba(26,26,46,0.08)" stroke-width="0.8"/>
    <line class="zw-edge e18" x1="1382" y1="792" x2="893"  y2="846" stroke="rgba(26,26,46,0.08)" stroke-width="0.8"/>

    <!-- Red accent nodes -->
    <circle class="zw-node n1"  cx="86"   cy="108" r="4"   fill="#e94560" filter="url(#glow-red)"/>
    <circle class="zw-node n5"  cx="360"  cy="612" r="5"   fill="#e94560" filter="url(#glow-red)"/>
    <circle class="zw-node n9"  cx="1066" cy="558" r="4"   fill="#e94560" filter="url(#glow-red)"/>
    <circle class="zw-node n12" cx="1382" cy="792" r="4"   fill="#e94560" filter="url(#glow-red)"/>
    <!-- Blue accent nodes -->
    <circle class="zw-node n4"  cx="320"  cy="200" r="4"   fill="#2d7fd3" filter="url(#glow-blue)"/>
    <circle class="zw-node n8"  cx="1008" cy="162" r="5"   fill="#2d7fd3" filter="url(#glow-blue)"/>
    <circle class="zw-node n11" cx="1354" cy="126" r="3.5" fill="#2d7fd3" filter="url(#glow-blue)"/>
    <!-- Dim nodes (dark-on-light) -->
    <circle class="zw-node n2"  cx="216"  cy="468" r="3"   fill="rgba(26,26,46,0.18)"/>
    <circle class="zw-node n3"  cx="144"  cy="720" r="2.5" fill="rgba(26,26,46,0.12)"/>
    <circle class="zw-node n6"  cx="605"  cy="72"  r="3"   fill="rgba(26,26,46,0.18)"/>
    <circle class="zw-node n7"  cx="547"  cy="828" r="3"   fill="rgba(26,26,46,0.12)"/>
    <circle class="zw-node n10" cx="1210" cy="342" r="3.5" fill="rgba(26,26,46,0.18)"/>
    <circle class="zw-node n13" cx="1296" cy="648" r="3"   fill="rgba(26,26,46,0.12)"/>
    <circle class="zw-node n14" cx="835"  cy="54"  r="2.5" fill="rgba(26,26,46,0.12)"/>
    <circle class="zw-node n15" cx="893"  cy="846" r="2.5" fill="rgba(26,26,46,0.12)"/>
  </svg>

  <div class="auth-page-vignette"></div>
  <div class="auth-page-glow"></div>

  <!-- Logo -->
  <div class="zw-auth-logo auth-page-logo">
    <div class="auth-page-logo-icon">
      <Icon name="penLine" size={16} color="#fff" strokeWidth={2.2} />
    </div>
    <span class="auth-page-logo-text">Zettlwirtschaft</span>
  </div>

  <!-- Auth card -->
  <div class="zw-auth-card auth-page-card">
    <h1 class="auth-page-title">
      {mode === 'login' ? t('auth.welcomeBack') : t('auth.createAccount')}
    </h1>
    <p class="auth-page-subtitle">
      {mode === 'login' ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}
    </p>

    <!-- Tab switcher -->
    <div class="auth-page-tabs">
      <div
        class="auth-page-tab-indicator"
        style="left: {mode === 'login' ? '4px' : 'calc(50%)'}"
      ></div>
      {#each ['login', 'register'] as m}
        <button
          type="button"
          onclick={() => { mode = m; error = ''; }}
          class="auth-page-tab-btn {mode === m ? 'auth-page-tab-btn--active' : 'auth-page-tab-btn--inactive'}"
        >
          {m === 'login' ? t('auth.login') : t('auth.register')}
        </button>
      {/each}
    </div>

    <!-- Forms (stubs render nothing until LoginForm/RegisterForm PRs merge) -->
    {#if mode === 'login'}
      <LoginForm onsubmit={handleLogin} {loading} {error} />
    {:else}
      <RegisterForm onsubmit={handleRegister} {loading} {error} />
    {/if}
  </div>

  <!-- Language picker -->
  <div class="auth-page-lang-wrap">
    <button
      type="button"
      onclick={() => langOpen = !langOpen}
      class="auth-page-lang-btn"
    >
      <span class="auth-page-lang-flag">{appState.locale === 'de' ? '🇩🇪' : '🇬🇧'}</span>
      {appState.locale === 'de' ? 'DE' : 'EN'}
      <Icon name="chevDown" size={12} color="#888899" />
    </button>
    {#if langOpen}
      <div class="auth-page-lang-dropdown">
        {#each [['de', '🇩🇪', 'Deutsch'], ['en', '🇬🇧', 'English']] as [code, flag, label]}
          <button
            type="button"
            onclick={() => { setLocale(code); langOpen = false; }}
            class="auth-page-lang-option {appState.locale === code ? 'auth-page-lang-option--active' : 'auth-page-lang-option--inactive'}"
          >
            <span>{flag}</span> {label}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <span class="auth-page-copyright">© 2026 Zettlwirtschaft</span>
</div>
