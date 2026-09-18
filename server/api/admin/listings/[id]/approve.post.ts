import { getDb } from '../../../../utils/db'
import { requireAdmin } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')

  const db = await getDb()
  const listing = db.data.listings.find(l => l.id === id)
  if (!listing) {
    throw createError({ statusCode: 404, statusMessage: 'Annonce introuvable' })
  }

  listing.status = 'published'
  await db.write()

  return { listing }
})
