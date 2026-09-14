import { getDb } from '../../utils/db'

// POST /api/notifications/read — marque tout comme lu pour l'utilisateur connecté
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const db = await getDb()
  const items = db.data.notifications[session.user.id] || []
  items.forEach(n => { n.read = true })
  await db.write()
  return { success: true }
})
