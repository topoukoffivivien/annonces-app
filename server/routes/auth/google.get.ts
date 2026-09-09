export default defineOAuthGoogleEventHandler({
  config: {
    scope: ['email', 'profile']
  },
  async onSuccess(event, { user }) {
    const seller = await upsertSellerFromOAuth({
      provider: 'google',
      email: user.email,
      name: user.name,
      avatarUrl: user.picture
    })

    await setUserSession(event, {
      user: {
        id: seller.id,
        name: seller.name,
        email: seller.email,
        avatarUrl: seller.avatarUrl
      }
    })

    return sendRedirect(event, '/')
  },
  onError(event, error) {
    console.error('Erreur OAuth Google:', error)
    return sendRedirect(event, '/connexion?erreur=google')
  }
})
