export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', 'nuxt-auth-utils'],

  // Le code applicatif (pages, components, composables, app.vue) vit dans app/
  srcDir: 'app/',
  // Les routes API Nitro restent à la racine, dans server/ (indépendant de srcDir)
  serverDir: 'server/',
  css: ['~/assets/main.css'],

  // En SSR pour le web (SEO), on bascule côté Capacitor via NUXT_PUBLIC_MOBILE_BUILD
  ssr: process.env.NUXT_PUBLIC_MOBILE_BUILD !== 'true',

  app: {
    head: {
      title: 'Annonces TG',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Petites annonces gratuites au Togo' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },

  nitro: {
    // 'static' pour générer le build embarqué dans Capacitor (npm run generate)
    preset: process.env.NUXT_PUBLIC_MOBILE_BUILD === 'true' ? 'static' : undefined
  }
})
