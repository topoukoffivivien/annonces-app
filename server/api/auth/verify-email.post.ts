import { getDb } from '../../utils/db'

interface Body {
  token: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event)
  if (!body.token) {
    throw createError({ statusCode: 400, statusMessage: 'Token requis' })
  }

  const db = await getDb()
  const seller = db.data.sellers.find(s => s.emailVerificationToken === body.token)

  if (!seller) {
    throw createError({ statusCode: 400, statusMessage: 'Lien de vérification invalide ou déjà utilisé' })
  }

  seller.emailVerified = true
  seller.emailVerificationToken = undefined
  await db.write()

  return { success: true }
})
