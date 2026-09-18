<script setup lang="ts">
const { loggedIn, user } = useUserSession()
const { open: openAuthModal } = useAuthModal()
const { fetchRejectedListings, approveListing, deleteListingAdmin, fetchReports, resolveReport } = useAdmin()

if (!loggedIn.value && import.meta.client) openAuthModal()

const activeTab = ref<'rejected' | 'reports'>('rejected')
const rejected = ref<any[]>([])
const reports = ref<any[]>([])
const loading = ref(true)
const forbidden = ref(false)

async function loadAll() {
  loading.value = true
  try {
    const [r1, r2] = await Promise.all([fetchRejectedListings(), fetchReports()])
    rejected.value = r1.rejected
    reports.value = r2.reports
  } catch (e: any) {
    if (e?.response?.status === 403 || e?.statusCode === 403) forbidden.value = true
  } finally {
    loading.value = false
  }
}
if (loggedIn.value) loadAll()

async function handleApprove(id: string) {
  await approveListing(id)
  rejected.value = rejected.value.filter(l => l.id !== id)
}
async function handleDelete(id: string) {
  if (!confirm('Supprimer définitivement cette annonce ?')) return
  await deleteListingAdmin(id)
  rejected.value = rejected.value.filter(l => l.id !== id)
}
async function handleResolve(id: string) {
  await resolveReport(id)
  reports.value = reports.value.filter(r => r.id !== id)
}

function formatPrice(p: number) {
  return new Intl.NumberFormat('fr-FR').format(p) + ' CFA'
}
</script>

<template>
  <main class="container" v-if="forbidden">
    <p>Cette page est réservée aux administrateurs.</p>
    <NuxtLink to="/" class="btn-primary">Retour à l'accueil</NuxtLink>
  </main>

  <main class="container" v-else-if="loggedIn">
    <h1>Modération</h1>

    <div class="tabs">
      <button :class="{ active: activeTab === 'rejected' }" @click="activeTab = 'rejected'">
        Annonces rejetées ({{ rejected.length }})
      </button>
      <button :class="{ active: activeTab === 'reports' }" @click="activeTab = 'reports'">
        Signalements ({{ reports.length }})
      </button>
    </div>

    <div v-if="loading" class="empty">Chargement...</div>

    <section v-else-if="activeTab === 'rejected'">
      <p v-if="!rejected.length" class="empty">Aucune annonce rejetée en attente de relecture.</p>
      <div v-for="l in rejected" :key="l.id" class="mod-card">
        <div>
          <p class="mod-title"><NuxtLink :to="`/annonce/${l.id}`">{{ l.title }}</NuxtLink></p>
          <p class="mod-meta">{{ formatPrice(l.price) }} · {{ l.city }}</p>
          <p class="mod-desc">{{ l.description || 'Sans description' }}</p>
        </div>
        <div class="mod-actions">
          <button class="btn-primary" @click="handleApprove(l.id)">Approuver</button>
          <button class="danger-btn" @click="handleDelete(l.id)">Supprimer</button>
        </div>
      </div>
    </section>

    <section v-else>
      <p v-if="!reports.length" class="empty">Aucun signalement ouvert.</p>
      <div v-for="r in reports" :key="r.id" class="mod-card">
        <div>
          <p class="mod-title">
            <NuxtLink v-if="r.listing" :to="`/annonce/${r.listingId}`">{{ r.listing.title }}</NuxtLink>
            <span v-else>Annonce supprimée</span>
          </p>
          <p class="mod-meta">Signalé le {{ new Date(r.createdAt).toLocaleDateString('fr-FR') }}</p>
          <p class="mod-desc">Motif : {{ r.reason }}</p>
        </div>
        <div class="mod-actions">
          <button class="btn-primary" @click="handleResolve(r.id)">Marquer résolu</button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.container { max-width: 800px; }
.tabs { display: flex; gap: var(--space-sm); margin-bottom: var(--space-md); }
.tabs button {
  padding: var(--space-xs) var(--space-md); border-radius: 13px; background: #f1f1f1;
  color: var(--color-ink); border: none; font-size: var(--step--1); font-weight: 500;
}
.tabs button.active { background: rgb(11 110 79 / 0.1); color: var(--color-primary-ink); font-weight: 600; }

.empty { color: var(--color-ink-soft); }

.mod-card {
  display: flex; justify-content: space-between; gap: var(--space-md);
  border: 1px solid var(--color-border); border-radius: var(--radius); padding: var(--space-md);
  margin-bottom: var(--space-sm);
}
.mod-title { font-weight: 600; margin: 0 0 4px; }
.mod-meta { font-size: var(--step--1); color: var(--color-ink-soft); margin: 0 0 4px; }
.mod-desc { font-size: var(--step--1); margin: 0; }
.mod-actions { display: flex; flex-direction: column; gap: var(--space-xs); flex-shrink: 0; }
.danger-btn {
  padding: var(--space-xs) var(--space-sm); border-radius: 13px; background: rgb(179 64 42 / 0.1);
  color: var(--color-danger); border: none; font-size: var(--step--1); font-weight: 500;
}
</style>
