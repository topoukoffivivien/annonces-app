export function useReports() {
  async function reportListing(listingId: string, reason: string) {
    return await $fetch('/api/reports', { method: 'POST', body: { listingId, reason } })
  }

  return { reportListing }
}
