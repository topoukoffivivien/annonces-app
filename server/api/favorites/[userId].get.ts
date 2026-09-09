import { getDb } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId') as string
  const db = await getDb()
  return { ids: db.data.favorites[userId] || [] }
})
