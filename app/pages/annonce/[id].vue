<script setup lang="ts">
import type { Listing } from '~/composables/useListings'

const route = useRoute()
const { fetchListing, fetchListings } = useListings()
const { categoryName } = useCategories()

const { data: listing } = await useAsyncData<Listing>(`listing-${route.params.id}`, () =>
  fetchListing(route.params.id as string)
)

useHead({
  title: listing.value?.title,
  meta: [{ name: 'description', content: listing.value?.description?.slice(0, 150) }]
})

// Annonces similaires (même catégorie, en excluant l'annonce courante)
const { data: relatedData } = await useAsyncData<{ count: number; results: Listing[] }>(
  `related-${route.params.id}`,
  () => {
    if (!listing.value) {
      return Promise.resolve({ count: 0, results: [] as Listing[] })
    }
    return fetchListings({ category: listing.value.categorySlug })
  }
)

const relatedListings = computed<Listing[]>(() =>
  (relatedData.value?.results || []).filter(l => l.id !== route.params.id)
)

// Slider automatique de la galerie
const activeImage = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

function startAutoplay() {
  if (!listing.value || listing.value.images.length <= 1) return
  stopAutoplay()
  timer = setInterval(() => {
    activeImage.value = (activeImage.value + 1) % listing.value!.images.length
  }, 4000)
}
function stopAutoplay() {
  if (timer) clearInterval(timer)
}

onMounted(startAutoplay)
onUnmounted(stopAutoplay)

function formatPrice(p: number) {
  return new Intl.NumberFormat('fr-FR').format(p) + ' CFA'
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <main class="container" v-if="listing">
    <nav class="breadcrumb">
      <NuxtLink to="/">Accueil</NuxtLink> ›
      <NuxtLink :to="`/categorie/${listing.categorySlug}`">{{ categoryName(listing.categorySlug) }}</NuxtLink> ›
      <span>{{ listing.title }}</span>
    </nav>

    <div class="layout">
      <div class="main-col">
        <div class="gallery" @mouseenter="stopAutoplay" @mouseleave="startAutoplay">
          <div class="gallery-main">
            <img v-if="listing.images[activeImage]" :src="listing.images[activeImage]" :alt="listing.title" />
            <span v-else class="placeholder">Aucune photo disponible</span>

            <button v-if="listing.images.length > 1" class="arrow left" @click="activeImage = (activeImage - 1 + listing.images.length) % listing.images.length">‹</button>
            <button v-if="listing.images.length > 1" class="arrow right" @click="activeImage = (activeImage + 1) % listing.images.length">›</button>

            <div v-if="listing.images.length > 1" class="dots">
              <button
                v-for="(_, i) in listing.images"
                :key="i"
                :class="{ active: i === activeImage }"
                @click="activeImage = i"
                :aria-label="`Photo ${i + 1}`"
              />
            </div>
          </div>
        </div>

        <h1>{{ listing.title }}</h1>
        <p class="meta">{{ listing.city }} · Publié le {{ formatDate(listing.createdAt) }}</p>
        <h2>Description</h2>
        <p class="desc">{{ listing.description || 'Aucune description fournie.' }}</p>
      </div>

      <aside class="side-col">
        <div class="price-card">
          <p class="price">{{ formatPrice(listing.price) }}</p>
          <p class="city">{{ listing.city }}</p>
          <button class="btn-primary contact">Contacter le vendeur</button>
          <button class="fav">☆ Ajouter aux favoris</button>
        </div>
        <div class="safety-card">
          <h3>Conseils de sécurité</h3>
          <ul>
            <li>Rencontrez le vendeur dans un lieu public</li>
            <li>Vérifiez l'article avant de payer</li>
            <li>Ne payez jamais à l'avance sans avoir vu l'article</li>
          </ul>
        </div>
      </aside>
    </div>
    <TopListingsSlider :listings="relatedListings" title="Annonces similaires" />
  </main>
</template>

<style scoped>
.container { max-width: 1000px; }
.breadcrumb { font-size: var(--step--1); color: var(--color-ink-soft); margin-bottom: var(--space-md); }
.breadcrumb a { color: var(--color-ink-soft); }
.breadcrumb a:hover { color: var(--color-primary-ink); }

.layout { display: grid; grid-template-columns: 1fr; gap: var(--space-lg); }
@media (min-width: 800px) {
  .layout { grid-template-columns: 2fr 1fr; align-items: start; }
}

.gallery-main {
  aspect-ratio: 4 / 3; background: #f1efe6; border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  margin-bottom: var(--space-xs);
}
.gallery-main img { width: 100%; height: 100%; object-fit: cover; }
.placeholder { color: var(--color-ink-soft); }
/* .thumbs { display: flex; gap: var(--space-xs); overflow-x: auto; }
.thumbs button {
  flex: 0 0 64px; aspect-ratio: 1; border-radius: var(--radius-sm); overflow: hidden;
  border: 2px solid transparent; padding: 0; background: none;
}
.thumbs button.active { border-color: var(--color-primary); }
.thumbs img { width: 100%; height: 100%; object-fit: cover; } */

.gallery-main { position: relative; }
.arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 32px; height: 32px; border-radius: 50%; border: none;
  background: rgb(0 0 0 / 0.4); color: #fff; font-size: 18px; line-height: 1;
  transition: background 0.15s var(--ease);
}
.arrow:hover { background: rgb(0 0 0 / 0.6); }
.arrow.left { left: var(--space-xs); }
.arrow.right { right: var(--space-xs); }
.dots {
  position: absolute; bottom: var(--space-xs); left: 50%; transform: translateX(-50%);
  display: flex; gap: 6px;
}
.dots button {
  width: 8px; height: 8px; border-radius: 50%; border: none; padding: 0;
  background: rgb(255 255 255 / 0.5); transition: background 0.15s var(--ease);
}
.dots button.active { background: #fff; }

.meta { color: var(--color-ink-soft); font-size: var(--step--1); margin-bottom: var(--space-md); }
.desc { line-height: 1.7; }

.side-col { display: flex; flex-direction: column; gap: var(--space-sm); position: sticky; top: calc(var(--space-md) + 60px); }
.price-card, .safety-card {
  border: 1px solid var(--color-border); border-radius: var(--radius); padding: var(--space-md);
  background: var(--color-surface);
}
.price-card .price { font-size: var(--step-2); font-weight: 700; color: var(--color-primary-ink); margin: 0; }
.price-card .city { color: var(--color-ink-soft); font-size: var(--step--1); margin: 0 0 var(--space-sm); }
.contact { width: 100%; margin-bottom: var(--space-xs); }
.fav {
  width: 100%; background: none; border: 1px solid var(--color-border); border-radius: var(--radius-sm);
  padding: var(--space-xs); transition: border-color 0.15s var(--ease);
}
.fav:hover { border-color: var(--color-border-strong); }
.safety-card h3 { font-size: var(--step-0); margin-bottom: var(--space-xs); }
.safety-card ul { margin: 0; padding-left: 1.1em; font-size: var(--step--1); color: var(--color-ink-soft); display: flex; flex-direction: column; gap: 4px; }
</style>