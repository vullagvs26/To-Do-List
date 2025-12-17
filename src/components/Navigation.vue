<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const route = useRoute()
const router = useRouter()

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
          @click="handleLogout"
          style="padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer;"
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
