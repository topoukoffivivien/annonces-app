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
    <button class="btn-icon" :disabled="currentPage === 1" @click="go(currentPage - 1)"><Icon name="chevron-left" /></button>
    <button v-for="p in pages" :key="p" :class="{ active: p === currentPage }" @click="go(p)">{{ p }}</button>
    <button class="btn-icon" :disabled="currentPage === totalPages" @click="go(currentPage + 1)"><Icon name="chevron-right" /></button>
  </nav>
</template>

<style scoped>
.pagination { display: flex; justify-content: center; align-items: center; gap: var(--space-xs); margin-top: var(--space-lg); flex-wrap: wrap; }
.pagination button:not(.btn-icon) {
  min-width: 36px; height: 32px; padding: 0 var(--space-sm); border: 1px solid var(--color-border);
  border-radius: var(--radius-sm); background: var(--color-surface); font-size: var(--step--1);
  transition: border-color 0.15s var(--ease), background 0.15s var(--ease);
}
.pagination button:not(.btn-icon):hover:not(:disabled) { border-color: var(--color-border-strong); }
.pagination button.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
</style>