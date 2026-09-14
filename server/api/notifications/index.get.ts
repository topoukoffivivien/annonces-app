import { getDb } from '../../utils/db'

// GET /api/notifications — notifications de l'utilisateur connecté, les plus récentes d'abord
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const db = await getDb()
  const items = (db.data.notifications[session.user.id] || [])
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return { items, unreadCount: items.filter(n => !n.read).length }
})
