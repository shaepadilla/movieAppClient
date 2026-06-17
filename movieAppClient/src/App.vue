<template>
  <ToastContainer />
  <FullPageLoader :visible="uiStore.isPageLoading" />

  <nav class="navbar" :class="{ 'navbar-transparent': isTransparent, 'navbar-solid': !isTransparent }">
    <router-link to="/" class="navbar-brand">▶ Reelz</router-link>

    <ul class="nav-center">
      <li><router-link to="/" exact-active-class="nav-active">Home</router-link></li>
      <li><router-link to="/movies" active-class="nav-active">Movies</router-link></li>
      <li><router-link to="/series" active-class="nav-active">Series</router-link></li>
      <li><router-link to="/my-list" active-class="nav-active">My List</router-link></li>
    </ul>

    <div class="nav-right">
      <button class="icon-btn" @click="router.push('/search')" aria-label="Search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </button>
      <button class="icon-btn" aria-label="Notifications">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </button>

      <template v-if="auth.isLoggedIn">
        <button class="user-avatar" @click="router.push('/profile')" title="My Profile">{{ userInitials }}</button>
      </template>
      <template v-else>
        <router-link to="/register" class="nav-text-link">Register</router-link>
        <router-link to="/login" class="btn-nav-login">Login</router-link>
      </template>
    </div>
  </nav>

  <router-view />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth } from './store/auth.js'
import { useUIStore } from './stores/ui.js'
import ToastContainer from './components/ToastContainer.vue'
import FullPageLoader from './components/FullPageLoader.vue'

const uiStore = useUIStore()

const route  = useRoute()
const router = useRouter()
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 50
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const isTransparent = computed(() => route.path === '/' && !scrolled.value)

const userInitials = computed(() => {
  if (!auth.token) return 'U'
  try {
    const payload = JSON.parse(atob(auth.token.split('.')[1]))
    const email = payload.email || ''
    return email.slice(0, 2).toUpperCase()
  } catch {
    return 'U'
  }
})
</script>

<style>
.navbar {
  position: sticky;
  top: 0;
  z-index: 200;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  transition: background 0.3s, border-color 0.3s;
}

.navbar-transparent {
  background: transparent;
  border-bottom: none;
}

.navbar-solid {
  background: #0d0d0f;
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.08);
}

.navbar-brand {
  font-size: 18px;
  font-weight: 600;
  color: var(--accent-red) !important;
  letter-spacing: -0.3px;
  flex-shrink: 0;
}

.nav-center {
  display: flex;
  list-style: none;
  gap: 4px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.nav-center a {
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: var(--radius-btn);
  transition: color 0.15s, background 0.15s;
}

.nav-center a:hover {
  color: var(--text-primary);
}

.nav-center a.nav-active,
.nav-center a.router-link-active {
  color: var(--text-primary);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 7px;
  border-radius: var(--radius-btn);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s;
}

.icon-btn:hover {
  color: var(--text-primary);
  background: var(--bg-elevated);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: var(--accent-red);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  font-family: inherit;
  transition: opacity 0.15s;
}

.user-avatar:hover {
  opacity: 0.85;
}

.nav-text-link {
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  padding: 6px 10px;
}

.nav-text-link:hover {
  color: var(--text-primary);
}

.btn-nav-login {
  background: var(--accent-red);
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: var(--radius-btn);
  transition: background 0.15s;
}

.btn-nav-login:hover {
  background: var(--accent-red-hover);
}

@media (max-width: 640px) {
  .nav-center {
    display: none;
  }
}
</style>
