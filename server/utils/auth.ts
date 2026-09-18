import { nanoid } from 'nanoid'
import { getDb } from './db'
import type { Seller } from '../types/seller'
import type { H3Event } from 'h3'

function initialsFromName(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase())
    .join('') || '?'
}

// Retrouve un vendeur existant par email (peu importe le provider utilisé
// la première fois), ou en crée un nouveau à partir des infos OAuth.
export async function upsertSellerFromOAuth(input: {
  provider: 'google' | 'facebook'
  email: string
  name: string
  avatarUrl?: string
}): Promise<Seller> {
  const db = await getDb()

  let seller = db.data.sellers.find(s => s.email === input.email)

  if (!seller) {
    seller = {
      id: nanoid(10),
      name: input.name,
      avatarInitials: initialsFromName(input.name),
      city: 'Lomé',
      memberSince: new Date().toISOString(),
      phone: '',
      isVerified: false,
      responseRate: 0,
      email: input.email,
      avatarUrl: input.avatarUrl,
      authProvider: input.provider
    }
    db.data.sellers.push(seller)
    db.data.credits[seller.id] = 3
    await db.write()
  } else if (input.avatarUrl && seller.avatarUrl !== input.avatarUrl) {
    seller.avatarUrl = input.avatarUrl
    await db.write()
  }

  return seller
}

// Exige une session ET que le compte soit administrateur. Lève une 403 sinon.
export async function requireAdmin(event: H3Event): Promise<Seller> {
  const session = await requireUserSession(event)
  const db = await getDb()
  const seller = db.data.sellers.find(s => s.id === session.user.id)

  if (!seller?.isAdmin) {
    throw createError({ statusCode: 403, statusMessage: 'Accès réservé aux administrateurs' })
  }

  return seller
}
