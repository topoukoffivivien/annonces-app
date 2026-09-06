<script setup lang="ts">
const { open: openAuthModal } = useAuthModal()
const { categories } = useCategories()
const favorites = useFavoritesStore()
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
        <NuxtLink to="/favoris" class="btn-icon icon-link" aria-label="Favoris">
          <Icon name="heart" />
          <span v-if="favorites.count" class="badge">{{ favorites.count }}</span>
        </NuxtLink>
        <button class="login" @click="openAuthModal">Se connecter</button>
        <NuxtLink to="/publier" class="btn-primary">Publier une annonce</NuxtLink>
        <button class="btn-icon burger" @click="open = !open" aria-label="Menu">
          <Icon name="menu" />
        </button>
      </div>
    </div>

    <nav v-if="open" class="mobile-nav">
      <NuxtLink v-for="c in categories" :key="c.slug" :to="`/categorie/${c.slug}`" @click="open = false">{{ c.name }}</NuxtLink>
      <NuxtLink to="/favoris" @click="open = false">Favoris ({{ favorites.count }})</NuxtLink>
      <button class="login" @click="openAuthModal">Se connecter</button>
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

.icon-link { position: relative; }
.badge {
  position: absolute; top: -6px; right: -8px; background: var(--color-coral); color: #fff;
  font-size: 10px; font-weight: 700; border-radius: 999px; min-width: 16px; height: 16px;
  display: flex; align-items: center; justify-content: center; padding: 0 3px;
}
.login {
  font-size: var(--step--1); padding: var(--space-xs) var(--space-sm);
  border: 1px solid var(--color-border); border-radius: var(--radius-sm);
  transition: border-color 0.15s var(--ease);
}
.login:hover { border-color: var(--color-border-strong); }

.burger { display: none; }

@media (max-width: 720px) {
  .nav-links, .login { display: none; }
  .burger { display: flex; }
}
.mobile-nav { display: flex; flex-direction: column; padding: var(--space-sm) var(--space-md) var(--space-md); border-top: 1px solid var(--color-border); }
.mobile-nav a { padding: var(--space-xs) 0; font-size: var(--step-0); }
</style>