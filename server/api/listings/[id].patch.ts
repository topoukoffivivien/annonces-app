import { getDb } from '../../utils/db'

interface UpdateBody {
  title?: string
  description?: string
  price?: number
  categorySlug?: string
  city?: string
  images?: string[]
}

// PATCH /api/listings/:id — réservé au propriétaire de l'annonce
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody<UpdateBody>(event)

  const db = await getDb()
  const listing = db.data.listings.find(l => l.id === id)

  if (!listing) {
    throw createError({ statusCode: 404, statusMessage: 'Annonce introuvable' })
  }
  if (listing.userId !== session.user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Cette annonce ne vous appartient pas' })
  }

  if (body.title !== undefined) listing.title = body.title
  if (body.description !== undefined) listing.description = body.description
  if (body.price !== undefined) listing.price = Number(body.price)
  if (body.categorySlug !== undefined) listing.categorySlug = body.categorySlug
  if (body.city !== undefined) listing.city = body.city
  if (body.images !== undefined) listing.images = body.images

  await db.write()
  return { listing }
})
