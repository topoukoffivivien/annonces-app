import { getDb } from '../../utils/db'
import { requireAdmin } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const db = await getDb()

  const reports = db.data.reports
    .filter(r => r.status === 'open')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(r => ({
      ...r,
      listing: db.data.listings.find(l => l.id === r.listingId) || null
    }))

  return { reports }
})
