<script>
  import './loginForm.css';
  import Icon from '$lib/components/ui/Icon.svelte';

  let { onsubmit = () => {}, loading = false, error = '' } = $props();

  let email = $state('');
  let password = $state('');
  let rememberMe = $state(true);
  let showPw = $state(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    onsubmit({ email: email.trim(), password, rememberMe });
  }
</script>

<form class="login-form" onsubmit={handleSubmit}>
  <div class="login-form-field">
    <label for="login-email" class="login-form-label">E-Mail</label>
    <div class="login-form-input-wrap">
      <span class="login-form-icon"><Icon name="mail" size={16} color="#888899" /></span>
      <input
        id="login-email"
        type="email"
        bind:value={email}
        placeholder="max@zettl.de"
        class="login-form-input"
        required
        autocomplete="email"
      />
    </div>
  </div>

  <div class="login-form-field">
    <label for="login-password" class="login-form-label">Passwort</label>
    <div class="login-form-input-wrap">
      <span class="login-form-icon"><Icon name="lock" size={16} color="#888899" /></span>
      <input
        id="login-password"
        type={showPw ? 'text' : 'password'}
        bind:value={password}
        placeholder="••••••••••"
        class="login-form-input"
        required
        autocomplete="current-password"
      />
      <button
        type="button"
        class="login-form-pw-toggle"
        onclick={() => showPw = !showPw}
        aria-label={showPw ? 'Passwort verbergen' : 'Passwort anzeigen'}
        aria-pressed={showPw}
      >
        <Icon name={showPw ? 'eyeOff' : 'eye'} size={16} color="#888899" />
      </button>
    </div>
  </div>

  <div class="login-form-options">
    <label class="login-form-remember" for="login-remember">
      <input id="login-remember" type="checkbox" bind:checked={rememberMe} />
      Eingeloggt bleiben
    </label>
    <button type="button" class="login-form-forgot">Passwort vergessen?</button>
  </div>

  {#if error}
    <div class="login-form-error">{error}</div>
  {/if}

  <button type="submit" class="login-form-submit" disabled={loading}>
    {loading ? 'Laden…' : 'Anmelden'}
    <Icon name="arrowRight" size={16} color="#fff" strokeWidth={2.2} />
  </button>
</form>
