<script setup lang="ts">
const route = useRoute()
const token = route.query.token as string | undefined

const status = ref<'loading' | 'success' | 'error'>('loading')
const errorMsg = ref('')

onMounted(async () => {
  if (!token) {
    status.value = 'error'
    errorMsg.value = 'Lien invalide'
    return
  }
  try {
    await $fetch('/api/auth/verify-email', { method: 'POST', body: { token } })
    status.value = 'success'
  } catch (e: any) {
    status.value = 'error'
    errorMsg.value = e?.data?.statusMessage || 'Lien invalide ou déjà utilisé'
  }
})
</script>

<template>
  <main class="page">
    <div class="card">
      <div class="badge">AT</div>

      <template v-if="status === 'loading'">
        <h1>Vérification...</h1>
        <p class="subtitle">Un instant, on confirme votre email.</p>
      </template>

      <template v-else-if="status === 'success'">
        <h1>Email confirmé ✓</h1>
        <p class="subtitle">Votre adresse email est maintenant vérifiée.</p>
        <NuxtLink to="/" class="btn-primary submit" style="text-align:center; display:block;">Retour à l'accueil</NuxtLink>
      </template>

      <template v-else>
        <h1>Lien invalide</h1>
        <p class="subtitle">{{ errorMsg }}</p>
        <NuxtLink to="/" class="btn-primary submit" style="text-align:center; display:block;">Retour à l'accueil</NuxtLink>
      </template>
    </div>
  </main>
</template>

<style scoped>
.page { display: flex; justify-content: center; padding: var(--space-xl) var(--space-md); }
.card {
  width: 100%; max-width: 380px; background: var(--color-surface);
  border: 1px solid var(--color-border); border-radius: calc(var(--radius) + 4px);
  padding: var(--space-lg); text-align: center;
}
.badge {
  width: 44px; height: 44px; border-radius: 12px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-ink));
  color: #fff; font-weight: 700; font-size: var(--step-0);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto var(--space-sm);
}
h1 { font-size: var(--step-2); margin-bottom: 4px; }
.subtitle { color: var(--color-ink-soft); font-size: var(--step--1); margin-bottom: var(--space-md); }
</style>
