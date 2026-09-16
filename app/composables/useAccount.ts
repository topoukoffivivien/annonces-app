import type { Listing } from './useListings'

export interface UpdateSellerPayload {
    name?: string
    city?: string
    phone?: string
    avatarUrl?: string
}

export function useAccount() {
    async function updateProfile(payload: UpdateSellerPayload) {
        return await $fetch('/api/sellers/me', { method: 'PATCH', body: payload })
    }

    async function fetchMyListings() {
        return await $fetch<{ listings: Listing[] }>('/api/sellers/me/listings')
    }

    async function updateListing(id: string, payload: Partial<Listing>) {
        return await $fetch<{ listing: Listing }>(`/api/listings/${id}`, { method: 'PATCH', body: payload })
    }

    async function deleteListing(id: string) {
        return await $fetch(`/api/listings/${id}`, { method: 'DELETE' })
    }

    return { updateProfile, fetchMyListings, updateListing, deleteListing }
}
