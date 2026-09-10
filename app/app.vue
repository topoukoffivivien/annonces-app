<script setup lang="ts">
const favorites = useFavoritesStore()
const { loggedIn } = useUserSession()

// Recharge les favoris du compte à chaque connexion/déconnexion
watch(loggedIn, () => favorites.loadForCurrentUser(), { immediate: true })
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="var(--color-primary)" :height="3" :throttle="0" />
    <Header />
    <NuxtPage />
    <Footer />
    <LoginModal />
  </div>
</template>
