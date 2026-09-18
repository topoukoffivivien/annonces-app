import { getDb } from '../../utils/db'
import { nanoid } from 'nanoid'

interface ReviewBody {
  sellerId: string
  rating: number
  comment: string
}

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const body = await readBody<ReviewBody>(event)

  if (!body.sellerId || !body.rating || body.rating < 1 || body.rating > 5) {
    throw createError({ statusCode: 400, statusMessage: 'sellerId et une note de 1 à 5 sont requis' })
  }
  if (body.sellerId === session.user.id) {
    throw createError({ statusCode: 400, statusMessage: 'Vous ne pouvez pas vous noter vous-même' })
  }

  const db = await getDb()
  const author = db.data.sellers.find(s => s.id === session.user.id)

  // Un seul avis par acheteur et par vendeur : on met à jour s'il existe déjà
  const existing = db.data.reviews.find(r => r.sellerId === body.sellerId && r.authorId === session.user.id)

  if (existing) {
    existing.rating = body.rating
    existing.comment = body.comment || ''
    existing.createdAt = new Date().toISOString()
  } else {
    db.data.reviews.push({
      id: nanoid(8),
      sellerId: body.sellerId,
      authorId: session.user.id,
      authorName: author?.name || session.user.name || 'Utilisateur',
      rating: body.rating,
      comment: body.comment || '',
      createdAt: new Date().toISOString()
    })
  }

  await db.write()
  return { success: true }
})
