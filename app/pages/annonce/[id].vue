<script setup lang="ts">
import type { Listing } from '~/composables/useListings'

const route = useRoute()
const { fetchListing, fetchListings } = useListings()
const { categoryName } = useCategories()
const favorites = useFavoritesStore()

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
  (relatedData.value?.results || []).filter((l: Listing) => l.id !== route.params.id)
)

// Vendeur de l'annonce
const { fetchSeller } = useSellers()
const { data: sellerData } = await useAsyncData(
  `seller-of-${route.params.id}`,
  () => (listing.value ? fetchSeller(listing.value.userId) : Promise.resolve(null))
)
const seller = computed(() => sellerData.value?.seller)

// Actions réservées au propriétaire (boost, marquer vendu)
const { loggedIn, user } = useUserSession()
const { open: openAuthModal } = useAuthModal()
const { fetchMyBalance, boostListing } = useCredits()

const isOwner = computed(() => loggedIn.value && user.value?.id === listing.value?.userId)
const creditBalance = ref<number | null>(null)
const boosting = ref(false)
const boostMsg = ref('')
const togglingSold = ref(false)

if (isOwner.value) {
  fetchMyBalance().then(res => { creditBalance.value = res.balance }).catch(() => {})
}

async function handleBoost() {
  if (!listing.value) return
  boosting.value = true
  boostMsg.value = ''
  try {
    const res = await boostListing(listing.value.id)
    listing.value.isTop = true
    creditBalance.value = res.newBalance
    boostMsg.value = 'Annonce boostée !'
  } catch (e: any) {
    boostMsg.value = e?.data?.statusMessage || 'Erreur lors du boost'
  } finally {
    boosting.value = false
  }
}

async function toggleSold() {
  if (!listing.value) return
  togglingSold.value = true
  try {
    const res = await $fetch<{ listing: Listing }>(`/api/listings/${listing.value.id}/sold`, { method: 'POST' })
    listing.value.isSold = res.listing.isSold
  } catch {
    // silencieux : bouton reste dans son état précédent
  } finally {
    togglingSold.value = false
  }
}

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

            <button v-if="listing.images.length > 1" class="btn-icon arrow left" @click="activeImage = (activeImage - 1 + listing.images.length) % listing.images.length"><Icon name="chevron-left" /></button>
            <button v-if="listing.images.length > 1" class="btn-icon arrow right" @click="activeImage = (activeImage + 1) % listing.images.length"><Icon name="chevron-right" /></button>

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
        <div v-if="isOwner" class="owner-card">
          <p class="owner-title">C'est votre annonce</p>
          <div class="owner-actions">
            <button class="btn-primary" :disabled="listing.isTop || boosting" @click="handleBoost">
              {{ listing.isTop ? 'Déjà boostée' : boosting ? 'Un instant...' : 'Booster (2 crédits)' }}
            </button>
            <button class="sold-btn" :class="{ active: listing.isSold }" :disabled="togglingSold" @click="toggleSold">
              {{ listing.isSold ? '✓ Marquée vendue' : 'Marquer comme vendue' }}
            </button>
          </div>
          <p v-if="creditBalance !== null" class="owner-balance">Solde : {{ creditBalance }} crédit(s)</p>
          <p v-if="boostMsg" class="owner-msg">{{ boostMsg }}</p>
        </div>

        <div class="price-card">
          <p class="price">{{ formatPrice(listing.price) }}</p>
          <p class="city">{{ listing.city }}</p>
          <template v-if="seller?.phone">
            <a :href="`tel:${seller.phone}`" class="btn-primary contact">Appeler le vendeur</a>
            <a
              :href="`https://wa.me/${seller.phone.replace(/\s+/g, '').replace('+', '')}`"
              target="_blank" rel="noopener" class="whatsapp-btn"
            >
              WhatsApp
            </a>
          </template>
          <button class="fav" @click="favorites.toggle(listing.id)">
            <Icon :name="favorites.isFavorite(listing.id) ? 'heart-filled' : 'heart'" />
            {{ favorites.isFavorite(listing.id) ? 'Retiré des favoris' : 'Ajouter aux favoris' }}
          </button>
        </div>
        <NuxtLink v-if="seller" :to="`/vendeur/${seller.id}`" class="seller-card">
          <div class="avatar">{{ seller.avatarInitials }}</div>
          <div>
            <p class="seller-name">
              {{ seller.name }}
              <Icon v-if="seller.isVerified" name="heart-filled" class="verified" aria-hidden="true" />
            </p>
            <p class="seller-link">Voir le profil</p>
          </div>
        </NuxtLink>
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
  position: relative;
  aspect-ratio: 4 / 3; background: #f1efe6; border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  margin-bottom: var(--space-xs);
}
.gallery-main img { width: 100%; height: 100%; object-fit: cover; }
.placeholder { color: var(--color-ink-soft); }

.arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  background: rgb(0 0 0 / 0.4); border-color: transparent; color: #fff;
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
.whatsapp-btn {
  display: flex; align-items: center; justify-content: center; width: 100%;
  padding: var(--space-xs) var(--space-md); border-radius: var(--radius-sm);
  background: #25d366; color: #fff; font-weight: 500; text-decoration: none;
  margin-bottom: var(--space-xs); transition: transform 0.15s var(--ease);
}
.whatsapp-btn:hover { transform: translateY(-1px); }

.owner-card {
  border: 1px solid var(--color-primary); background: rgb(11 110 79 / 0.06);
  border-radius: var(--radius); padding: var(--space-md); margin-bottom: var(--space-sm);
}
.owner-title { font-weight: 600; font-size: var(--step--1); color: var(--color-primary-ink); margin: 0 0 var(--space-sm); }
.owner-actions { display: flex; flex-direction: column; gap: var(--space-xs); }
.sold-btn {
  padding: var(--space-xs) var(--space-sm); border-radius: 13px; background: #f1f1f1;
  border: 1px solid transparent; font-size: var(--step--1); font-weight: 500;
  transition: background 0.15s var(--ease);
}
.sold-btn:hover { background: #e8e8e8; }
.sold-btn.active { background: rgb(11 110 79 / 0.12); color: var(--color-primary-ink); }
.owner-balance { font-size: var(--step--1); color: var(--color-ink-soft); margin: var(--space-xs) 0 0; }
.owner-msg { font-size: var(--step--1); color: var(--color-primary-ink); margin: 4px 0 0; }
.fav {
  width: 100%; display: flex; align-items: center; justify-content: center; gap: var(--space-xs);
  background: none; border: 1px solid var(--color-border); border-radius: var(--radius-sm);
  padding: var(--space-xs); transition: border-color 0.15s var(--ease);
}
.fav:hover { border-color: var(--color-border-strong); }
.fav svg { width: 16px; height: 16px; }
.safety-card h3 { font-size: var(--step-0); margin-bottom: var(--space-xs); }
.safety-card ul { margin: 0; padding-left: 1.1em; font-size: var(--step--1); color: var(--color-ink-soft); display: flex; flex-direction: column; gap: 4px; }

.seller-card {
  display: flex; align-items: center; gap: var(--space-sm);
  border: 1px solid var(--color-border); border-radius: var(--radius); padding: var(--space-md);
  background: var(--color-surface); text-decoration: none; color: inherit;
  transition: border-color 0.15s var(--ease);
}
.seller-card:hover { border-color: var(--color-border-strong); }
.seller-card .avatar {
  width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-ink));
  color: #fff; font-weight: 700; font-size: var(--step--1);
  display: flex; align-items: center; justify-content: center;
}
.seller-name { display: flex; align-items: center; gap: 4px; margin: 0; font-weight: 600; font-size: var(--step--1); }
.seller-name .verified { width: 13px; height: 13px; color: var(--color-primary); }
.seller-link { margin: 2px 0 0; font-size: var(--step--1); color: var(--color-ink-soft); }
</style>
