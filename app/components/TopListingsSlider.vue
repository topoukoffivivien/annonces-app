<script setup lang="ts">
defineProps<{
  listings: Array<{ id: string; title: string; price: number; city: string; images: string[] }>
  title?: string
}>()

const favorites = useFavoritesStore()
const track = ref<HTMLElement | null>(null)

function scroll(dir: number) {
  track.value?.scrollBy({ left: dir * 220, behavior: 'smooth' })
}
function formatPrice(p: number) {
  return new Intl.NumberFormat('fr-FR').format(p) + ' CFA'
}
</script>

<template>
  <section v-if="listings.length" class="slider">
    <div class="slider-head">
      <h2>{{ title || 'À la une' }}</h2>
      <div class="nav">
        <button class="btn-icon" @click="scroll(-1)" aria-label="Précédent"><Icon name="chevron-left" /></button>
        <button class="btn-icon" @click="scroll(1)" aria-label="Suivant"><Icon name="chevron-right" /></button>
      </div>
    </div>
    <div class="track" ref="track">
      <div v-for="l in listings" :key="l.id" class="slide">
        <NuxtLink :to="`/annonce/${l.id}`" class="slide-link">
          <div class="thumb">
            <img v-if="l.images[0]" :src="l.images[0]" :alt="l.title" />
            <span v-else class="placeholder">Photo</span>
          </div>
          <p class="price">{{ formatPrice(l.price) }}</p>
          <p class="title">{{ l.title }}</p>
          <p class="city">{{ l.city }}</p>
        </NuxtLink>

        <button
          class="btn-icon fav-btn"
          :class="{ active: favorites.isFavorite(l.id) }"
          @click="favorites.toggle(l.id)"
          :aria-label="favorites.isFavorite(l.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'"
        >
          <Icon :name="favorites.isFavorite(l.id) ? 'heart-filled' : 'heart'" />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slider { margin-bottom: var(--space-lg); }
.slider-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--space-sm); }
.slider-head h2 { margin: 0; }
.nav { display: flex; gap: var(--space-xs); }
.track {
  display: flex; gap: var(--space-sm); overflow-x: auto; scroll-snap-type: x mandatory;
  padding-bottom: var(--space-xs); scrollbar-width: none;
}
.track::-webkit-scrollbar { display: none; }
.slide {
  position: relative;
  flex: 0 0 clamp(140px, 32vw, 180px);
  scroll-snap-align: start;
}
.slide-link { display: block; text-decoration: none; color: inherit; }
.thumb {
  aspect-ratio: 1 / 1; background: #f1efe6; border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.thumb img { width: 100%; height: 100%; object-fit: cover; }
.placeholder { color: var(--color-ink-soft); font-size: var(--step--1); }
.fav-btn {
  position: absolute; top: var(--space-xs); right: var(--space-xs);
  background: rgb(255 255 255 / 0.85); z-index: 2;
}
.fav-btn.active { background: rgb(255 255 255 / 0.85); color: var(--color-coral); }
.price { font-weight: 700; margin: var(--space-xs) 0 0; color: var(--color-primary-ink); }
.title { font-size: var(--step--1); margin: 2px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.city { font-size: var(--step--1); color: var(--color-ink-soft); margin: 0; }
</style>
