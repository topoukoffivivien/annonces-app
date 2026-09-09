import { nanoid } from 'nanoid'
import { getDb } from '../../utils/db'
import { hashPassword } from '../../utils/password'

interface RegisterBody {
  name: string
  email: string
  password: string
}

function initialsFromName(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join('') || '?'
}

export default defineEventHandler(async (event) => {
  const body = await readBody<RegisterBody>(event)

  if (!body.name || !body.email || !body.password) {
    throw createError({ statusCode: 400, statusMessage: 'Nom, email et mot de passe requis' })
  }
  if (body.password.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'Le mot de passe doit contenir au moins 6 caractères' })
  }

  const db = await getDb()
  const email = body.email.trim().toLowerCase()
  let seller = db.data.sellers.find(s => s.email === email)

  if (seller?.passwordHash) {
    throw createError({ statusCode: 409, statusMessage: 'Un compte existe déjà avec cet email' })
  }

  const passwordHash = await hashPassword(body.password)

  if (seller) {
    // Compte existant créé via OAuth : on lui ajoute la possibilité de se connecter par mot de passe
    seller.passwordHash = passwordHash
  } else {
    seller = {
      id: nanoid(10),
      name: body.name,
      avatarInitials: initialsFromName(body.name),
      city: 'Lomé',
      memberSince: new Date().toISOString(),
      phone: '',
      isVerified: false,
      responseRate: 0,
      email,
      authProvider: 'password',
      passwordHash
    }
    db.data.sellers.push(seller)
    db.data.credits[seller.id] = 3
  }

  await db.write()

  await setUserSession(event, {
    user: { id: seller.id, name: seller.name, email: seller.email, avatarUrl: seller.avatarUrl }
  })

  return { success: true }
})
