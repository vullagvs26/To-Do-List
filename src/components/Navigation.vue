<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useDarkMode } from '@/composables/useDarkMode'

const route = useRoute()
const router = useRouter()
const { isDarkMode, toggleDarkMode } = useDarkMode()

const navItems = [
  { label: 'Todos', path: '/todos' },
  { label: 'Tags', path: '/tags' },
  { label: 'Profile', path: '/profile' },
  { label: 'Dashboard', path: '/dashboard' },
]

const isActive = (path) => route.path === path

const isAuth = computed(() => route.meta.requiresAuth)

async function handleLogout() {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>

<template>
  <nav v-if="isAuth" style="background: #1f2937; color: white; padding: 15px 0; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
    <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center;">
      <div style="font-weight: bold; font-size: 1.25rem;">Todo App</div>
      <div style="display: flex; gap: 20px; align-items: center;">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :style="{
            textDecoration: 'none',
            color: isActive(item.path) ? '#3b82f6' : 'white',
            fontWeight: isActive(item.path) ? 'bold' : 'normal',
            cursor: 'pointer',
            transition: 'color 0.2s'
          }"
        >
          {{ item.label }}
        </router-link>
        <button
          @click="toggleDarkMode"
          :title="isDarkMode ? 'Light Mode' : 'Dark Mode'"
          style="padding: 8px 12px; background: #374151; color: white; border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;"
          @mouseover="$event.target.style.background = '#4b5563'"
          @mouseout="$event.target.style.background = '#374151'"
        >
          <svg v-if="!isDarkMode" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 20px; height: 20px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 20px; height: 20px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>
        <button
          @click="handleLogout"
          style="padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer; transition: background 0.2s;"
          @mouseover="$event.target.style.background = '#b91c1c'"
          @mouseout="$event.target.style.background = '#dc2626'"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
a {
  transition: color 0.2s;
}

a:hover {
  color: #60a5fa;
}
</style>
