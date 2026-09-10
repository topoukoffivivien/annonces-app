<script setup lang="ts">
import type { Listing } from '~/composables/useListings'

const favorites = useFavoritesStore()
const { fetchListings } = useListings()

const { data } = await useAsyncData<{ count: number; results: Listing[] }>(
  'all-for-favs',
  () => fetchListings()
)

const favoriteListings = computed<Listing[]>(() =>
  (data.value?.results || []).filter((l: Listing) => favorites.isFavorite(l.id))
)

const isLoadingFavs = computed(() => !favorites.loaded)
const showFavSkeleton = useMinLoading(isLoadingFavs, 400)
</script>

<template>
  <main class="container">
    <h1>Mes favoris</h1>
    <p class="subtitle">{{ favoriteListings.length }} annonce(s) enregistrée(s)</p>

    <div v-if="showFavSkeleton" class="grid">
      <ListingCardSkeleton v-for="n in 4" :key="n" />
    </div>

    <div v-else-if="favoriteListings.length" class="grid">
      <ListingCard v-for="l in favoriteListings" :key="l.id" :listing="l" />
    </div>

    <div v-else class="empty">
      <p>Aucune annonce en favori pour l'instant.</p>
      <NuxtLink to="/" class="btn-primary">Parcourir les annonces</NuxtLink>
    </div>
  </main>
</template>

<style scoped>
.subtitle { color: var(--color-ink-soft); margin-bottom: var(--space-md); }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(clamp(140px, 22vw, 200px), 1fr));
  gap: var(--space-sm);
}
.empty {
  text-align: center; padding: var(--space-xl) 0; display: flex;
  flex-direction: column; align-items: center; gap: var(--space-md); color: var(--color-ink-soft);
}
</style>
