export default defineOAuthFacebookEventHandler({
  config: {
    // champs demandés au profil Facebook
    fields: ['id', 'name', 'email', 'picture']
  },
  async onSuccess(event, { user }) {
    const seller = await upsertSellerFromOAuth({
      provider: 'facebook',
      email: user.email,
      name: user.name,
      avatarUrl: user.picture?.data?.url
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
    console.error('Erreur OAuth Facebook:', error)
    return sendRedirect(event, '/connexion?erreur=facebook')
  }
})
