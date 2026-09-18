<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; statusMessage?: string } }>()

const is404 = computed(() => props.error?.statusCode === 404)

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="error-page">
    <div class="error-card">
      <div class="badge">{{ is404 ? '404' : (error?.statusCode || '!') }}</div>
      <h1>{{ is404 ? "Cette page n'existe pas" : 'Une erreur est survenue' }}</h1>
      <p class="subtitle">
        {{ is404
          ? "L'annonce ou la page que vous cherchez a peut-être été supprimée, ou l'adresse est incorrecte."
          : (error?.statusMessage || 'Quelque chose s\'est mal passé de notre côté.') }}
      </p>
      <button class="btn-primary" @click="handleError">Retour à l'accueil</button>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  padding: var(--space-md); background: var(--color-bg);
}
.error-card {
  text-align: center; max-width: 380px; background: var(--color-surface);
  border: 1px solid var(--color-border); border-radius: calc(var(--radius) + 4px);
  padding: var(--space-xl) var(--space-lg);
}
.badge {
  width: 64px; height: 64px; border-radius: 16px; margin: 0 auto var(--space-md);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-ink));
  color: #fff; font-weight: 700; font-size: var(--step-1);
  display: flex; align-items: center; justify-content: center;
}
h1 { margin-bottom: var(--space-xs); }
.subtitle { color: var(--color-ink-soft); margin-bottom: var(--space-md); }
</style>
