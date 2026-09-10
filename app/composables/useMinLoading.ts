import type { Ref } from 'vue'

// Évite qu'un skeleton/spinner clignote de façon invisible quand la requête
// répond en quelques millisecondes (base locale, cache...). L'état "visible"
// reste vrai au moins `minMs`, même si `source` redevient false avant.
export function useMinLoading(source: Ref<boolean>, minMs = 400) {
    const visible = ref(source.value)
    let shownAt = 0
    let hideTimer: ReturnType<typeof setTimeout> | null = null

    watch(
        source,
        (isLoading: boolean) => {
            if (isLoading) {
                if (hideTimer) clearTimeout(hideTimer)
                visible.value = true
                shownAt = Date.now()
            } else {
                const elapsed = Date.now() - shownAt
                const remaining = Math.max(0, minMs - elapsed)
                hideTimer = setTimeout(() => {
                    visible.value = false
                }, remaining)
            }
        },
        { immediate: true }
    )

    return visible
}
