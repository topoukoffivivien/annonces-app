// Forme d'une annonce telle que stockée en base
export interface Listing {
  id: string
  title: string
  description: string
  price: number
  categorySlug: string
  city: string
  images: string[]
  status: 'pending' | 'published' | 'rejected'
  isTop: boolean
  isSold: boolean
  userId: string
  createdAt: string
}

// Corps attendu du formulaire de dépôt d'annonce (avant enrichissement serveur :
// id, status, isTop, createdAt sont calculés, pas envoyés par le client)
export interface CreateListingBody {
  title: string
  description?: string
  price: number
  categorySlug: string
  city: string
  images?: string[]
  userId?: string
}
