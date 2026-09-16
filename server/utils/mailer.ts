// ⚠️ SIMULATEUR : aucun email n'est réellement envoyé, juste loggé côté serveur.
// Avant la mise en production, remplacer ce fichier par un vrai fournisseur
// (Resend, SendGrid, Postmark, AWS SES...) — l'appelant (register.post.ts,
// forgot-password.post.ts) n'a pas besoin de changer, seule cette fonction.
export async function sendMail(to: string, subject: string, bodyText: string) {
  console.log(`\n📧 [EMAIL SIMULÉ]\nÀ: ${to}\nSujet: ${subject}\n${bodyText}\n`)
  return { simulated: true }
}
