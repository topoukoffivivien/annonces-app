import type { Listing } from './useListings'

export interface Seller {
  id: string
  name: string
  avatarInitials: string
  city: string
  memberSince: string
  phone: string
  isVerified: boolean
  responseRate: number
}

export function useSellers() {
  async function fetchSeller(id: string) {
    return await $fetch<{ seller: Seller; listings: Listing[]; listingsCount: number }>(
      `/api/sellers/${id}`
    )
  }

  return { fetchSeller }
}
