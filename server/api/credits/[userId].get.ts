import { getDb } from '../../utils/db'

// GET /api/credits/demo-user
export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId') as string
  const db = await getDb()
  const balance = db.data.credits[userId] ?? 0
  return { userId, balance }
})
