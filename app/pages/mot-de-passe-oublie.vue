<script setup lang="ts">
const email = ref('')
const submitting = ref(false)
const resultMsg = ref('')
const devLink = ref('')

async function submit() {
  submitting.value = true
  resultMsg.value = ''
  devLink.value = ''
  try {
    const res = await $fetch<{ message: string; devResetLink?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value }
    })
    resultMsg.value = res.message
    if (res.devResetLink) devLink.value = res.devResetLink
  } catch (e: any) {
    resultMsg.value = e?.data?.statusMessage || 'Une erreur est survenue'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="page">
    <div class="card">
      <div class="badge">AT</div>
      <h1>Mot de passe oublié</h1>
      <p class="subtitle">Entrez votre email, on vous envoie un lien pour le réinitialiser.</p>

      <form @submit.prevent="submit">
        <label class="field">
          <Icon name="mail" />
          <input v-model="email" type="email" placeholder="Email" required />
        </label>
        <button type="submit" class="btn-primary submit" :disabled="submitting">
          {{ submitting ? 'Envoi...' : 'Envoyer le lien' }}
        </button>
      </form>

      <p v-if="resultMsg" class="result">{{ resultMsg }}</p>

      <div v-if="devLink" class="dev-box">
        <p class="dev-label">⚠️ Mode démo — aucun email réel n'est envoyé ici :</p>
        <NuxtLink :to="devLink">{{ devLink }}</NuxtLink>
      </div>
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
.submit { margin-top: var(--space-xs); }
.result { margin-top: var(--space-md); font-size: var(--step--1); color: var(--color-ink-soft); }
.dev-box {
  margin-top: var(--space-sm); padding: var(--space-sm); border-radius: 10px;
  background: rgb(232 163 61 / 0.12); font-size: var(--step--1);
}
.dev-label { color: var(--color-accent-ink); font-weight: 600; margin: 0 0 4px; }
</style>
