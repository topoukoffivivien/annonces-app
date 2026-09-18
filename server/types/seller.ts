export interface Seller {
  id: string
  name: string
  avatarInitials: string
  city: string
  memberSince: string
  phone: string
  isVerified: boolean
  responseRate: number // pourcentage de réponse aux messages
  email?: string
  emailVerified?: boolean
  emailVerificationToken?: string
  avatarUrl?: string
  authProvider?: 'google' | 'facebook' | 'password'
  passwordHash?: string
  isAdmin?: boolean
}

// Version sûre à renvoyer au client : jamais le hash de mot de passe,
// jamais le token de vérification d'email en cours.
export type PublicSeller = Omit<Seller, 'passwordHash' | 'emailVerificationToken'>

export function toPublicSeller(seller: Seller): PublicSeller {
  const { passwordHash, emailVerificationToken, ...safe } = seller
  return safe
}
