<script setup lang="ts">
import type { Listing } from '~/composables/useListings'

definePageMeta({ middleware: [] })

const { loggedIn, user, fetch: refreshSession } = useUserSession()
const { updateProfile, fetchMyListings, deleteListing } = useAccount()
const { cities } = useCategories()
const { open: openAuthModal } = useAuthModal()

if (!loggedIn.value && import.meta.client) {
  openAuthModal()
}

const form = reactive({ name: '', city: 'Lomé', phone: '', avatarUrl: '' })
const savingProfile = ref(false)
const profileMsg = ref('')

watch(user, (u) => {
  if (u) {
    form.name = u.name || ''
    form.avatarUrl = u.avatarUrl || ''
  }
}, { immediate: true })

// Récupère aussi ville/téléphone (absents de la session, propres au profil vendeur complet)
const { data: fullProfile } = await useAsyncData('my-full-profile', async () => {
  if (!user.value?.id) return null
  return await $fetch<{ seller: any }>(`/api/sellers/${user.value.id}`)
})
watch(fullProfile, (p) => {
  if (p?.seller) {
    form.city = p.seller.city || 'Lomé'
    form.phone = p.seller.phone || ''
  }
}, { immediate: true })

function onAvatarSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string') form.avatarUrl = reader.result
  }
  reader.readAsDataURL(file)
}

async function saveProfile() {
  savingProfile.value = true
  profileMsg.value = ''
  try {
    await updateProfile({ name: form.name, city: form.city, phone: form.phone, avatarUrl: form.avatarUrl })
    await refreshSession()
    profileMsg.value = 'Profil mis à jour.'
  } catch (e: any) {
    profileMsg.value = e?.data?.statusMessage || 'Erreur lors de la mise à jour'
  } finally {
    savingProfile.value = false
  }
}

// Mes annonces
const myListings = ref<Listing[]>([])
const loadingListings = ref(true)

async function loadMyListings() {
  loadingListings.value = true
  try {
    const res = await fetchMyListings()
    myListings.value = res.listings
  } catch { /* silencieux */ }
  finally {
    loadingListings.value = false
  }
}
if (loggedIn.value) loadMyListings()

async function removeListing(id: string) {
  if (!confirm('Supprimer définitivement cette annonce ?')) return
  try {
    await deleteListing(id)
    myListings.value = myListings.value.filter(l => l.id !== id)
  } catch { /* silencieux */ }
}

function statusLabel(l: Listing) {
  if (l.isSold) return 'Vendue'
  if (l.status === 'pending') return 'En attente'
  if (l.status === 'rejected') return 'Rejetée'
  return 'En ligne'
}
function formatPrice(p: number) {
  return new Intl.NumberFormat('fr-FR').format(p) + ' CFA'
}
</script>

<template>
  <main class="container" v-if="loggedIn">
    <h1>Mon compte</h1>

    <section class="card">
      <h2>Informations du profil</h2>
      <div class="avatar-row">
        <img v-if="form.avatarUrl" :src="form.avatarUrl" alt="" class="avatar-preview" />
        <span v-else class="avatar-fallback">{{ form.name?.[0] || '?' }}</span>
        <label class="upload-btn">
          Changer la photo
          <input type="file" accept="image/*" hidden @change="onAvatarSelected" />
        </label>
      </div>

      <form @submit.prevent="saveProfile">
        <label class="field"><Icon name="tag" /><input v-model="form.name" type="text" placeholder="Nom complet" required /></label>
        <label class="field">
          <Icon name="map-pin" />
          <select v-model="form.city">
            <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
          </select>
        </label>
        <label class="field"><Icon name="mail" /><input v-model="form.phone" type="tel" placeholder="Téléphone (ex: +228 90 00 00 00)" /></label>
        <button type="submit" class="btn-primary" :disabled="savingProfile">
          {{ savingProfile ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
      </form>
      <p v-if="profileMsg" class="msg">{{ profileMsg }}</p>
    </section>

    <section class="card">
      <h2>Mes annonces</h2>

      <div v-if="loadingListings" class="empty">Chargement...</div>
      <div v-else-if="!myListings.length" class="empty">
        Vous n'avez publié aucune annonce pour l'instant.
        <NuxtLink to="/publier" class="btn-primary" style="margin-top: var(--space-sm);">Publier une annonce</NuxtLink>
      </div>

      <table v-else class="listings-table">
        <thead>
          <tr><th>Annonce</th><th>Prix</th><th>Statut</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="l in myListings" :key="l.id">
            <td><NuxtLink :to="`/annonce/${l.id}`">{{ l.title }}</NuxtLink></td>
            <td>{{ formatPrice(l.price) }}</td>
            <td><span class="status" :class="{ sold: l.isSold, rejected: l.status === 'rejected' }">{{ statusLabel(l) }}</span></td>
            <td class="row-actions">
              <NuxtLink :to="`/annonce/${l.id}/modifier`" class="btn-icon" aria-label="Modifier"><Icon name="tag" /></NuxtLink>
              <button class="btn-icon" aria-label="Supprimer" @click="removeListing(l.id)"><Icon name="x" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

<style scoped>
.container { max-width: 700px; }
.card {
  background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius);
  padding: var(--space-md); margin-bottom: var(--space-lg);
}
.card h2 { font-size: var(--step-1); margin-bottom: var(--space-sm); }

.avatar-row { display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-md); }
.avatar-preview, .avatar-fallback {
  width: 56px; height: 56px; border-radius: 50%; object-fit: cover;
  background: var(--color-primary); color: #fff; font-weight: 700; font-size: var(--step-0);
  display: flex; align-items: center; justify-content: center;
}
.upload-btn {
  font-size: var(--step--1); font-weight: 500; color: var(--color-primary-ink);
  border: 1px solid var(--color-border); border-radius: 13px; padding: var(--space-xs) var(--space-sm);
  cursor: pointer;
}

form { display: flex; flex-direction: column; gap: var(--space-sm); }
.field {
  display: flex; align-items: center; gap: var(--space-xs);
  border: 1px solid var(--color-border); border-radius: 13px; padding: 0 var(--space-sm);
}
.field:focus-within { border-color: var(--color-primary); }
.field svg { width: 16px; height: 16px; color: var(--color-ink-soft); flex-shrink: 0; }
.field input, .field select { flex: 1; border: none; padding: var(--space-sm) 0; background: none; }
.field input:focus, .field select:focus { outline: none; }
.msg { font-size: var(--step--1); color: var(--color-primary-ink); margin-top: var(--space-sm); }

.empty { color: var(--color-ink-soft); font-size: var(--step--1); display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-xs); }

.listings-table { width: 100%; border-collapse: collapse; font-size: var(--step--1); }
.listings-table th { text-align: left; padding: var(--space-xs); color: var(--color-ink-soft); border-bottom: 1px solid var(--color-border); }
.listings-table td { padding: var(--space-xs); border-bottom: 1px solid var(--color-border); }
.status { padding: 2px 8px; border-radius: 999px; background: rgb(11 110 79 / 0.1); color: var(--color-primary-ink); font-size: 11px; font-weight: 600; }
.status.sold { background: rgb(31 36 32 / 0.1); color: var(--color-ink-soft); }
.status.rejected { background: rgb(179 64 42 / 0.1); color: var(--color-danger); }
.row-actions { display: flex; gap: 4px; }
</style>
