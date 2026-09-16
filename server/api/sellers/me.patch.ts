import { getDb } from '../../utils/db'
import { toPublicSeller } from '../../types/seller'

interface UpdateSellerBody {
  name?: string
  city?: string
  phone?: string
  avatarUrl?: string
}

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const body = await readBody<UpdateSellerBody>(event)

  const db = await getDb()
  const seller = db.data.sellers.find(s => s.id === session.user.id)
  if (!seller) {
    throw createError({ statusCode: 404, statusMessage: 'Compte introuvable' })
  }

  if (body.name !== undefined && body.name.trim()) seller.name = body.name.trim()
  if (body.city !== undefined) seller.city = body.city
  if (body.phone !== undefined) seller.phone = body.phone
  if (body.avatarUrl !== undefined) seller.avatarUrl = body.avatarUrl

  await db.write()

  // Garde la session à jour (nom/avatar affichés dans le header)
  await setUserSession(event, {
    user: { id: seller.id, name: seller.name, email: seller.email, avatarUrl: seller.avatarUrl }
  })

  return { seller: toPublicSeller(seller) }
})
