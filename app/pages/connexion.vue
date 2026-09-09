<script setup lang="ts">
const mode = ref<'login' | 'signup'>('login')
const route = useRoute()
const oauthError = computed(() => route.query.erreur as string | undefined)
</script>

<template>
  <main class="page">
    <div class="card">
      <div class="badge">AT</div>
      <p v-if="oauthError" class="oauth-error">
        La connexion via {{ oauthError === 'google' ? 'Google' : 'Facebook' }} a échoué. Réessaie ou utilise un autre moyen.
      </p>
      <h1>{{ mode === 'login' ? 'Content de vous revoir' : 'Rejoignez Annonces TG' }}</h1>
      <p class="subtitle">
        {{ mode === 'login' ? 'Connectez-vous pour gérer vos annonces et favoris.' : 'Créez un compte pour publier vos propres annonces.' }}
      </p>

      <div class="switcher">
        <button :class="{ active: mode === 'login' }" @click="mode = 'login'">Se connecter</button>
        <button :class="{ active: mode === 'signup' }" @click="mode = 'signup'">Créer un compte</button>
      </div>

      <form @submit.prevent>
        <label class="field">
          <Icon name="mail" />
          <input type="text" placeholder="Téléphone ou email" required />
        </label>
        <label class="field">
          <Icon name="lock" />
          <input type="password" placeholder="Mot de passe" required />
        </label>
        <button type="submit" class="btn-primary submit">
          {{ mode === 'login' ? 'Se connecter' : 'Créer mon compte' }}
        </button>
      </form>

      <div class="divider"><span>ou</span></div>

      <div class="social">
        <a href="/auth/google" class="social-btn google">
          <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.5 7.4 24 12 24z"/><path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.6.4-2.4V6.5H1.4C.5 8.2 0 10 0 12s.5 3.8 1.4 5.5l4-3.1z"/><path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.5 1.4 6.5l4 3.1c.9-2.8 3.5-4.8 6.6-4.8z"/></svg>
          Google
        </a>
        <a href="/auth/facebook" class="social-btn facebook">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="#1877F2"><path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1C0 18.1 4.4 23.1 10.1 24v-8.4H7.1v-3.5h3v-2.6c0-3 1.8-4.6 4.5-4.6 1.3 0 2.6.2 2.6.2v2.9h-1.5c-1.5 0-1.9.9-1.9 1.9v2.2h3.3l-.5 3.5h-2.8V24C19.6 23.1 24 18.1 24 12.1z"/></svg>
          Facebook
        </a>
      </div>

      <p class="note">Comptes démo uniquement (Client ID/Secret non configurés) — les boutons Google/Facebook ne fonctionneront qu'une fois les identifiants OAuth renseignés dans .env.</p>
    </div>
  </main>
</template>

<style scoped>
.page { display: flex; justify-content: center; padding: var(--space-xl) var(--space-md); }
.card {
  width: 100%; max-width: 380px; background: var(--color-surface);
  border: 1px solid var(--color-border); border-radius: calc(var(--radius) + 4px);
  padding: var(--space-lg);
}
.badge {
  width: 44px; height: 44px; border-radius: 12px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-ink));
  color: #fff; font-weight: 700; font-size: var(--step-0);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: var(--space-sm);
}
h1 { font-size: var(--step-2); margin-bottom: 4px; }
.subtitle { color: var(--color-ink-soft); font-size: var(--step--1); margin-bottom: var(--space-md); }

.switcher { display: flex; gap: var(--space-sm); margin-bottom: var(--space-md); }
.switcher button {
  flex: 1; padding: var(--space-xs) 0; border-radius: 13px;
  background: #f1f1f1; color: var(--color-ink); border: 1px solid transparent;
  font-size: var(--step--1); font-weight: 500;
  transition: background 0.15s var(--ease), color 0.15s var(--ease);
}
.switcher button:hover { background: #e8e8e8; }
.switcher button.active { background: rgb(11 110 79 / 0.1); color: var(--color-primary-ink); font-weight: 600; }

form { display: flex; flex-direction: column; gap: var(--space-sm); }
.field {
  display: flex; align-items: center; gap: var(--space-xs);
  border: 1px solid var(--color-border); border-radius: 13px; padding: 0 var(--space-sm);
  transition: border-color 0.15s var(--ease), box-shadow 0.15s var(--ease);
}
.field:focus-within { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgb(11 110 79 / 0.12); }
.field svg { width: 16px; height: 16px; color: var(--color-ink-soft); flex-shrink: 0; }
.field input { flex: 1; border: none; padding: var(--space-sm) 0; background: none; }
.field input:focus { outline: none; box-shadow: none; }

.submit { margin-top: var(--space-xs); width: 100%; }

.divider { display: flex; align-items: center; gap: var(--space-sm); margin: var(--space-md) 0; }
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--color-border); }
.divider span { font-size: var(--step--1); color: var(--color-ink-soft); }

.social { display: flex; gap: var(--space-sm); }
.social-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: var(--space-xs);
  padding: var(--space-xs) 0; border-radius: 13px; background: #f1f1f1; color: var(--color-ink);
  font-size: var(--step--1); font-weight: 500; text-decoration: none;
  transition: background 0.15s var(--ease);
}
.social-btn:hover { background: #e8e8e8; }

.note { margin-top: var(--space-md); font-size: var(--step--1); color: var(--color-ink-soft); }
.oauth-error {
  background: rgb(179 64 42 / 0.1); color: var(--color-danger); font-size: var(--step--1);
  padding: var(--space-xs) var(--space-sm); border-radius: 10px; margin-bottom: var(--space-sm);
}
</style>
