import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession()
  if (to.meta.requiresAuth && !data.session) {
    next('/login')
  } else {
    next()
  }
})

export default router