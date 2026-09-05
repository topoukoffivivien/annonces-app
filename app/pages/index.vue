<script setup lang="ts">
const { fetchListings } = useListings()

const { data: initial } = await useAsyncData('listings', () => fetchListings())
const listings = ref(initial.value?.results || [])
const topListings = computed(() => listings.value.filter(l => l.isTop))

const categories = [
  { slug: 'vehicules', name: 'Véhicules' },
  { slug: 'immobilier', name: 'Immobilier' },
  { slug: 'electronique', name: 'Électronique' },
  { slug: 'mode-et-beaute', name: 'Mode & Beauté' },
  { slug: 'emplois', name: 'Emplois' }
]
const cities = ['Lomé', 'Kara', 'Sokodé', 'Kpalimé', 'Atakpamé', 'Tsévié']

async function onFilter(filters: Record<string, string>) {
  const res = await fetchListings(filters)
  listings.value = res.results
}
</script>


<template>
  <main class="container">
    <h1>Petites annonces</h1>
    <TopListingsSlider :listings="topListings" />
    <FilterBar :categories="categories" :cities="cities" @filter="onFilter" />
    <div class="grid">
      <ListingCard v-for="l in listings" :key="l.id" :listing="l" />
    </div>
    <p v-if="!listings.length">Aucune annonce ne correspond à ces critères.</p>
  </main>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(clamp(140px, 22vw, 200px), 1fr));
  gap: var(--space-sm);
}
</style>
