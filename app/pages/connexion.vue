<script setup lang="ts">
const mode = ref<'login' | 'signup'>('login')
</script>

<template>
  <main class="page">
    <div class="card">
      <div class="badge">AT</div>
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

      <p class="note">Le système d'authentification n'est pas encore branché — ce formulaire est un espace réservé.</p>
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

.switcher { display: flex; background: var(--color-bg); border-radius: 999px; padding: 3px; margin-bottom: var(--space-md); }
.switcher button {
  flex: 1; padding: var(--space-xs) 0; border-radius: 999px; font-size: var(--step--1);
  color: var(--color-ink-soft); transition: background 0.15s var(--ease), color 0.15s var(--ease);
}
.switcher button.active { background: var(--color-surface); color: var(--color-primary-ink); font-weight: 600; box-shadow: 0 1px 3px rgb(31 36 32 / 0.1); }

form { display: flex; flex-direction: column; gap: var(--space-sm); }
.field {
  display: flex; align-items: center; gap: var(--space-xs);
  border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 var(--space-sm);
  transition: border-color 0.15s var(--ease), box-shadow 0.15s var(--ease);
}
.field:focus-within { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgb(11 110 79 / 0.12); }
.field svg { width: 16px; height: 16px; color: var(--color-ink-soft); flex-shrink: 0; }
.field input { flex: 1; border: none; padding: var(--space-sm) 0; background: none; }
.field input:focus { outline: none; box-shadow: none; }

.submit { margin-top: var(--space-xs); width: 100%; }
.note { margin-top: var(--space-md); font-size: var(--step--1); color: var(--color-ink-soft); }
</style>