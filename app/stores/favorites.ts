import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    ids: [] as string[]
  }),
  getters: {
    count: (state) => state.ids.length,
    isFavorite: (state) => (id: string) => state.ids.includes(id)
  },
  actions: {
    toggle(id: string) {
      const i = this.ids.indexOf(id)
      if (i === -1) this.ids.push(id)
      else this.ids.splice(i, 1)
    }
  }
})