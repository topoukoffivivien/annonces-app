import { JSONFilePreset } from 'lowdb/node'
import { nanoid } from 'nanoid'
import path from 'path'
import { mkdirSync } from 'fs'
import type { Listing } from '../types/listing'

interface DbSchema {
  listings: Listing[]
  categories: { slug: string; name: string }[]
  cities: string[]
  credits: Record<string, number>
}

const defaultData: DbSchema = {
  credits: {
    'demo-user': 5
  },
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
      userId: 'demo-user',
      createdAt: new Date().toISOString()
    },
    {
      id: nanoid(8),
      title: 'Vélo de montagne',
      description: 'Vélo de montagne en bon état, idéal pour les randonnées.',
      price: 45000,
      categorySlug: 'vehicules',
      city: 'Sokodé',
      images: [],
      status: 'published',
      isTop: false,
      userId: 'demo-user',
      createdAt: new Date().toISOString()
    },
    {
      id: nanoid(8),
      title: 'Appartement T3 à louer',
      description: 'Appartement spacieux avec balcon, proche des commerces.',
      price: 250000,
      categorySlug: 'immobilier',
      city: 'Kpalimé',
      images: [],
      status: 'published',
      isTop: false,
      userId: 'demo-user',
      createdAt: new Date().toISOString()
    },
    {
      id: nanoid(8),
      title: 'Robe de soirée élégante',
      description: 'Robe de soirée neuve, taille M, couleur rouge.',
      price: 30000,
      categorySlug: 'mode-et-beaute',
      city: 'Atakpamé',
      images: [],
      status: 'published',
      isTop: false,
      userId: 'demo-user',
      createdAt: new Date().toISOString()
    },
    {
      id: nanoid(8),
      title: 'Offre d\'emploi : Développeur web',
      description: 'Nous recherchons un développeur web expérimenté pour rejoindre notre équipe.',
      price: 0,
      categorySlug: 'emplois',
      city: 'Tsévié',
      images: [],
      status: 'published',
      isTop: false,
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
