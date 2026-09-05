import { getDb } from '../../utils/db'
import { nanoid } from 'nanoid'
import type { CreateListingBody } from '../../types/listing'

const MOTS_INTERDITS = ['arnaque', 'contrefaçon', 'faux']

// POST /api/listings — dépôt d'une annonce (statut "pending" par défaut)
export default defineEventHandler(async (event) => {
  const body = await readBody<CreateListingBody>(event)

  if (!body.title || !body.price || !body.categorySlug || !body.city) {
    throw createError({ statusCode: 400, statusMessage: 'Champs obligatoires manquants' })
  }

  const db = await getDb()

  // Vérification automatique : mots interdits -> rejet immédiat, sinon publication directe
  const contenu = `${body.title} ${body.description || ''}`.toLowerCase()
  const contientMotInterdit = MOTS_INTERDITS.some(mot => contenu.includes(mot))

  const listing = {
    id: nanoid(8),
    title: body.title,
    description: body.description || '',
    price: Number(body.price),
    categorySlug: body.categorySlug,
    city: body.city,
    images: body.images || [],
    status: contientMotInterdit ? ('rejected' as const) : ('published' as const),
    isTop: false,
    userId: body.userId || 'anonymous',
    createdAt: new Date().toISOString()
  }

  db.data.listings.push(listing)
  await db.write()

  return {
    listing,
    message: contientMotInterdit
      ? 'Annonce rejetée : contenu non conforme détecté automatiquement.'
      : 'Annonce publiée avec succès.'
  }
})
