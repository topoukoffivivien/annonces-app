import { nanoid } from 'nanoid'
import { getDb } from '../../utils/db'
import { sendMail } from '../../utils/mailer'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const db = await getDb()
  const seller = db.data.sellers.find(s => s.id === session.user.id)

  if (!seller || !seller.email) {
    throw createError({ statusCode: 400, statusMessage: 'Aucun email associé à ce compte' })
  }
  if (seller.emailVerified) {
    return { success: true, alreadyVerified: true }
  }

  const token = nanoid(32)
  seller.emailVerificationToken = token
  await db.write()

  const verifyLink = `/verifier-email?token=${token}`
  await sendMail(seller.email, 'Confirmez votre email', `Cliquez ici : ${verifyLink}`)

  return { success: true, devVerifyLink: verifyLink }
})
