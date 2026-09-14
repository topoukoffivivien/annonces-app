export function useCredits() {
  async function fetchMyBalance() {
    return await $fetch<{ userId: string; balance: number }>('/api/credits/me')
  }

  async function boostListing(listingId: string) {
    return await $fetch('/api/credits/boost', { method: 'POST', body: { listingId } })
  }

  return { fetchMyBalance, boostListing }
}
