import { getDb } from '../../../../utils/db'
import { requireAdmin } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const id = getRouterParam(event, 'id')

  const db = await getDb()
  const report = db.data.reports.find(r => r.id === id)
  if (!report) {
    throw createError({ statusCode: 404, statusMessage: 'Signalement introuvable' })
  }

  report.status = 'resolved'
  await db.write()

  return { success: true }
})
