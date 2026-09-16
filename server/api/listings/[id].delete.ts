import { getDb } from '../../utils/db'

// DELETE /api/listings/:id — réservé au propriétaire de l'annonce
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const id = getRouterParam(event, 'id')

  const db = await getDb()
  const idx = db.data.listings.findIndex(l => l.id === id)

  if (idx === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Annonce introuvable' })
  }
  if (db.data.listings[idx].userId !== session.user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Cette annonce ne vous appartient pas' })
  }

  db.data.listings.splice(idx, 1)
  await db.write()
  return { success: true }
})
