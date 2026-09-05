<script setup lang="ts">
const props = defineProps<{
  categories: { slug: string; name: string }[]
  cities: string[]
}>()

const emit = defineEmits<{ filter: [Record<string, string>] }>()

const q = ref('')
const category = ref('')
const city = ref('')

function apply() {
  const filters: Record<string, string> = {}
  if (q.value) filters.q = q.value
  if (category.value) filters.category = category.value
  if (city.value) filters.city = city.value
  emit('filter', filters)
}
</script>

<template>
  <div class="filter-bar">
    <input v-model="q" type="text" placeholder="Rechercher une annonce..." @keyup.enter="apply" />
    <select v-model="category" @change="apply">
      <option value="">Toutes les catégories</option>
      <option v-for="c in props.categories" :key="c.slug" :value="c.slug">{{ c.name }}</option>
    </select>
    <select v-model="city" @change="apply">
      <option value="">Toutes les villes</option>
      <option v-for="v in props.cities" :key="v" :value="v">{{ v }}</option>
    </select>
    <button @click="apply">Filtrer</button>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
  margin-bottom: var(--space-md);
}
.filter-bar input {
  flex: 1;
  min-width: 200px;
}
.filter-bar select {
  min-width: 160px;
}
.filter-bar button {
  padding: var(--space-xs) var(--space-md);
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: #fff;
  font-weight: 500;
  transition: background 0.15s var(--ease), transform 0.15s var(--ease);
}
.filter-bar button:hover { background: var(--color-primary-ink); transform: translateY(-1px); }
</style>
