<template>
  <div class="skeleton-card" aria-hidden="true">
    <div class="skeleton-thumb shimmer" />
    <div class="skeleton-info">
      <div class="skeleton-line shimmer w-60" />
      <div class="skeleton-line shimmer w-90" />
      <div class="skeleton-line shimmer w-40" />
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
}
.skeleton-thumb { aspect-ratio: 1 / 1; }
.skeleton-info { padding: var(--space-sm); display: flex; flex-direction: column; gap: var(--space-xs); }
.skeleton-line { height: 10px; border-radius: 4px; }
.w-40 { width: 40%; }
.w-60 { width: 60%; }
.w-90 { width: 90%; }

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
