<script setup lang="ts">
const { createListing } = useListings()

const form = reactive({
  title: '',
  description: '',
  price: 0,
  categorySlug: 'vehicules',
  city: 'Lomé'
})

const message = ref('')
const success = ref(false)

async function submit() {
  try {
    const res = await createListing({ ...form, userId: 'demo-user' })
    message.value = res.message
    success.value = res.listing.status === 'published'
  } catch (e: any) {
    message.value = e?.data?.statusMessage || 'Erreur lors de la publication'
    success.value = false
  }
}
</script>

<template>
  <main class="container">
    <h1>Publier une annonce</h1>
    <form @submit.prevent="submit">
      <label>Titre<input v-model="form.title" required /></label>
      <label>Description<textarea v-model="form.description" rows="4" /></label>
      <label>Prix (CFA)<input v-model.number="form.price" type="number" required /></label>
      <label>Catégorie
        <select v-model="form.categorySlug">
          <option value="vehicules">Véhicules</option>
          <option value="immobilier">Immobilier</option>
          <option value="electronique">Électronique</option>
          <option value="mode-et-beaute">Mode & Beauté</option>
          <option value="emplois">Emplois</option>
        </select>
      </label>
      <label>Ville
        <select v-model="form.city">
          <option>Lomé</option>
          <option>Kara</option>
          <option>Sokodé</option>
          <option>Kpalimé</option>
          <option>Atakpamé</option>
          <option>Tsévié</option>
        </select>
      </label>
      <button type="submit">Publier</button>
    </form>
    <p v-if="message" :class="success ? 'ok' : 'err'">{{ message }}</p>
  </main>
</template>

<style scoped>
.container { max-width: 500px; }
form { display: flex; flex-direction: column; gap: var(--space-sm); }
label { display: flex; flex-direction: column; gap: var(--space-xs); font-size: var(--step--1); }
button[type="submit"] {
  padding: var(--space-sm);
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 500;
  transition: background 0.15s var(--ease), transform 0.15s var(--ease);
}
button[type="submit"]:hover { background: var(--color-primary-ink); transform: translateY(-1px); }
.ok { color: var(--color-primary-ink); }
.err { color: var(--color-danger); }
</style>
