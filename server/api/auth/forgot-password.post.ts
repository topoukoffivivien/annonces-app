import { nanoid } from 'nanoid'
import { getDb } from '../../utils/db'
import { sendMail } from '../../utils/mailer'

interface Body {
  email: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event)
  const email = body.email?.trim().toLowerCase()

  // Message volontairement générique : ne révèle jamais si l'email existe ou non
  const generic = { message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' }
  if (!email) return generic

  const db = await getDb()
  const seller = db.data.sellers.find(s => s.email === email && s.passwordHash)
  if (!seller) return generic

  const token = nanoid(32)
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString() // valable 1h
  db.data.passwordResets[token] = { userId: seller.id, expiresAt }
  await db.write()

  const resetLink = `/reinitialiser-mot-de-passe?token=${token}`
  await sendMail(email, 'Réinitialisation de votre mot de passe', `Cliquez ici : ${resetLink}`)

  // ⚠️ devResetLink n'est renvoyé que parce qu'aucun vrai email n'est envoyé ici.
  // À supprimer dès qu'un vrai fournisseur d'email est branché dans mailer.ts —
  // renvoyer ce lien dans la réponse API serait une faille de sécurité en production.
  return { ...generic, devResetLink: resetLink }
})
