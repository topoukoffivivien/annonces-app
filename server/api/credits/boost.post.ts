import { getDb } from '../../utils/db'

const COUT_BOOST = 2 // crédits nécessaires pour booster une annonce 7 jours

interface BoostBody {
  userId: string
  listingId: string
}

// POST /api/credits/boost  body: { userId, listingId }
export default defineEventHandler(async (event) => {
  const body = await readBody<BoostBody>(event)
  const { userId, listingId } = body

  if (!userId || !listingId) {
    throw createError({ statusCode: 400, statusMessage: 'userId et listingId requis' })
  }

  const db = await getDb()
  const solde = db.data.credits[userId] ?? 0

  if (solde < COUT_BOOST) {
    throw createError({
      statusCode: 402,
      statusMessage: `Crédits insuffisants (solde: ${solde}, coût: ${COUT_BOOST})`
    })
  }

  const listing = db.data.listings.find(l => l.id === listingId && l.userId === userId)
  if (!listing) {
    throw createError({ statusCode: 404, statusMessage: 'Annonce introuvable pour cet utilisateur' })
  }

  listing.isTop = true
  db.data.credits[userId] = solde - COUT_BOOST
  await db.write()

  return {
    message: 'Annonce boostée pour 7 jours.',
    listing,
    newBalance: db.data.credits[userId]
  }
})
