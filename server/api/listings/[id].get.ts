import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const db = await getDb()
  const listing = db.data.listings.find(l => l.id === id)

  if (!listing) {
    throw createError({ statusCode: 404, statusMessage: 'Annonce introuvable' })
  }

  return listing
})
