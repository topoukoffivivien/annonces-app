<script setup lang="ts">
const route = useRoute()
const token = computed(() => route.query.token as string | undefined)

const password = ref('')
const confirm = ref('')
const submitting = ref(false)
const errorMsg = ref('')
const done = ref(false)

async function submit() {
  errorMsg.value = ''
  if (password.value !== confirm.value) {
    errorMsg.value = 'Les mots de passe ne correspondent pas'
    return
  }
  if (!token.value) {
    errorMsg.value = 'Lien invalide'
    return
  }
  submitting.value = true
  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { token: token.value, password: password.value }
    })
    done.value = true
  } catch (e: any) {
    errorMsg.value = e?.data?.statusMessage || 'Une erreur est survenue'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="page">
    <div class="card">
      <div class="badge">AT</div>

      <template v-if="done">
        <h1>Mot de passe mis à jour</h1>
        <p class="subtitle">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
        <NuxtLink to="/connexion" class="btn-primary submit" style="text-align:center; display:block;">Se connecter</NuxtLink>
      </template>

      <template v-else-if="!token">
        <h1>Lien invalide</h1>
        <p class="subtitle">Ce lien de réinitialisation est incomplet ou incorrect.</p>
        <NuxtLink to="/mot-de-passe-oublie" class="btn-primary submit" style="text-align:center; display:block;">Redemander un lien</NuxtLink>
      </template>

      <template v-else>
        <h1>Nouveau mot de passe</h1>
        <p class="subtitle">Choisissez un nouveau mot de passe pour votre compte.</p>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <form @submit.prevent="submit">
          <label class="field">
            <Icon name="lock" />
            <input v-model="password" type="password" placeholder="Nouveau mot de passe" required minlength="6" />
          </label>
          <label class="field">
            <Icon name="lock" />
            <input v-model="confirm" type="password" placeholder="Confirmer le mot de passe" required minlength="6" />
          </label>
          <button type="submit" class="btn-primary submit" :disabled="submitting">
            {{ submitting ? 'Un instant...' : 'Mettre à jour' }}
          </button>
        </form>
      </template>
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
.error-msg {
  background: rgb(179 64 42 / 0.1); color: var(--color-danger); font-size: var(--step--1);
  padding: var(--space-xs) var(--space-sm); border-radius: 10px; margin-bottom: var(--space-sm);
}
</style>
