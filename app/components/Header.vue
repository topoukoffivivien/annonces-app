<script setup lang="ts">
const { categories } = useCategories()
const open = ref(false)
</script>

<template>
  <header class="site-header">
    <div class="bar">
      <NuxtLink to="/" class="logo">Annonces<span>TG</span></NuxtLink>

      <nav class="nav-links">
        <NuxtLink v-for="c in categories" :key="c.slug" :to="`/categorie/${c.slug}`">{{ c.name }}</NuxtLink>
      </nav>

      <div class="actions">
        <NuxtLink to="/publier" class="btn-primary">Publier une annonce</NuxtLink>
        <button class="burger" @click="open = !open" aria-label="Menu">☰</button>
      </div>
    </div>

    <nav v-if="open" class="mobile-nav">
      <NuxtLink v-for="c in categories" :key="c.slug" :to="`/categorie/${c.slug}`" @click="open = false">{{ c.name }}</NuxtLink>
      <NuxtLink to="/publier" @click="open = false">Publier une annonce</NuxtLink>
    </nav>
  </header>
</template>

<style scoped>
.site-header { position: sticky; top: 0; z-index: 20; background: var(--color-surface); border-bottom: 1px solid var(--color-border); }
.bar { max-width: 1100px; margin-inline: auto; padding: var(--space-sm) var(--space-md); display: flex; align-items: center; gap: var(--space-md); }
.logo { font-weight: 700; font-size: var(--step-1); color: var(--color-primary-ink); }
.logo span { color: var(--color-accent-ink); }
.nav-links { display: flex; gap: var(--space-md); margin-left: var(--space-md); flex: 1; }
.nav-links a { font-size: var(--step--1); color: var(--color-ink-soft); }
.nav-links a:hover { color: var(--color-primary-ink); }
.actions { display: flex; align-items: center; gap: var(--space-sm); }
.burger { display: none; background: none; border: none; font-size: 20px; }

@media (max-width: 720px) {
  .nav-links { display: none; }
  .burger { display: block; }
}
.mobile-nav { display: flex; flex-direction: column; padding: var(--space-sm) var(--space-md) var(--space-md); border-top: 1px solid var(--color-border); }
.mobile-nav a { padding: var(--space-xs) 0; font-size: var(--step-0); }
</style>