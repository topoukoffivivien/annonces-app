export function useAlerts() {
  async function fetchSubscribed(sellerId: string) {
    return await $fetch<{ subscribed: boolean }>(`/api/alerts/${sellerId}`)
  }

  async function toggleAlert(sellerId: string) {
    return await $fetch<{ subscribed: boolean }>('/api/alerts/toggle', {
      method: 'POST',
      body: { sellerId }
    })
  }

  return { fetchSubscribed, toggleAlert }
}
