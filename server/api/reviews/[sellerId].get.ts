import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const sellerId = getRouterParam(event, 'sellerId') as string
  const db = await getDb()

  const reviews = db.data.reviews
    .filter(r => r.sellerId === sellerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const average = reviews.length
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : 0

  return { reviews, average, count: reviews.length }
})
