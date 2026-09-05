<script setup lang="ts">
const route = useRoute()
const { fetchListing } = useListings()

const { data: listing } = await useAsyncData(`listing-${route.params.id}`, () =>
  fetchListing(route.params.id as string)
)

useHead({
  title: listing.value?.title,
  meta: [{ name: 'description', content: listing.value?.description?.slice(0, 150) }]
})

function formatPrice(p: number) {
  return new Intl.NumberFormat('fr-FR').format(p) + ' CFA'
}
</script>

<template>
  <main class="container" v-if="listing">
    <NuxtLink to="/">&larr; Retour</NuxtLink>
    <h1>{{ listing.title }}</h1>
    <p class="price">{{ formatPrice(listing.price) }}</p>
    <p class="city">{{ listing.city }}</p>
    <p class="desc">{{ listing.description }}</p>
    <button class="contact">Contacter le vendeur</button>
  </main>
</template>

<style scoped>
.container { max-width: 700px; }
.price { font-size: var(--step-2); font-weight: 700; color: var(--color-primary-ink); }
.city { color: var(--color-ink-soft); }
.desc { margin: var(--space-md) 0; line-height: 1.7; }
.contact {
  padding: var(--space-xs) var(--space-md);
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 500;
  transition: background 0.15s var(--ease), transform 0.15s var(--ease);
}
.contact:hover { background: var(--color-primary-ink); transform: translateY(-1px); }
</style>
