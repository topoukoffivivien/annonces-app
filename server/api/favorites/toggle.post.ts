import { getDb } from '../../utils/db'

interface ToggleBody {
  userId: string
  listingId: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ToggleBody>(event)
  if (!body.userId || !body.listingId) {
    throw createError({ statusCode: 400, statusMessage: 'userId et listingId requis' })
  }

  const db = await getDb()
  const current = db.data.favorites[body.userId] || []
  const i = current.indexOf(body.listingId)

  if (i === -1) current.push(body.listingId)
  else current.splice(i, 1)

  db.data.favorites[body.userId] = current
  await db.write()

  return { ids: current }
})
