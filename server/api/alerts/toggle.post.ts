import { getDb } from '../../utils/db'

interface ToggleBody {
  sellerId: string
}

// POST /api/alerts/toggle  body: { sellerId }
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const body = await readBody<ToggleBody>(event)

  if (!body.sellerId) {
    throw createError({ statusCode: 400, statusMessage: 'sellerId requis' })
  }

  const db = await getDb()
  const current = db.data.alerts[body.sellerId] || []
  const i = current.indexOf(session.user.id)

  if (i === -1) current.push(session.user.id)
  else current.splice(i, 1)

  db.data.alerts[body.sellerId] = current
  await db.write()

  return { subscribed: current.includes(session.user.id) }
})
