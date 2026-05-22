<script>
  import './registerForm.css';
  import Icon from '$lib/components/ui/Icon.svelte';

  let { onsubmit = () => {}, loading = false, error = '' } = $props();

  let username = $state('');
  let email = $state('');
  let password = $state('');
  let passwordConfirm = $state('');
  let showPw = $state(false);
  let validationError = $state('');

  function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 8) {
      validationError = 'Passwort muss mindestens 8 Zeichen lang sein.';
      return;
    }
    if (password !== passwordConfirm) {
      validationError = 'Passwörter stimmen nicht überein.';
      return;
    }
    validationError = '';
    onsubmit({ username, email, password });
  }

  const displayError = $derived(validationError || error);
</script>

<form class="register-form" onsubmit={handleSubmit}>
  <div class="register-form-field">
    <label for="register-username" class="register-form-label">Benutzername</label>
    <div class="register-form-input-wrap">
      <span class="register-form-icon"><Icon name="user" size={16} color="#888899" /></span>
      <input
        id="register-username"
        type="text"
        bind:value={username}
        placeholder="max.notiz"
        class="register-form-input"
        required
      />
    </div>
  </div>

  <div class="register-form-field">
    <label for="register-email" class="register-form-label">E-Mail</label>
    <div class="register-form-input-wrap">
      <span class="register-form-icon"><Icon name="mail" size={16} color="#888899" /></span>
      <input
        id="register-email"
        type="email"
        bind:value={email}
        placeholder="max@zettl.de"
        class="register-form-input"
        required
      />
    </div>
  </div>

  <div class="register-form-field">
    <label for="register-password" class="register-form-label">Passwort</label>
    <div class="register-form-input-wrap">
      <span class="register-form-icon"><Icon name="lock" size={16} color="#888899" /></span>
      <input
        id="register-password"
        type={showPw ? 'text' : 'password'}
        bind:value={password}
        placeholder="••••••••••"
        class="register-form-input"
        required
      />
      <button type="button" class="register-form-pw-toggle" onclick={() => showPw = !showPw}>
        <Icon name={showPw ? 'eyeOff' : 'eye'} size={16} color="#888899" />
      </button>
    </div>
  </div>

  <div class="register-form-field">
    <label for="register-confirm" class="register-form-label">Passwort bestätigen</label>
    <div class="register-form-input-wrap">
      <span class="register-form-icon"><Icon name="lock" size={16} color="#888899" /></span>
      <input
        id="register-confirm"
        type="password"
        bind:value={passwordConfirm}
        placeholder="••••••••••"
        class="register-form-input"
        required
      />
    </div>
  </div>

  {#if displayError}
    <div class="register-form-error">{displayError}</div>
  {/if}

  <button type="submit" class="register-form-submit" disabled={loading}>
    {loading ? 'Laden…' : 'Konto erstellen'}
    <Icon name="arrowRight" size={16} color="#fff" strokeWidth={2.2} />
  </button>
</form>
