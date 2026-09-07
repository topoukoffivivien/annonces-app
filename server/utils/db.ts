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

const defaultData: DbSchema = {
  credits: {
    'demo-user': 5
  },
  sellers: [
    {
      id: 'demo-user',
      name: 'Ama Koffi',
      avatarInitials: 'AK',
      city: 'Lomé',
      memberSince: '2023-03-01',
      phone: '+228 90 00 00 00',
      isVerified: true,
      responseRate: 92
    }
  ],
  categories: [
    { slug: 'vehicules', name: 'Véhicules' },
    { slug: 'immobilier', name: 'Immobilier' },
    { slug: 'electronique', name: 'Électronique' },
    { slug: 'mode-et-beaute', name: 'Mode & Beauté' },
    { slug: 'emplois', name: 'Emplois' }
  ],
  cities: ['Lomé', 'Kara', 'Sokodé', 'Kpalimé', 'Atakpamé', 'Tsévié'],
  listings: [
    {
      id: nanoid(8),
      title: 'Terrain 1/2 lot à Agoè',
      description: 'Terrain viabilisé proche du goudron, titre foncier disponible.',
      price: 12000000,
      categorySlug: 'immobilier',
      city: 'Lomé',
      images: [],
      status: 'published',
      isTop: true,
      isSold: false,
      userId: 'demo-user',
      createdAt: new Date().toISOString()
    },
    {
      id: nanoid(8),
      title: 'Samsung Galaxy A15 128Go',
      description: 'Téléphone neuf sous emballage, garantie 1 an.',
      price: 95000,
      categorySlug: 'electronique',
      city: 'Kara',
      images: [],
      status: 'published',
      isTop: false,
      isSold: false,
      userId: 'demo-user',
      createdAt: new Date().toISOString()
    }
  ]
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
