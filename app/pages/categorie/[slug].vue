<script setup lang="ts">
const route = useRoute()
const { fetchListings } = useListings()

const { data } = await useAsyncData(`cat-${route.params.slug}`, () =>
  fetchListings({ category: route.params.slug as string })
)
const listings = data.value?.results || []
</script>

<template>
  <main class="container">
    <NuxtLink to="/">&larr; Toutes les catégories</NuxtLink>
    <h1>Catégorie : {{ route.params.slug }}</h1>
    <div class="grid">
      <ListingCard v-for="l in listings" :key="l.id" :listing="l" />
    </div>
  </main>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(clamp(140px, 22vw, 200px), 1fr));
  gap: var(--space-sm);
  margin-top: var(--space-sm);
}
</style>
