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
  avatarUrl?: string
  authProvider?: 'google' | 'facebook' | 'password'
  passwordHash?: string
}
