export interface Listing {
  id: string
  title: string
  description: string
  price: number
  categorySlug: string
  city: string
  images: string[]
  status: 'pending' | 'published' | 'rejected'
  isTop: boolean
  isSold: boolean
  userId: string
  createdAt: string
}

export function useListings() {
  async function fetchListings(filters: Record<string, string | number> = {}) {
    return await $fetch<{ count: number; results: Listing[] }>('/api/listings', { query: filters })
  }

  async function fetchListing(id: string) {
    return await $fetch<Listing>(`/api/listings/${id}`)
  }

  async function createListing(payload: Record<string, unknown>) {
    return await $fetch('/api/listings', { method: 'POST', body: payload })
  }

  async function boostListing(userId: string, listingId: string) {
    return await $fetch('/api/credits/boost', { method: 'POST', body: { userId, listingId } })
  }

  return { fetchListings, fetchListing, createListing, boostListing }
}
