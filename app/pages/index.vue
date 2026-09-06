<script setup lang="ts">
import type { Listing } from '~/composables/useListings'

const { fetchListings } = useListings()

const { data: initial } = await useAsyncData<{ count: number; results: Listing[] }>(
  'listings',
  () => fetchListings()
)
const listings = ref<Listing[]>(initial.value?.results || [])
const topListings = computed(() => listings.value.filter((l: Listing) => l.isTop))

const categories = [
  { slug: 'vehicules', name: 'Véhicules', icon: 'car' },
  { slug: 'immobilier', name: 'Immobilier', icon: 'home' },
  { slug: 'electronique', name: 'Électronique', icon: 'smartphone' },
  { slug: 'mode-et-beaute', name: 'Mode & Beauté', icon: 'shirt' },
  { slug: 'emplois', name: 'Emplois', icon: 'briefcase' }
]
const cities = ['Lomé', 'Kara', 'Sokodé', 'Kpalimé', 'Atakpamé', 'Tsévié']

const pageSize = 8
const currentPage = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(listings.value.length / pageSize)))
const paginatedListings = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return listings.value.slice(start, start + pageSize)
})

async function onFilter(filters: Record<string, string>) {
  const res = await fetchListings(filters)
  listings.value = res.results
  currentPage.value = 1
}

function filterByCategory(slug: string) {
  onFilter({ category: slug })
}

function changePage(p: number) {
  currentPage.value = p
  document.getElementById('resultats')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <main class="container">
    <Banner @search="q => onFilter({ q })" />

    <section class="intro">
      <h1>Trouvez votre bonheur près de chez vous</h1>
      <p class="subtitle">{{ listings.length }} annonces publiées par notre communauté au Togo</p>
    </section>

    <nav class="category-chips">
      <button v-for="c in categories" :key="c.slug" @click="filterByCategory(c.slug)">
        <Icon :name="c.icon" /> {{ c.name }}
      </button>
    </nav>

    <TopListingsSlider :listings="topListings" />

    <FilterBar :categories="categories" :cities="cities" @filter="onFilter" />

    <div id="resultats">
      <div class="grid">
        <ListingCard v-for="l in paginatedListings" :key="l.id" :listing="l" />
      </div>
      <p v-if="!listings.length" class="empty">Aucune annonce ne correspond à ces critères.</p>

      <Pagination :current-page="currentPage" :total-pages="totalPages" @change="changePage" />
    </div>
  </main>
</template>

<style scoped>
.intro { text-align: center; margin: var(--space-lg) 0 var(--space-md); }
.intro h1 { margin-bottom: var(--space-xs); }
.subtitle { color: var(--color-ink-soft); }

.category-chips {
  display: flex; gap: var(--space-sm); overflow-x: auto; padding-bottom: var(--space-xs);
  margin-bottom: var(--space-lg); scrollbar-width: none;
}
.category-chips::-webkit-scrollbar { display: none; }
.category-chips button {
  display: flex; align-items: center; gap: 6px; white-space: nowrap;
  padding: var(--space-xs) var(--space-md); border: 1px solid var(--color-border);
  border-radius: 999px; background: var(--color-surface); font-size: var(--step--1);
  transition: border-color 0.15s var(--ease), transform 0.15s var(--ease);
}
.category-chips button:hover { border-color: var(--color-primary); transform: translateY(-1px); }
.category-chips svg { width: 15px; height: 15px; }

.empty { text-align: center; color: var(--color-ink-soft); padding: var(--space-lg) 0; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(clamp(140px, 22vw, 200px), 1fr));
  gap: var(--space-sm);
}
</style>