<script setup lang="ts">
const { createListing } = useListings()
const { categories, cities } = useCategories()

const MAX_IMAGES = 6

const form = reactive({
  title: '',
  description: '',
  price: 0,
  categorySlug: 'vehicules',
  city: 'Lomé',
  images: [] as string[]
})

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
  submitting.value = true
  message.value = ''
  try {
    const res = await createListing({ ...form, userId: 'demo-user' })
    message.value = res.message
    success.value = res.listing.status === 'published'
    if (success.value) {
      form.title = ''
      form.description = ''
      form.price = 0
      form.images = []
    }
  } catch (e: any) {
    message.value = e?.data?.statusMessage || 'Erreur lors de la publication'
    success.value = false
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="page">
    <div class="card">
      <div class="badge"><Icon name="tag" /></div>
      <h1>Publier une annonce</h1>
      <p class="subtitle">Décrivez votre article, ajoutez des photos, et publiez en quelques secondes.</p>

      <form @submit.prevent="submit">
        <label class="field">
          <input v-model="form.title" type="text" placeholder="Titre de l'annonce" required />
        </label>

        <label class="field textarea-field">
          <textarea v-model="form.description" rows="4" placeholder="Décrivez l'état, les caractéristiques, les conditions de remise en main propre..." />
        </label>

        <label class="field">
          <span class="prefix">CFA</span>
          <input v-model.number="form.price" type="number" min="0" placeholder="Prix" required />
        </label>

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
            <span>Ajouter des photos ({{ form.images.length }}/{{ MAX_IMAGES }})</span>
            <input type="file" accept="image/*" multiple :disabled="form.images.length >= MAX_IMAGES" @change="onFilesSelected" hidden />
          </label>

          <div v-if="form.images.length" class="thumbs">
            <div v-for="(img, i) in form.images" :key="i" class="thumb">
              <img :src="img" alt="Photo de l'annonce" />
              <button type="button" class="btn-icon remove" @click="removeImage(i)" aria-label="Retirer la photo">
                <Icon name="x" />
              </button>
            </div>
          </div>
        </div>

        <button type="submit" class="btn-primary submit" :disabled="submitting">
          {{ submitting ? 'Publication...' : 'Publier l\'annonce' }}
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
  border: 1px solid var(--color-border); border-radius: calc(var(--radius) + 4px);
  padding: var(--space-lg);
}
.badge {
  width: 44px; height: 44px; border-radius: 12px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-ink));
  color: #fff; display: flex; align-items: center; justify-content: center;
  margin-bottom: var(--space-sm);
}
.badge svg { width: 20px; height: 20px; }
h1 { font-size: var(--step-2); margin-bottom: 4px; }
.subtitle { color: var(--color-ink-soft); font-size: var(--step--1); margin-bottom: var(--space-md); }

form { display: flex; flex-direction: column; gap: var(--space-sm); }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm); }

.field {
  display: flex; align-items: center; gap: var(--space-xs);
  border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 0 var(--space-sm);
  transition: border-color 0.15s var(--ease), box-shadow 0.15s var(--ease);
}
.field:focus-within { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgb(11 110 79 / 0.12); }
.field svg { width: 16px; height: 16px; color: var(--color-ink-soft); flex-shrink: 0; }
.field input, .field select, .field textarea { flex: 1; border: none; padding: var(--space-sm) 0; background: none; }
.field input:focus, .field select:focus, .field textarea:focus { outline: none; box-shadow: none; }
.field .prefix { font-size: var(--step--1); color: var(--color-ink-soft); font-weight: 600; }
.textarea-field { align-items: flex-start; padding-block: var(--space-xs); }
.textarea-field textarea { resize: vertical; font-family: inherit; }

.upload-zone { border: 1px dashed var(--color-border-strong); border-radius: var(--radius); padding: var(--space-sm); }
.upload-trigger {
  display: flex; align-items: center; justify-content: center; gap: var(--space-xs);
  padding: var(--space-sm); cursor: pointer; color: var(--color-ink-soft); font-size: var(--step--1);
  transition: color 0.15s var(--ease);
}
.upload-trigger:hover { color: var(--color-primary-ink); }
.upload-trigger svg { width: 18px; height: 18px; }

.thumbs { display: grid; grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); gap: var(--space-xs); margin-top: var(--space-sm); }
.thumb { position: relative; aspect-ratio: 1; border-radius: var(--radius-sm); overflow: hidden; }
.thumb img { width: 100%; height: 100%; object-fit: cover; }
.thumb .remove {
  position: absolute; top: 4px; right: 4px; width: 22px; height: 22px;
  background: rgb(0 0 0 / 0.55); border-color: transparent; color: #fff;
}
.thumb .remove svg { width: 12px; height: 12px; }

.submit { margin-top: var(--space-xs); }
.submit:disabled { opacity: 0.6; cursor: default; transform: none; }

.alert { margin-top: var(--space-md); padding: var(--space-sm); border-radius: var(--radius-sm); font-size: var(--step--1); }
.alert.ok { background: rgb(11 110 79 / 0.1); color: var(--color-primary-ink); }
.alert.err { background: rgb(179 64 42 / 0.1); color: var(--color-danger); }
</style>