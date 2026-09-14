import { getDb } from '../../utils/db'

const COUT_BOOST = 2 // crédits nécessaires pour booster une annonce 7 jours

interface BoostBody {
  listingId: string
}

// POST /api/credits/boost  body: { listingId } — l'utilisateur vient de la session, jamais du client
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const userId = session.user.id

  const body = await readBody<BoostBody>(event)
  if (!body.listingId) {
    throw createError({ statusCode: 400, statusMessage: 'listingId requis' })
  }

  const db = await getDb()
  const solde = db.data.credits[userId] ?? 0

  if (solde < COUT_BOOST) {
    throw createError({
      statusCode: 402,
      statusMessage: `Crédits insuffisants (solde: ${solde}, coût: ${COUT_BOOST})`
    })
  }

  const listing = db.data.listings.find(l => l.id === body.listingId && l.userId === userId)
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
