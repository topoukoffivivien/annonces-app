<script setup lang="ts">
const { categories } = useCategories()
const favorites = useFavoritesStore()
const { open: openAuthModal } = useAuthModal()
const { loggedIn, user, clear } = useUserSession()
const route = useRoute()
const open = ref(false)
const userMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

function isActiveCategory(slug: string) {
  return route.path === `/categorie/${slug}`
}

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

// Empêche le scroll de la page derrière le menu mobile plein écran
watch(open, (val) => {
  if (import.meta.client) {
    document.body.style.overflow = val ? 'hidden' : ''
  }
})

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <header class="site-header">
    <div class="bar">
      <NuxtLink to="/" class="logo">
        <span class="logo-badge">AT</span>
        <span class="logo-text">Annonces<em>TG</em></span>
      </NuxtLink>

      <nav class="nav-links">
        <NuxtLink
          v-for="c in categories"
          :key="c.slug"
          :to="`/categorie/${c.slug}`"
          :class="{ active: isActiveCategory(c.slug) }"
        >
          {{ c.name }}
        </NuxtLink>
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

          <Transition name="dropdown">
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
          </Transition>
        </div>

        <button v-else class="login" @click="openAuthModal">Se connecter</button>

        <NuxtLink to="/publier" class="btn-primary">Publier une annonce</NuxtLink>
        <button class="btn-icon burger" @click="open = !open" aria-label="Menu">
          <Icon name="menu" />
        </button>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="mobile-menu">
        <div v-if="open" class="mobile-overlay">
          <div class="mobile-panel">
            <div class="mobile-top">
              <NuxtLink to="/" class="logo" @click="open = false">
                <span class="logo-badge">AT</span>
                <span class="logo-text">Annonces<em>TG</em></span>
              </NuxtLink>
              <button class="btn-icon" @click="open = false" aria-label="Fermer"><Icon name="x" /></button>
            </div>

            <div v-if="loggedIn" class="mobile-account">
              <img v-if="user?.avatarUrl" :src="user.avatarUrl" :alt="user?.name" class="avatar-img lg" />
              <span v-else class="avatar-fallback lg">{{ user?.name?.[0] || '?' }}</span>
              <div>
                <p class="mobile-account-name">{{ user?.name }}</p>
                <NuxtLink :to="`/vendeur/${user?.id}`" class="mobile-account-link" @click="open = false">Voir mon profil</NuxtLink>
              </div>
            </div>
            <button v-else class="mobile-cta" @click="openAuthModal(); open = false">
              <Icon name="lock" /> Se connecter / Créer un compte
            </button>

            <p class="mobile-section-title">Catégories</p>
            <nav class="mobile-links">
              <NuxtLink
                v-for="c in categories"
                :key="c.slug"
                :to="`/categorie/${c.slug}`"
                class="mobile-link"
                :class="{ active: isActiveCategory(c.slug) }"
                @click="open = false"
              >
                <Icon :name="c.icon" /> {{ c.name }}
              </NuxtLink>
            </nav>

            <p class="mobile-section-title">Mon compte</p>
            <nav class="mobile-links">
              <NuxtLink to="/favoris" class="mobile-link" @click="open = false">
                <Icon name="heart" /> Favoris
                <span v-if="favorites.count" class="mobile-link-badge">{{ favorites.count }}</span>
              </NuxtLink>
              <button v-if="loggedIn" class="mobile-link danger" @click="logout">
                <Icon name="x" /> Se déconnecter
              </button>
            </nav>

            <NuxtLink to="/publier" class="btn-primary mobile-publish" @click="open = false">
              <Icon name="image" /> Publier une annonce
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<style scoped>
.site-header { position: sticky; top: 0; z-index: 20; background: var(--color-surface); border-bottom: 1px solid var(--color-border); }
.bar { max-width: 1100px; margin-inline: auto; padding: var(--space-sm) var(--space-md); display: flex; align-items: center; gap: var(--space-md); }

.logo { display: flex; align-items: center; gap: var(--space-xs); text-decoration: none; }
.logo-badge {
  width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-ink));
  color: #fff; font-weight: 700; font-size: 12px;
  display: flex; align-items: center; justify-content: center;
}
.logo-text { font-weight: 700; font-size: var(--step-1); color: var(--color-primary-ink); }
.logo-text em { font-style: normal; color: var(--color-accent-ink); }

.nav-links { display: flex; gap: var(--space-md); margin-left: var(--space-sm); flex: 1; }
.nav-links a {
  position: relative; font-size: var(--step--1); color: var(--color-ink-soft); padding: 4px 0;
}
.nav-links a::after {
  content: ''; position: absolute; left: 0; right: 100%; bottom: 0; height: 2px;
  background: var(--color-primary); border-radius: 2px; transition: right 0.2s var(--ease);
}
.nav-links a:hover { color: var(--color-primary-ink); }
.nav-links a:hover::after, .nav-links a.active::after { right: 0; }
.nav-links a.active { color: var(--color-primary-ink); font-weight: 600; }

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
.avatar-img.lg, .avatar-fallback.lg { width: 44px; height: 44px; font-size: 16px; }
.user-name { font-size: var(--step--1); font-weight: 500; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chevron { width: 11px; height: 11px; color: var(--color-ink-soft); transform: rotate(90deg); transition: transform 0.15s var(--ease); }
.chevron.open { transform: rotate(-90deg); }

.dropdown {
  position: absolute; top: calc(100% + 8px); right: 0; min-width: 200px;
  background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 13px;
  padding: 6px; box-shadow: 0 12px 32px -8px rgb(31 36 32 / 0.2); z-index: 30;
}
.dropdown-enter-active, .dropdown-leave-active { transition: opacity 0.15s var(--ease), transform 0.15s var(--ease); }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-4px); }
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
  .nav-links, .login, .user-menu, .actions > .btn-primary { display: none; }
  .burger { display: flex; }
}

/* Menu mobile plein écran */
.mobile-overlay {
  position: fixed; inset: 0; z-index: 100; background: rgb(31 36 32 / 0.4);
  display: flex; justify-content: flex-end;
}
.mobile-panel {
  width: min(340px, 88vw); height: 100%; background: var(--color-surface);
  padding: var(--space-md); display: flex; flex-direction: column; gap: var(--space-md);
  overflow-y: auto;
}
.mobile-top { display: flex; align-items: center; justify-content: space-between; }

.mobile-account { display: flex; align-items: center; gap: var(--space-sm); }
.mobile-account-name { font-weight: 600; margin: 0; }
.mobile-account-link { font-size: var(--step--1); color: var(--color-primary-ink); }

.mobile-cta {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  background: rgb(11 110 79 / 0.08); color: var(--color-primary-ink); border: none;
  border-radius: 13px; padding: var(--space-sm); font-weight: 600; font-size: var(--step--1);
}
.mobile-cta svg { width: 16px; height: 16px; }

.mobile-section-title {
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-ink-soft);
  margin: 0;
}
.mobile-links { display: flex; flex-direction: column; gap: 2px; }
.mobile-link {
  display: flex; align-items: center; gap: 10px; padding: var(--space-sm) var(--space-xs);
  border-radius: 10px; font-size: var(--step-0); color: var(--color-ink); background: none; border: none;
  text-align: left; width: 100%;
}
.mobile-link svg { width: 17px; height: 17px; color: var(--color-ink-soft); flex-shrink: 0; }
.mobile-link.active { background: rgb(11 110 79 / 0.08); color: var(--color-primary-ink); font-weight: 600; }
.mobile-link.active svg { color: var(--color-primary-ink); }
.mobile-link.danger { color: var(--color-danger); }
.mobile-link.danger svg { color: var(--color-danger); }
.mobile-link-badge {
  margin-left: auto; background: var(--color-coral); color: #fff; font-size: 10px; font-weight: 700;
  border-radius: 999px; min-width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; padding: 0 5px;
}

.mobile-publish { margin-top: auto; justify-content: center; }

.mobile-menu-enter-active, .mobile-menu-leave-active { transition: opacity 0.2s var(--ease); }
.mobile-menu-enter-from, .mobile-menu-leave-to { opacity: 0; }
.mobile-menu-enter-active .mobile-panel, .mobile-menu-leave-active .mobile-panel { transition: transform 0.2s var(--ease); }
.mobile-menu-enter-from .mobile-panel, .mobile-menu-leave-to .mobile-panel { transform: translateX(100%); }
</style>
