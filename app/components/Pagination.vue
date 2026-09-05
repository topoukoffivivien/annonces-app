<script setup lang="ts">
const props = defineProps<{ currentPage: number; totalPages: number }>()
const emit = defineEmits<{ change: [number] }>()

function go(p: number) {
  if (p < 1 || p > props.totalPages || p === props.currentPage) return
  emit('change', p)
}

const pages = computed(() => {
  const start = Math.max(1, props.currentPage - 2)
  const end = Math.min(props.totalPages, start + 4)
  const arr: number[] = []
  for (let i = start; i <= end; i++) arr.push(i)
  return arr
})
</script>

<template>
  <nav v-if="totalPages > 1" class="pagination" aria-label="Pagination">
    <button :disabled="currentPage === 1" @click="go(currentPage - 1)">‹ Précédent</button>
    <button v-for="p in pages" :key="p" :class="{ active: p === currentPage }" @click="go(p)">{{ p }}</button>
    <button :disabled="currentPage === totalPages" @click="go(currentPage + 1)">Suivant ›</button>
  </nav>
</template>

<style scoped>
.pagination { display: flex; justify-content: center; gap: var(--space-xs); margin-top: var(--space-lg); flex-wrap: wrap; }
.pagination button {
  min-width: 36px; padding: var(--space-xs) var(--space-sm); border: 1px solid var(--color-border);
  border-radius: var(--radius-sm); background: var(--color-surface); font-size: var(--step--1);
  transition: border-color 0.15s var(--ease), background 0.15s var(--ease);
}
.pagination button:hover:not(:disabled) { border-color: var(--color-border-strong); }
.pagination button.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.pagination button:disabled { opacity: 0.4; cursor: default; }
</style>