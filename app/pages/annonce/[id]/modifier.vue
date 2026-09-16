<script setup lang="ts">
import type { Listing } from '~/composables/useListings'

const route = useRoute()
const { fetchListing } = useListings()
const { updateListing } = useAccount()
const { categories, cities } = useCategories()
const { loggedIn, user } = useUserSession()

const MAX_IMAGES = 6

const { data: listing } = await useAsyncData<Listing>(`edit-${route.params.id}`, () =>
  fetchListing(route.params.id as string)
)

const isOwner = computed(() => loggedIn.value && user.value?.id === listing.value?.userId)

const form = reactive({
  title: '',
  description: '',
  price: 0,
  categorySlug: 'vehicules',
  city: 'Lomé',
  images: [] as string[]
})

watch(listing, (l) => {
  if (l) {
    form.title = l.title
    form.description = l.description
    form.price = l.price
    form.categorySlug = l.categorySlug
    form.city = l.city
    form.images = [...l.images]
  }
}, { immediate: true })

const message = ref('')
const success = ref(false)
const submitting = ref(false)

function onFilesSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  const remaining = MAX_IMAGES - form.images.length

  files.slice(0, remaining).forEach(file => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') form.images.push(reader.result)
    }
    reader.readAsDataURL(file)
  })
  input.value = ''
}
function removeImage(i: number) {
  form.images.splice(i, 1)
}

async function submit() {
  if (!listing.value) return
  submitting.value = true
  message.value = ''
  try {
    await updateListing(listing.value.id, { ...form })
    success.value = true
    message.value = 'Annonce mise à jour.'
  } catch (e: any) {
    success.value = false
    message.value = e?.data?.statusMessage || 'Erreur lors de la mise à jour'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="page">
    <div v-if="!listing" class="card"><p>Annonce introuvable.</p></div>

    <div v-else-if="!isOwner" class="card">
      <h1>Accès refusé</h1>
      <p class="subtitle">Cette annonce ne vous appartient pas.</p>
    </div>

    <div v-else class="card">
      <div class="badge"><Icon name="tag" /></div>
      <h1>Modifier l'annonce</h1>

      <form @submit.prevent="submit">
        <label class="field"><input v-model="form.title" type="text" placeholder="Titre de l'annonce" required /></label>
        <label class="field textarea-field"><textarea v-model="form.description" rows="4" placeholder="Description" /></label>
        <label class="field"><span class="prefix">CFA</span><input v-model.number="form.price" type="number" min="0" required /></label>

        <div class="row">
          <label class="field">
            <Icon name="tag" />
            <select v-model="form.categorySlug">
              <option v-for="c in categories" :key="c.slug" :value="c.slug">{{ c.name }}</option>
            </select>
          </label>
          <label class="field">
            <Icon name="map-pin" />
            <select v-model="form.city">
              <option v-for="v in cities" :key="v" :value="v">{{ v }}</option>
            </select>
          </label>
        </div>

        <div class="upload-zone">
          <label class="upload-trigger">
            <Icon name="image" />
            <span>Photos ({{ form.images.length }}/{{ MAX_IMAGES }})</span>
            <input type="file" accept="image/*" multiple :disabled="form.images.length >= MAX_IMAGES" @change="onFilesSelected" hidden />
          </label>
          <div v-if="form.images.length" class="thumbs">
            <div v-for="(img, i) in form.images" :key="i" class="thumb">
              <img :src="img" alt="" />
              <button type="button" class="btn-icon remove" @click="removeImage(i)" aria-label="Retirer"><Icon name="x" /></button>
            </div>
          </div>
        </div>

        <button type="submit" class="btn-primary submit" :disabled="submitting">
          {{ submitting ? 'Enregistrement...' : 'Enregistrer les modifications' }}
        </button>
      </form>

      <p v-if="message" class="alert" :class="success ? 'ok' : 'err'">{{ message }}</p>
    </div>
  </main>
</template>

<style scoped>
.page { display: flex; justify-content: center; padding: var(--space-xl) var(--space-md); }
.card {
  width: 100%; max-width: 480px; background: var(--color-surface);
  border: 1px solid var(--color-border); border-radius: calc(var(--radius) + 4px); padding: var(--space-lg);
}
.badge {
  width: 44px; height: 44px; border-radius: 12px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-ink));
  color: #fff; display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-sm);
}
.badge svg { width: 20px; height: 20px; }
.subtitle { color: var(--color-ink-soft); }
form { display: flex; flex-direction: column; gap: var(--space-sm); }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm); }
.field {
  display: flex; align-items: center; gap: var(--space-xs);
  border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 var(--space-sm);
}
.field svg { width: 16px; height: 16px; color: var(--color-ink-soft); flex-shrink: 0; }
.field input, .field select, .field textarea { flex: 1; border: none; padding: var(--space-sm) 0; background: none; }
.field .prefix { font-size: var(--step--1); color: var(--color-ink-soft); font-weight: 600; }
.textarea-field { align-items: flex-start; padding-block: var(--space-xs); }
.textarea-field textarea { resize: vertical; font-family: inherit; }
.upload-zone { border: 1px dashed var(--color-border-strong); border-radius: var(--radius); padding: var(--space-sm); }
.upload-trigger { display: flex; align-items: center; justify-content: center; gap: var(--space-xs); padding: var(--space-sm); cursor: pointer; color: var(--color-ink-soft); font-size: var(--step--1); }
.thumbs { display: grid; grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); gap: var(--space-xs); margin-top: var(--space-sm); }
.thumb { position: relative; aspect-ratio: 1; border-radius: var(--radius-sm); overflow: hidden; }
.thumb img { width: 100%; height: 100%; object-fit: cover; }
.thumb .remove { position: absolute; top: 4px; right: 4px; width: 22px; height: 22px; background: rgb(0 0 0 / 0.55); border-color: transparent; color: #fff; }
.submit { margin-top: var(--space-xs); }
.alert { margin-top: var(--space-md); padding: var(--space-sm); border-radius: var(--radius-sm); font-size: var(--step--1); }
.alert.ok { background: rgb(11 110 79 / 0.1); color: var(--color-primary-ink); }
.alert.err { background: rgb(179 64 42 / 0.1); color: var(--color-danger); }
</style>
