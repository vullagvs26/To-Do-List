import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "@/lib/supabase";
import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue";
import Todos from "@/views/Todos.vue";
import Tags from "@/views/Tags.vue";
import Profile from "@/views/Profile.vue";

const routes = [
  { path: "/", redirect: "/todos" },
  { path: "/login", component: Login },
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/todos", component: Todos, meta: { requiresAuth: true } },
  { path: "/tags", component: Tags, meta: { requiresAuth: true } },
  { path: "/profile", component: Profile, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession();
  if (to.meta.requiresAuth && !data.session) {
    next("/login");
  } else {
    next();
  }
});

export default router;
