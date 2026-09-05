<script setup lang="ts">
const emit = defineEmits<{ search: [string] }>()
const q = ref('')
</script>

<template>
  <section class="hero">
    <div class="hero-inner">
      <h1>Trouvez ce qu'il vous faut, près de chez vous</h1>
      <p>Des milliers d'annonces au Togo — véhicules, immobilier, électronique et plus.</p>
      <form class="search" @submit.prevent="emit('search', q)">
        <input v-model="q" type="text" placeholder="Rechercher une annonce..." />
        <button type="submit">Rechercher</button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-ink) 100%);
  color: #fff; border-radius: var(--radius); margin-bottom: var(--space-lg);
  padding: var(--space-xl) var(--space-md);
}
.hero-inner { max-width: 640px; margin-inline: auto; text-align: center; }
.hero h1 { color: #fff; margin-bottom: var(--space-xs); }
.hero p { color: rgb(255 255 255 / 0.85); margin-bottom: var(--space-md); }
.search { display: flex; gap: var(--space-xs); max-width: 480px; margin-inline: auto; }
.search input { flex: 1; border: none; }
.search button {
  padding: var(--space-xs) var(--space-md); border: none; border-radius: var(--radius-sm);
  background: var(--color-accent); color: var(--color-accent-ink); font-weight: 600;
  transition: transform 0.15s var(--ease);
}
.search button:hover { transform: translateY(-1px); }
</style>