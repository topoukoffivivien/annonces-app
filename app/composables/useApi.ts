// Sur le web, apiBase est vide -> les appels restent relatifs (même origine).
// Sur le build mobile (Capacitor), apiBase pointe vers le backend déployé
// (NUXT_PUBLIC_API_BASE) puisqu'aucun serveur Nitro ne tourne sur l'appareil.
export function useApi() {
    const config = useRuntimeConfig()

    function apiFetch<T = any>(path: string, opts?: Parameters<typeof $fetch>[1]) {
        const base = config.public.apiBase
        const url = base ? `${base}${path}` : path
        return $fetch<T>(url, opts)
    }

    return { apiFetch }
}
