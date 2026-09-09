import { defineStore } from 'pinia'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    ids: [] as string[],
    loaded: false
  }),
  getters: {
    count: (state) => state.ids.length,
    isFavorite: (state) => (id: string) => state.ids.includes(id)
  },
  actions: {
    // Appelé au chargement et à chaque changement d'état de connexion
    async loadForCurrentUser() {
      this.loaded = false
      const { loggedIn, user } = useUserSession()
      if (!loggedIn.value || !user.value?.id) {
        this.ids = []
        this.loaded = true
        return
      }
      try {
        const res = await $fetch<{ ids: string[] }>(`/api/favorites/${user.value.id}`)
        this.ids = res.ids
      } catch {
        this.ids = []
      } finally {
        this.loaded = true
      }
    },

    async toggle(id: string) {
      const { loggedIn, user } = useUserSession()

      // Mise à jour optimiste : l'UI réagit immédiatement
      const i = this.ids.indexOf(id)
      if (i === -1) this.ids.push(id)
      else this.ids.splice(i, 1)

      if (!loggedIn.value || !user.value?.id) return // visiteur anonyme : local uniquement

      try {
        const res = await $fetch<{ ids: string[] }>('/api/favorites/toggle', {
          method: 'POST',
          body: { userId: user.value.id, listingId: id }
        })
        this.ids = res.ids
      } catch {
        // échec réseau : on annule la mise à jour optimiste
        const j = this.ids.indexOf(id)
        if (j === -1) this.ids.push(id)
        else this.ids.splice(j, 1)
      }
    }
  }
})
