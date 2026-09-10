<script setup lang="ts">
defineProps<{
  listings: Array<{ id: string; title: string; price: number; city: string; images: string[]; isTop?: boolean }>
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
      <div v-for="l in listings" :key="l.id" class="card">
        <NuxtLink :to="`/annonce/${l.id}`" class="card-link">
          <div class="thumb">
            <img v-if="l.images[0]" :src="l.images[0]" :alt="l.title" />
            <span v-else class="placeholder">Photo</span>
            <span v-if="l.isTop" class="badge-top">TOP</span>
          </div>
          <div class="info">
            <p class="price">{{ formatPrice(l.price) }}</p>
            <p class="title">{{ l.title }}</p>
            <p class="city">{{ l.city }}</p>
          </div>
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

/* Structure identique à ListingCard.vue */
.card {
  position: relative;
  flex: 0 0 clamp(140px, 32vw, 180px);
  scroll-snap-align: start;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: border-color 0.2s var(--ease), transform 0.2s var(--ease);
}
.card:hover {
  border-color: var(--color-border-strong);
  transform: translateY(-3px);
}
.card-link {
  display: block;
  text-decoration: none;
  color: inherit;
}
.thumb {
  position: relative;
  aspect-ratio: 1 / 1;
  background: #f1efe6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s var(--ease);
}
.card:hover .thumb img { transform: scale(1.04); }
.placeholder { color: var(--color-ink-soft); font-size: var(--step--1); }
.badge-top {
  position: absolute;
  top: var(--space-xs);
  left: var(--space-xs);
  background: var(--color-accent);
  color: var(--color-accent-ink);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  padding: 2px 8px;
  border-radius: 999px;
}
.fav-btn {
  position: absolute;
  top: var(--space-xs);
  right: var(--space-xs);
  background: rgb(255 255 255 / 0.85);
  z-index: 2;
}
.fav-btn.active { background: rgb(255 255 255 / 0.85); color: var(--color-coral); }
.info { padding: var(--space-sm); }
.price { font-weight: 700; font-size: var(--step-0); margin: 0; color: var(--color-primary-ink); }
.title {
  font-size: var(--step--1);
  margin: var(--space-xs) 0 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.city { font-size: var(--step--1); color: var(--color-ink-soft); margin: 0; }
</style>