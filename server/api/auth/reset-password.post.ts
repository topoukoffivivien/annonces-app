import { getDb } from '../../utils/db'
import { hashPassword } from '../../utils/password'

interface Body {
  token: string
  password: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event)
  if (!body.token || !body.password) {
    throw createError({ statusCode: 400, statusMessage: 'Token et mot de passe requis' })
  }
  if (body.password.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'Le mot de passe doit contenir au moins 6 caractères' })
  }

  const db = await getDb()
  const entry = db.data.passwordResets[body.token]

  if (!entry || new Date(entry.expiresAt) < new Date()) {
    throw createError({ statusCode: 400, statusMessage: 'Lien invalide ou expiré' })
  }

  const seller = db.data.sellers.find(s => s.id === entry.userId)
  if (!seller) {
    throw createError({ statusCode: 404, statusMessage: 'Compte introuvable' })
  }

  seller.passwordHash = await hashPassword(body.password)
  delete db.data.passwordResets[body.token]
  await db.write()

  return { success: true }
})
