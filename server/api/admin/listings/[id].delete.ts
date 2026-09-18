import { getDb } from '../../../utils/db'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')

  const db = await getDb()
  const index = db.data.listings.findIndex(l => l.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Annonce introuvable' })
  }

  db.data.listings.splice(index, 1)
  await db.write()

  return { success: true }
})
