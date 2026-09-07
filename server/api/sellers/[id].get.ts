import { getDb } from '../../utils/db'

// GET /api/sellers/:id — profil + annonces publiées de ce vendeur
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const db = await getDb()

  const seller = db.data.sellers.find(s => s.id === id)
  if (!seller) {
    throw createError({ statusCode: 404, statusMessage: 'Vendeur introuvable' })
  }

  const listings = db.data.listings
    .filter(l => l.userId === id && l.status === 'published')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return { seller, listings, listingsCount: listings.length }
})
