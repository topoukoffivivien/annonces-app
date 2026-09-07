<script setup lang="ts">
const props = defineProps<{ name: string }>()

const paths: Record<string, string> = {
  heart: 'M12 21s-6.5-4.6-9.3-8.4C.8 9.8 1.4 6 4.6 4.6c2-.9 4.1-.3 5.4 1.3l2 2.3 2-2.3c1.3-1.6 3.4-2.2 5.4-1.3 3.2 1.4 3.8 5.2 1.9 8-2.8 3.8-9.3 8.4-9.3 8.4z',
  'heart-filled': 'M12 21s-6.5-4.6-9.3-8.4C.8 9.8 1.4 6 4.6 4.6c2-.9 4.1-.3 5.4 1.3l2 2.3 2-2.3c1.3-1.6 3.4-2.2 5.4-1.3 3.2 1.4 3.8 5.2 1.9 8-2.8 3.8-9.3 8.4-9.3 8.4z',
  menu: 'M3 6h18M3 12h18M3 18h18',
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-right': 'M9 18l6-6-6-6',
  car: 'M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM3 17V11l2-5h12l3 5v6M3 11h16',
  home: 'M3 11l9-7 9 7M5 10v10h14V10',
  smartphone: 'M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM11 19h2',
  shirt: 'M8 3l4 2 4-2 4 4-3 3v11H7V10L4 7z',
  briefcase: 'M4 8h16v11H4zM9 8V5h6v3M4 13h16',
  mail: 'M3 5h18v14H3zM3 5l9 7 9-7',
  lock: 'M6 11V8a6 6 0 0 1 12 0v3M5 11h14v10H5zM12 15v3',
  x: 'M18 6L6 18M6 6l12 12',
  tag: 'M20.59 13.41L11 3.83V3H4v7h.83L14.41 20.59a2 2 0 0 0 2.82 0l3.36-3.36a2 2 0 0 0 0-2.82zM7 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z',
  'map-pin': 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  image: 'M3 5h18v14H3zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5-4 4-2-2-4 4',
  bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 0 1-3.46 0'
}

const isFilled = computed(() => props.name === 'heart-filled')
const basePath = computed(() => paths[props.name] || paths[props.name.replace('-filled', '')] || '')
</script>

<template>
  <svg viewBox="0 0 24 24" :fill="isFilled ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path :d="basePath" />
  </svg>
</template>
