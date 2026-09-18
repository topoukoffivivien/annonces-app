import { getDb } from '../../utils/db'
import { nanoid } from 'nanoid'

interface ReportBody {
  listingId: string
  reason: string
}

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const body = await readBody<ReportBody>(event)

  if (!body.listingId || !body.reason?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'listingId et reason requis' })
  }

  const db = await getDb()
  const listing = db.data.listings.find(l => l.id === body.listingId)
  if (!listing) {
    throw createError({ statusCode: 404, statusMessage: 'Annonce introuvable' })
  }

  db.data.reports.push({
    id: nanoid(8),
    listingId: body.listingId,
    reason: body.reason.trim(),
    reporterId: session.user.id,
    createdAt: new Date().toISOString(),
    status: 'open'
  })
  await db.write()

  return { success: true }
})
