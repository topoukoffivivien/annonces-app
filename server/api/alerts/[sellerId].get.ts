import { getDb } from '../../utils/db'

// GET /api/alerts/:sellerId — abonnement de l'utilisateur connecté (false si non connecté)
export default defineEventHandler(async (event) => {
  const sellerId = getRouterParam(event, 'sellerId') as string
  const session = await getUserSession(event)

  if (!session.user) return { subscribed: false }

  const db = await getDb()
  const subscribers = db.data.alerts[sellerId] || []
  return { subscribed: subscribers.includes(session.user.id) }
})
