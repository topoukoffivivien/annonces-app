<script setup lang="ts">
const props = defineProps<{
  listing: {
    id: string
    title: string
    price: number
    city: string
    isTop: boolean
    images: string[]
  }
}>()

const favorites = useFavoritesStore()

function formatPrice(p: number) {
  return new Intl.NumberFormat('fr-FR').format(p) + ' CFA'
}

function toggleFavorite() {
  favorites.toggle(props.listing.id)
}
</script>

<template>
  <NuxtLink :to="`/annonce/${listing.id}`" class="card">
    <div class="thumb">
      <img v-if="listing.images[0]" :src="listing.images[0]" :alt="listing.title" />
      <span v-else class="placeholder">Photo</span>
      <span v-if="listing.isTop" class="badge-top">TOP</span>
      <button
        class="btn-icon fav-btn"
        :class="{ active: favorites.isFavorite(listing.id) }"
        @click.stop.prevent="toggleFavorite"
        :aria-label="favorites.isFavorite(listing.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'"
      >
        <Icon :name="favorites.isFavorite(listing.id) ? 'heart-filled' : 'heart'" />
      </button>
    </div>
    <div class="info">
      <p class="price">{{ formatPrice(listing.price) }}</p>
      <p class="title">{{ listing.title }}</p>
      <p class="city">{{ listing.city }}</p>
    </div>
  </NuxtLink>
</template>

<style scoped>
.card {
  display: block;
  text-decoration: none;
  color: inherit;
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
}
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