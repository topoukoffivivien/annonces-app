import { getDb } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const db = await getDb()

  const listings = db.data.listings
    .filter(l => l.userId === session.user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return { listings }
})
