import { getDb } from '../../utils/db'

// GET /api/credits/me — solde de l'utilisateur actuellement connecté
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const db = await getDb()
  const balance = db.data.credits[session.user.id] ?? 0
  return { userId: session.user.id, balance }
})
