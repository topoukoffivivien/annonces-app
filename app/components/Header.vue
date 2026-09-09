<script setup lang="ts">
const { categories } = useCategories()
const favorites = useFavoritesStore()
const { open: openAuthModal } = useAuthModal()
const { loggedIn, user, clear } = useUserSession()
const open = ref(false)
const userMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

async function logout() {
  await clear()
  userMenuOpen.value = false
  open.value = false
}

function onClickOutside(e: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    userMenuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <header class="site-header">
    <div class="bar">
      <NuxtLink to="/" class="logo">Annonces<span>TG</span></NuxtLink>

      <nav class="nav-links">
        <NuxtLink v-for="c in categories" :key="c.slug" :to="`/categorie/${c.slug}`">{{ c.name }}</NuxtLink>
      </nav>

      <div class="actions">
        <NuxtLink to="/favoris" class="btn-icon icon-link" aria-label="Favoris">
          <Icon name="heart" />
          <span v-if="favorites.count" class="badge">{{ favorites.count }}</span>
        </NuxtLink>

        <div v-if="loggedIn" class="user-menu" ref="userMenuRef">
          <button class="user-trigger" @click="userMenuOpen = !userMenuOpen">
            <img v-if="user?.avatarUrl" :src="user.avatarUrl" :alt="user?.name" class="avatar-img" />
            <span v-else class="avatar-fallback">{{ user?.name?.[0] || '?' }}</span>
            <span class="user-name">{{ user?.name }}</span>
            <Icon name="chevron-right" class="chevron" :class="{ open: userMenuOpen }" />
          </button>

          <div v-if="userMenuOpen" class="dropdown">
            <NuxtLink :to="`/vendeur/${user?.id}`" class="dropdown-item" @click="userMenuOpen = false">
              <Icon name="tag" /> Mon profil
            </NuxtLink>
            <NuxtLink to="/favoris" class="dropdown-item" @click="userMenuOpen = false">
              <Icon name="heart" /> Mes favoris
            </NuxtLink>
            <NuxtLink to="/publier" class="dropdown-item" @click="userMenuOpen = false">
              <Icon name="image" /> Publier une annonce
            </NuxtLink>
            <button class="dropdown-item danger" @click="logout">
              <Icon name="x" /> Se déconnecter
            </button>
          </div>
        </div>

        <button v-else class="login" @click="openAuthModal">Se connecter</button>

        <NuxtLink to="/publier" class="btn-primary">Publier une annonce</NuxtLink>
        <button class="btn-icon burger" @click="open = !open" aria-label="Menu">
          <Icon name="menu" />
        </button>
      </div>
    </div>

    <nav v-if="open" class="mobile-nav">
      <NuxtLink v-for="c in categories" :key="c.slug" :to="`/categorie/${c.slug}`" @click="open = false">{{ c.name }}</NuxtLink>
      <NuxtLink to="/favoris" @click="open = false">Favoris ({{ favorites.count }})</NuxtLink>
      <template v-if="loggedIn">
        <NuxtLink :to="`/vendeur/${user?.id}`" @click="open = false">Mon profil</NuxtLink>
        <button class="mobile-login" @click="logout">Déconnexion ({{ user?.name }})</button>
      </template>
      <button v-else class="mobile-login" @click="openAuthModal(); open = false">Se connecter</button>
      <NuxtLink to="/publier" @click="open = false">Publier une annonce</NuxtLink>
    </nav>
  </header>
</template>

<style scoped>
.site-header { position: sticky; top: 0; z-index: 20; background: var(--color-surface); border-bottom: 1px solid var(--color-border); }
.bar { max-width: 1100px; margin-inline: auto; padding: var(--space-sm) var(--space-md); display: flex; align-items: center; gap: var(--space-md); }
.logo { font-weight: 700; font-size: var(--step-1); color: var(--color-primary-ink); }
.logo span { color: var(--color-accent-ink); }
.nav-links { display: flex; gap: var(--space-md); margin-left: var(--space-md); flex: 1; }
.nav-links a { font-size: var(--step--1); color: var(--color-ink-soft); }
.nav-links a:hover { color: var(--color-primary-ink); }
.actions { display: flex; align-items: center; gap: var(--space-sm); }

.icon-link { position: relative; }
.badge {
  position: absolute; top: -6px; right: -8px; background: var(--color-coral); color: #fff;
  font-size: 10px; font-weight: 700; border-radius: 999px; min-width: 16px; height: 16px;
  display: flex; align-items: center; justify-content: center; padding: 0 3px;
}

.login {
  font-size: var(--step--1); font-weight: 600; padding: var(--space-xs) var(--space-md);
  border-radius: 13px; background: transparent; color: var(--color-primary-ink);
  border: 1.5px solid var(--color-primary);
  transition: background 0.15s var(--ease);
}
.login:hover { background: rgb(11 110 79 / 0.08); }

.user-menu { position: relative; }
.user-trigger {
  display: flex; align-items: center; gap: 6px;
  background: #f1f1f1; border-radius: 13px; padding: 4px 10px 4px 4px; border: none;
  transition: background 0.15s var(--ease);
}
.user-trigger:hover { background: #e8e8e8; }
.avatar-img { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; }
.avatar-fallback {
  width: 24px; height: 24px; border-radius: 50%; background: var(--color-primary); color: #fff;
  font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center;
}
.user-name { font-size: var(--step--1); font-weight: 500; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chevron { width: 11px; height: 11px; color: var(--color-ink-soft); transform: rotate(90deg); transition: transform 0.15s var(--ease); }
.chevron.open { transform: rotate(-90deg); }

.dropdown {
  position: absolute; top: calc(100% + 8px); right: 0; min-width: 200px;
  background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 13px;
  padding: 6px; box-shadow: 0 12px 32px -8px rgb(31 36 32 / 0.2); z-index: 30;
}
.dropdown-item {
  display: flex; align-items: center; gap: 8px; width: 100%; padding: var(--space-xs) var(--space-sm);
  border-radius: 10px; font-size: var(--step--1); color: var(--color-ink); background: none; border: none;
  text-align: left; transition: background 0.15s var(--ease);
}
.dropdown-item svg { width: 14px; height: 14px; color: var(--color-ink-soft); }
.dropdown-item:hover { background: #f1f1f1; }
.dropdown-item.danger { color: var(--color-danger); }
.dropdown-item.danger svg { color: var(--color-danger); }

.burger { display: none; }

@media (max-width: 720px) {
  .nav-links, .login, .user-menu { display: none; }
  .burger { display: flex; }
}
.mobile-nav { display: flex; flex-direction: column; padding: var(--space-sm) var(--space-md) var(--space-md); border-top: 1px solid var(--color-border); }
.mobile-nav a, .mobile-nav .mobile-login { padding: var(--space-xs) 0; font-size: var(--step-0); text-align: left; background: none; border: none; color: inherit; }
</style>
