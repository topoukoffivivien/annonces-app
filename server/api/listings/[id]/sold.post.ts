import { getDb } from '../../../utils/db'

// POST /api/listings/:id/sold — bascule isSold, réservé au propriétaire de l'annonce
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const id = getRouterParam(event, 'id')

  const db = await getDb()
  const listing = db.data.listings.find(l => l.id === id)

  if (!listing) {
    throw createError({ statusCode: 404, statusMessage: 'Annonce introuvable' })
  }
  if (listing.userId !== session.user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Cette annonce ne vous appartient pas' })
  }

  listing.isSold = !listing.isSold
  await db.write()

  return { listing }
})
