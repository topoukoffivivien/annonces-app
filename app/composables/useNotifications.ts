export interface AppNotification {
  id: string
  message: string
  listingId: string
  createdAt: string
  read: boolean
}

export function useNotifications() {
  async function fetchAll() {
    return await $fetch<{ items: AppNotification[]; unreadCount: number }>('/api/notifications')
  }

  async function markAllRead() {
    return await $fetch('/api/notifications/read', { method: 'POST' })
  }

  return { fetchAll, markAllRead }
}
