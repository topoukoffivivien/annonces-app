import { JSONFilePreset } from 'lowdb/node'
import { nanoid } from 'nanoid'
import path from 'path'
import { mkdirSync } from 'fs'
import type { Listing } from '../types/listing'
import type { Seller } from '../types/seller'

interface DbSchema {
  listings: Listing[]
  categories: { slug: string; name: string }[]
  cities: string[]
  credits: Record<string, number>
  sellers: Seller[]
}

const categories = [
  { slug: 'vehicules', name: 'Véhicules' },
  { slug: 'immobilier', name: 'Immobilier' },
  { slug: 'electronique', name: 'Électronique' },
  { slug: 'mode-et-beaute', name: 'Mode & Beauté' },
  { slug: 'emplois', name: 'Emplois' }
]

const cities = ['Lomé', 'Kara', 'Sokodé', 'Kpalimé', 'Atakpamé', 'Tsévié']

const sellers: Seller[] = [
  {
    id: 'demo-user',
    name: 'Ama Koffi',
    avatarInitials: 'AK',
    city: 'Lomé',
    memberSince: '2023-03-01',
    phone: '+228 90 00 00 00',
    isVerified: true,
    responseRate: 92
  },
  {
    id: 'seller-2',
    name: 'Kossi Mensah',
    avatarInitials: 'KM',
    city: 'Kara',
    memberSince: '2022-08-15',
    phone: '+228 91 22 33 44',
    isVerified: true,
    responseRate: 78
  },
  {
    id: 'seller-3',
    name: 'Adjoa Fiati',
    avatarInitials: 'AF',
    city: 'Sokodé',
    memberSince: '2024-01-20',
    phone: '+228 92 55 66 77',
    isVerified: false,
    responseRate: 60
  }
]

// helper pour générer des annonces sans répéter 15 fois la même structure
function makeListing(partial: {
  title: string
  description: string
  price: number
  categorySlug: string
  city: string
  images?: string[]
  isTop?: boolean
  isSold?: boolean
  userId: string
  daysAgo?: number
}): Listing {
  const createdAt = new Date()
  createdAt.setDate(createdAt.getDate() - (partial.daysAgo ?? 0))
  return {
    id: nanoid(8),
    title: partial.title,
    description: partial.description,
    price: partial.price,
    categorySlug: partial.categorySlug,
    city: partial.city,
    images: partial.images || [],
    status: 'published',
    isTop: partial.isTop ?? false,
    isSold: partial.isSold ?? false,
    userId: partial.userId,
    createdAt: createdAt.toISOString()
  }
}

const listings: Listing[] = [
  // Véhicules
  makeListing({
    title: 'Toyota Corolla 2016, climatisée',
    description: "Véhicule bien entretenu, vidange à jour, papiers en règle. Visible à Lomé Agbalépédogan.",
    price: 6500000,
    categorySlug: 'vehicules',
    city: 'Lomé',
    images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600'],
    isTop: true,
    userId: 'demo-user',
    daysAgo: 1
  }),
  makeListing({
    title: 'Moto Djakarta 125cc',
    description: 'Moto en bon état, idéale pour la ville. Prix légèrement négociable.',
    price: 450000,
    categorySlug: 'vehicules',
    city: 'Kara',
    images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600'],
    userId: 'seller-2',
    daysAgo: 4
  }),
  makeListing({
    title: 'Toyota Hilux 4x4, 2014',
    description: 'Pick-up solide, parfait pour chantier ou brousse. Moteur diesel.',
    price: 9800000,
    categorySlug: 'vehicules',
    city: 'Sokodé',
    images: ['https://images.unsplash.com/photo-1583267746897-2cf415887172?w=600'],
    userId: 'seller-3',
    isSold: true,
    daysAgo: 20
  }),
  makeListing({
    title: 'Vélo VTT tout-terrain',
    description: 'Vélo robuste, pneus increvables, freins à disque.',
    price: 85000,
    categorySlug: 'vehicules',
    city: 'Lomé',
    images: ['https://images.unsplash.com/photo-1544191696-15693072b5a2?w=600'],
    userId: 'demo-user',
    isSold: true,
    daysAgo: 30
  }),

  // Immobilier
  makeListing({
    title: 'Terrain 1/2 lot à Agoè',
    description: 'Terrain viabilisé proche du goudron, titre foncier disponible.',
    price: 12000000,
    categorySlug: 'immobilier',
    city: 'Lomé',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600'],
    isTop: true,
    userId: 'demo-user',
    daysAgo: 2
  }),
  makeListing({
    title: 'Appartement 3 pièces à louer',
    description: 'Quartier calme, eau et électricité disponibles, avance 6 mois.',
    price: 120000,
    categorySlug: 'immobilier',
    city: 'Lomé',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600'],
    userId: 'seller-2',
    daysAgo: 6
  }),
  makeListing({
    title: 'Villa duplex 5 chambres',
    description: 'Villa moderne avec piscine, garage 2 voitures, quartier résidentiel.',
    price: 45000000,
    categorySlug: 'immobilier',
    city: 'Kara',
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600'],
    isTop: true,
    userId: 'seller-3',
    daysAgo: 8
  }),
  makeListing({
    title: 'Studio meublé à Kpalimé',
    description: 'Idéal étudiant ou jeune actif, proche du marché central.',
    price: 45000,
    categorySlug: 'immobilier',
    city: 'Kpalimé',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'],
    userId: 'demo-user',
    isSold: true,
    daysAgo: 25
  }),

  // Électronique
  makeListing({
    title: 'Samsung Galaxy A15 128Go',
    description: 'Téléphone neuf sous emballage, garantie 1 an.',
    price: 95000,
    categorySlug: 'electronique',
    city: 'Kara',
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600'],
    userId: 'demo-user',
    daysAgo: 1
  }),
  makeListing({
    title: 'MacBook Air M1 2020',
    description: 'Excellent état, batterie à 91%, chargeur d\'origine inclus.',
    price: 480000,
    categorySlug: 'electronique',
    city: 'Lomé',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600'],
    isTop: true,
    userId: 'seller-2',
    daysAgo: 3
  }),
  makeListing({
    title: 'Téléviseur LED 43 pouces',
    description: 'Smart TV, Wifi intégré, télécommande fournie.',
    price: 140000,
    categorySlug: 'electronique',
    city: 'Sokodé',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600'],
    userId: 'seller-3',
    daysAgo: 5
  }),
  makeListing({
    title: 'Casque audio Bluetooth JBL',
    description: 'Autonomie 20h, réduction de bruit active.',
    price: 25000,
    categorySlug: 'electronique',
    city: 'Lomé',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
    userId: 'demo-user',
    isSold: true,
    daysAgo: 15
  }),

  // Mode & Beauté
  makeListing({
    title: 'Robe traditionnelle wax sur-mesure',
    description: 'Confection artisanale, tissu wax hollandais authentique.',
    price: 35000,
    categorySlug: 'mode-et-beaute',
    city: 'Lomé',
    images: ['https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600'],
    userId: 'seller-3',
    daysAgo: 2
  }),
  makeListing({
    title: 'Sac à main cuir véritable',
    description: 'Import de qualité, plusieurs coloris disponibles.',
    price: 28000,
    categorySlug: 'mode-et-beaute',
    city: 'Kara',
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600'],
    userId: 'seller-2',
    daysAgo: 7
  }),
  makeListing({
    title: 'Baskets Nike Air Max, pointure 42',
    description: 'Neuves, jamais portées, boîte d\'origine.',
    price: 42000,
    categorySlug: 'mode-et-beaute',
    city: 'Lomé',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
    isTop: true,
    userId: 'demo-user',
    daysAgo: 4
  }),

  // Emplois
  makeListing({
    title: 'Recherche comptable expérimenté(e)',
    description: 'CDI, expérience minimum 3 ans, maîtrise Excel et Sage.',
    price: 250000,
    categorySlug: 'emplois',
    city: 'Lomé',
    images: [],
    userId: 'seller-2',
    daysAgo: 1
  }),
  makeListing({
    title: 'Chauffeur particulier temps plein',
    description: 'Permis catégorie B, minimum 5 ans d\'expérience, disponible immédiatement.',
    price: 90000,
    categorySlug: 'emplois',
    city: 'Kara',
    images: [],
    userId: 'seller-3',
    daysAgo: 9
  }),
  makeListing({
    title: 'Vendeuse boutique de vêtements',
    description: 'Bonne présentation, sens du contact client, temps partiel possible.',
    price: 60000,
    categorySlug: 'emplois',
    city: 'Sokodé',
    images: [],
    userId: 'demo-user',
    daysAgo: 12
  })
]

const defaultData: DbSchema = {
  credits: {
    'demo-user': 5,
    'seller-2': 3,
    'seller-3': 1
  },
  sellers,
  categories,
  cities,
  listings
}

let dbInstance: Awaited<ReturnType<typeof JSONFilePreset<DbSchema>>> | null = null

export async function getDb() {
  if (!dbInstance) {
    const dir = path.join(process.cwd(), '.data')
    mkdirSync(dir, { recursive: true })
    const file = path.join(dir, 'db.json')
    dbInstance = await JSONFilePreset<DbSchema>(file, defaultData)
  }
  return dbInstance
}