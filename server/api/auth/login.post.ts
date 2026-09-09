import { getDb } from '../../utils/db'
import { verifyPassword } from '../../utils/password'

interface LoginBody {
  email: string
  password: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)

  if (!body.email || !body.password) {
    throw createError({ statusCode: 400, statusMessage: 'Email et mot de passe requis' })
  }

  const db = await getDb()
  const email = body.email.trim().toLowerCase()
  const seller = db.data.sellers.find(s => s.email === email)

  // Message volontairement générique : ne pas révéler si l'email existe ou non
  const invalidCreds = () => createError({ statusCode: 401, statusMessage: 'Email ou mot de passe incorrect' })

  if (!seller || !seller.passwordHash) {
    throw invalidCreds()
  }

  const valid = await verifyPassword(seller.passwordHash, body.password)
  if (!valid) {
    throw invalidCreds()
  }

  await setUserSession(event, {
    user: { id: seller.id, name: seller.name, email: seller.email, avatarUrl: seller.avatarUrl }
  })

  return { success: true }
})
