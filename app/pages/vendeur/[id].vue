<script setup lang="ts">
const route = useRoute()
const { fetchSeller } = useSellers()

const { data } = await useAsyncData(`seller-${route.params.id}`, () =>
  fetchSeller(route.params.id as string)
)

const seller = computed(() => data.value?.seller)
const listings = computed(() => data.value?.listings || [])
const activeListings = computed(() => listings.value.filter(l => !l.isSold))
const soldListings = computed(() => listings.value.filter(l => l.isSold))

useHead({
  title: seller.value ? `${seller.value.name} — Vendeur` : 'Profil vendeur'
})

function formatMemberSince(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

const isFollowing = ref(false)
const alertsEnabled = ref(false)
const activeTab = ref<'active' | 'sold' | 'apropos'>('active')
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
        <button class="action-btn outline bell-btn" :class="{ active: alertsEnabled }" @click="alertsEnabled = !alertsEnabled">
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

    <section v-else class="about">
      <h3>À propos de {{ seller.name.split(' ')[0] }}</h3>
      <ul class="about-list">
        <li><Icon name="map-pin" /> Basé à {{ seller.city }}</li>
        <li><Icon name="tag" /> Membre depuis {{ formatMemberSince(seller.memberSince) }}</li>
        <li v-if="seller.isVerified"><Icon name="heart-filled" /> Identité vérifiée par Annonces TG</li>
      </ul>
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

@media (max-width: 480px) {
  .action-btn { min-width: 0; flex: 1 1 45%; }
}
</style>