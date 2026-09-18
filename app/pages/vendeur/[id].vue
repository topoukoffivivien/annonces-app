<script setup lang="ts">
import type { Listing } from '~/composables/useListings'
import type { Seller } from '~/composables/useSellers'

const route = useRoute()
const { fetchSeller } = useSellers()

const { data } = await useAsyncData<{ seller: Seller; listings: Listing[]; listingsCount: number }>(
  `seller-${route.params.id}`,
  () => fetchSeller(route.params.id as string)
)

const seller = computed(() => data.value?.seller)
const listings = computed<Listing[]>(() => data.value?.listings || [])
const activeListings = computed(() => listings.value.filter((l: Listing) => !l.isSold))
const soldListings = computed(() => listings.value.filter((l: Listing) => l.isSold))

useHead({
  title: seller.value ? `${seller.value.name} — Vendeur` : 'Profil vendeur'
})

function formatMemberSince(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

const isFollowing = ref(false)
const alertsEnabled = ref(false)
const alertsLoading = ref(false)
const activeTab = ref<'active' | 'sold' | 'apropos' | 'avis'>('active')

const { loggedIn, user } = useUserSession()
const { open: openAuthModal } = useAuthModal()
const { fetchSubscribed, toggleAlert } = useAlerts()
const { fetchReviews, submitReview } = useReviews()

const reviews = ref<any[]>([])
const reviewAverage = ref(0)
const reviewCount = ref(0)
const myRating = ref(0)
const myComment = ref('')
const submittingReview = ref(false)
const reviewMsg = ref('')
const isSelf = computed(() => loggedIn.value && user.value?.id === seller.value?.id)

async function loadReviews() {
  if (!seller.value) return
  try {
    const res = await fetchReviews(seller.value.id)
    reviews.value = res.reviews
    reviewAverage.value = res.average
    reviewCount.value = res.count
    const mine = res.reviews.find((r: any) => r.authorId === user.value?.id)
    if (mine) { myRating.value = mine.rating; myComment.value = mine.comment }
  } catch { /* silencieux */ }
}
watch(seller, loadReviews, { immediate: true })

async function handleSubmitReview() {
  if (!seller.value) return
  if (!loggedIn.value) { openAuthModal(); return }
  if (!myRating.value) { reviewMsg.value = 'Choisissez une note.'; return }
  submittingReview.value = true
  reviewMsg.value = ''
  try {
    await submitReview(seller.value.id, myRating.value, myComment.value)
    reviewMsg.value = 'Merci pour votre avis !'
    await loadReviews()
  } catch (e: any) {
    reviewMsg.value = e?.data?.statusMessage || 'Erreur lors de l\'envoi'
  } finally {
    submittingReview.value = false
  }
}

watch(seller, async (s) => {
  if (s && loggedIn.value) {
    try {
      const res = await fetchSubscribed(s.id)
      alertsEnabled.value = res.subscribed
    } catch { /* silencieux */ }
  }
}, { immediate: true })

async function handleAlertsToggle() {
  if (!seller.value) return
  if (!loggedIn.value) {
    openAuthModal()
    return
  }
  alertsLoading.value = true
  try {
    const res = await toggleAlert(seller.value.id)
    alertsEnabled.value = res.subscribed
  } catch { /* silencieux */ }
  finally {
    alertsLoading.value = false
  }
}
</script>

<template>
  <main class="container" v-if="seller">
    <div class="profile-card">
      <div class="avatar">
        {{ seller.avatarInitials }}
        <span v-if="seller.isVerified" class="verified-dot"><Icon name="heart-filled" /></span>
      </div>

      <h1>{{ seller.name }}</h1>
      <span v-if="seller.isVerified" class="verified-badge">
        <Icon name="heart-filled" /> Identité vérifiée
      </span>

      <p class="meta">
        <Icon name="map-pin" /> {{ seller.city }}
        <span class="dot">·</span>
        Membre depuis {{ formatMemberSince(seller.memberSince) }}
      </p>

      <div class="actions">
        <a :href="`tel:${seller.phone}`" class="action-btn primary">Appeler</a>
        <a :href="`https://wa.me/${seller.phone.replace(/\s+/g, '').replace('+', '')}`" target="_blank" rel="noopener" class="action-btn whatsapp">
          WhatsApp
        </a>
        <button class="action-btn outline" :class="{ active: isFollowing }" @click="isFollowing = !isFollowing">
          {{ isFollowing ? '✓ Abonné' : "+ S'abonner" }}
        </button>
        <button class="action-btn outline bell-btn" :class="{ active: alertsEnabled }" :disabled="alertsLoading" @click="handleAlertsToggle">
          <Icon name="bell" />
          {{ alertsEnabled ? 'Alertes activées' : 'Alertes nouveautés' }}
        </button>
      </div>

      <div class="stat-cards">
        <div class="stat-card">
          <p class="value">{{ activeListings.length }}</p>
          <p class="label">Annonces actives</p>
        </div>
        <div class="stat-card">
          <p class="value">{{ seller.responseRate }}%</p>
          <p class="label">Taux de réponse</p>
        </div>
        <div class="stat-card">
          <p class="value">&lt; 1h</p>
          <p class="label">Répond généralement</p>
        </div>
      </div>
    </div>

    <div class="tabs">
      <button :class="{ active: activeTab === 'active' }" @click="activeTab = 'active'">
        En vente ({{ activeListings.length }})
      </button>
      <button :class="{ active: activeTab === 'sold' }" @click="activeTab = 'sold'">
        Vendu ({{ soldListings.length }})
      </button>
      <button :class="{ active: activeTab === 'apropos' }" @click="activeTab = 'apropos'">
        À propos
      </button>
      <button :class="{ active: activeTab === 'avis' }" @click="activeTab = 'avis'">
        Avis ({{ reviewCount }})
      </button>
    </div>

    <section v-if="activeTab === 'active'">
      <div v-if="activeListings.length" class="grid">
        <ListingCard v-for="l in activeListings" :key="l.id" :listing="l" />
      </div>
      <p v-else class="empty">Ce vendeur n'a aucune annonce active pour le moment.</p>
    </section>

    <section v-else-if="activeTab === 'sold'">
      <div v-if="soldListings.length" class="grid">
        <ListingCard v-for="l in soldListings" :key="l.id" :listing="l" />
      </div>
      <p v-else class="empty">Aucune annonce vendue pour le moment.</p>
    </section>

    <section v-else-if="activeTab === 'apropos'" class="about">
      <h3>À propos de {{ seller.name.split(' ')[0] }}</h3>
      <ul class="about-list">
        <li><Icon name="map-pin" /> Basé à {{ seller.city }}</li>
        <li><Icon name="tag" /> Membre depuis {{ formatMemberSince(seller.memberSince) }}</li>
        <li v-if="seller.isVerified"><Icon name="heart-filled" /> Identité vérifiée par Annonces TG</li>
      </ul>
    </section>

    <section v-else class="reviews">
      <div class="review-summary">
        <p class="review-average">{{ reviewAverage || '—' }} <span class="max">/5</span></p>
        <p class="review-count">{{ reviewCount }} avis</p>
      </div>

      <div v-if="loggedIn && !isSelf" class="review-form">
        <p class="form-label">Votre note</p>
        <div class="stars">
          <button
            v-for="n in 5" :key="n" type="button"
            class="star" :class="{ filled: n <= myRating }"
            @click="myRating = n" :aria-label="`${n} étoiles`"
          >★</button>
        </div>
        <textarea v-model="myComment" rows="2" placeholder="Votre commentaire (optionnel)" />
        <button class="btn-primary" :disabled="submittingReview" @click="handleSubmitReview">
          {{ submittingReview ? 'Envoi...' : 'Publier mon avis' }}
        </button>
        <p v-if="reviewMsg" class="review-msg">{{ reviewMsg }}</p>
      </div>
      <p v-else-if="!loggedIn" class="empty">
        <button class="btn-primary" @click="openAuthModal">Se connecter pour laisser un avis</button>
      </p>

      <div v-if="reviews.length" class="review-list">
        <div v-for="r in reviews" :key="r.id" class="review-item">
          <div class="review-item-head">
            <span class="review-author">{{ r.authorName }}</span>
            <span class="review-stars">{{ '★'.repeat(r.rating) }}{{ '☆'.repeat(5 - r.rating) }}</span>
          </div>
          <p v-if="r.comment" class="review-comment">{{ r.comment }}</p>
        </div>
      </div>
      <p v-else class="empty">Aucun avis pour l'instant.</p>
    </section>
  </main>
</template>

<style scoped>
.container { max-width: 700px; }

.profile-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius) + 4px);
  padding: var(--space-lg);
  text-align: center;
  margin-bottom: var(--space-lg);
}

.avatar {
  position: relative;
  width: 76px; height: 76px; border-radius: 50%;
  margin: 0 auto var(--space-sm);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-ink));
  color: #fff; font-weight: 700; font-size: var(--step-1);
  display: flex; align-items: center; justify-content: center;
}
.verified-dot {
  position: absolute; bottom: -2px; right: -2px;
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--color-accent); color: var(--color-accent-ink);
  display: flex; align-items: center; justify-content: center;
  border: 2px solid var(--color-surface);
}
.verified-dot svg { width: 11px; height: 11px; }

.profile-card h1 { font-size: var(--step-2); margin-bottom: var(--space-xs); }
.verified-badge {
  display: inline-flex; align-items: center; gap: 4px;
  background: rgb(11 110 79 / 0.1); color: var(--color-primary-ink);
  font-size: var(--step--1); font-weight: 600; padding: 3px 10px; border-radius: 999px;
  margin-bottom: var(--space-sm);
}
.verified-badge svg { width: 12px; height: 12px; }

.meta {
  display: flex; align-items: center; justify-content: center; gap: 4px;
  color: var(--color-ink-soft); font-size: var(--step--1); margin: 0 0 var(--space-md);
}
.meta svg { width: 14px; height: 14px; }
.dot { margin: 0 2px; }

.actions {
  display: flex; flex-wrap: wrap; gap: var(--space-sm); justify-content: center;
  margin-bottom: var(--space-lg);
}
.action-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  min-width: 140px; padding: var(--space-xs) var(--space-md);
  border-radius: 13px; font-size: var(--step--1); font-weight: 500;
  text-decoration: none; border: 1px solid transparent;
  transition: transform 0.15s var(--ease), border-color 0.15s var(--ease), background 0.15s var(--ease), color 0.15s var(--ease);
}
.action-btn svg { width: 14px; height: 14px; }
.action-btn.primary { background: var(--color-primary); color: #fff; }
.action-btn.primary:hover { background: var(--color-primary-ink); transform: translateY(-1px); }
.action-btn.whatsapp { background: #25d366; color: #fff; }
.action-btn.whatsapp:hover { transform: translateY(-1px); }
.action-btn.outline { background: #f1f1f1; color: var(--color-ink); border-color: transparent; }
.action-btn.outline:hover { background: #e8e8e8; }
.action-btn.outline.active { background: rgb(11 110 79 / 0.1); color: var(--color-primary-ink); }
.bell-btn.active svg { color: var(--color-accent-ink); }

.stat-cards {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-sm);
  padding-top: var(--space-md); border-top: 1px solid var(--color-border);
}
.stat-card .value { font-size: var(--step-1); font-weight: 700; margin: 0; color: var(--color-primary-ink); }
.stat-card .label { font-size: var(--step--1); color: var(--color-ink-soft); margin: 2px 0 0; }

.tabs { display: flex; gap: var(--space-sm); flex-wrap: wrap; margin-bottom: var(--space-md); }
.tabs button {
  padding: var(--space-xs) var(--space-md); border-radius: 13px;
  background: #f1f1f1; color: var(--color-ink); border: 1px solid transparent;
  font-size: var(--step--1); font-weight: 500; white-space: nowrap;
  transition: background 0.15s var(--ease), color 0.15s var(--ease);
}
.tabs button:hover { background: #e8e8e8; }
.tabs button.active {
  background: rgb(11 110 79 / 0.1); color: var(--color-primary-ink); font-weight: 600;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(clamp(140px, 22vw, 200px), 1fr));
  gap: var(--space-sm);
}
.empty { color: var(--color-ink-soft); }

.about { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius); padding: var(--space-md); }
.about h3 { margin-bottom: var(--space-sm); }
.about-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--space-xs); }
.about-list li { display: flex; align-items: center; gap: var(--space-xs); font-size: var(--step--1); color: var(--color-ink-soft); }
.about-list svg { width: 15px; height: 15px; color: var(--color-primary-ink); flex-shrink: 0; }

.reviews { text-align: left; }
.review-summary { text-align: center; margin-bottom: var(--space-md); }
.review-average { font-size: var(--step-3); font-weight: 700; color: var(--color-primary-ink); margin: 0; }
.review-average .max { font-size: var(--step-0); color: var(--color-ink-soft); font-weight: 400; }
.review-count { font-size: var(--step--1); color: var(--color-ink-soft); margin: 0; }

.review-form {
  border: 1px solid var(--color-border); border-radius: var(--radius); padding: var(--space-md);
  margin-bottom: var(--space-md); display: flex; flex-direction: column; gap: var(--space-sm);
}
.form-label { font-size: var(--step--1); font-weight: 600; margin: 0; }
.stars { display: flex; gap: 4px; }
.star { font-size: 24px; color: var(--color-border-strong); background: none; border: none; line-height: 1; }
.star.filled { color: var(--color-accent); }
.review-form textarea {
  border: 1px solid var(--color-border); border-radius: 13px; padding: var(--space-sm);
  font-family: inherit; font-size: var(--step--1); resize: vertical;
}
.review-msg { font-size: var(--step--1); color: var(--color-primary-ink); margin: 0; }

.review-list { display: flex; flex-direction: column; gap: var(--space-sm); }
.review-item { border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-sm); }
.review-item-head { display: flex; justify-content: space-between; margin-bottom: 4px; }
.review-author { font-weight: 600; font-size: var(--step--1); }
.review-stars { color: var(--color-accent); font-size: var(--step--1); }
.review-comment { font-size: var(--step--1); color: var(--color-ink-soft); margin: 0; }

@media (max-width: 480px) {
  .action-btn { min-width: 0; flex: 1 1 45%; }
}

.skeleton-avatar {
  width: 76px; height: 76px; border-radius: 50%; margin: 0 auto var(--space-sm);
}
.skeleton-line { height: 12px; border-radius: 4px; }
.w-50 { width: 50%; }
.w-30 { width: 30%; }
.shimmer {
  background: linear-gradient(90deg, #eeece4 25%, #f5f3ec 37%, #eeece4 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}
@media (prefers-reduced-motion: reduce) {
  .shimmer { animation: none; }
}
</style>
