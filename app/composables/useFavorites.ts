const favorites = ref<string[]>([])
let loaded = false

function load() {
    if (import.meta.client && !loaded) {
        try {
            const stored = localStorage.getItem('favoris')
            favorites.value = stored ? JSON.parse(stored) : []
        } catch {
            favorites.value = []
        }
        loaded = true
    }
}

function persist() {
    if (import.meta.client) {
        localStorage.setItem('favoris', JSON.stringify(favorites.value))
    }
}

export function useFavorites() {
    load()

    function isFavorite(id: string) {
        return favorites.value.includes(id)
    }

    function toggleFavorite(id: string) {
        favorites.value = isFavorite(id)
            ? favorites.value.filter(f => f !== id)
            : [...favorites.value, id]
        persist()
    }

    return { favorites, isFavorite, toggleFavorite }
}
