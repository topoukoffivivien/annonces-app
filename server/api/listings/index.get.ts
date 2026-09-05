import { getDb } from '../../utils/db'

// GET /api/listings?category=vehicules&city=Lomé&q=terrain&minPrice=0&maxPrice=1000000
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = await getDb()

  let results = db.data.listings.filter(l => l.status === 'published')

  if (query.category) {
    results = results.filter(l => l.categorySlug === query.category)
  }
  if (query.city) {
    results = results.filter(l => l.city === query.city)
  }
  if (query.q) {
    const q = String(query.q).toLowerCase()
    results = results.filter(l =>
      l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
    )
  }
  if (query.minPrice) {
    results = results.filter(l => l.price >= Number(query.minPrice))
  }
  if (query.maxPrice) {
    results = results.filter(l => l.price <= Number(query.maxPrice))
  }

  // Les annonces "top" (boostées) remontent en premier, puis tri par date
  results.sort((a, b) => {
    if (a.isTop !== b.isTop) return a.isTop ? -1 : 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return { count: results.length, results }
})
