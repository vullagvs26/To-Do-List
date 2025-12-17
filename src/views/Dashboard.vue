<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)

const logout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}

const getCurrentUser = async () => {
  const { data: { user: authUser } } = await supabase.auth.getUser()
  user.value = authUser
}

onMounted(() => {
  getCurrentUser()
})
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
    <!-- Header -->
    <header class="flex justify-between items-center mb-6 bg-white rounded-2xl shadow-lg p-6">
      <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
      <button 
        @click="logout"
        class="px-5 py-2 bg-red-500 text-white font-semibold rounded-xl shadow hover:bg-red-600 transition-all"
      >
        Logout
      </button>
    </header>

    <!-- Welcome Card -->
    <div class="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">
        Welcome, <span class="text-indigo-500">{{ user?.email }}</span>!
      </h2>
      <p class="text-gray-600 mb-4">
        You are successfully logged in to Supabase.
      </p>

      <!-- Example dashboard content -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div class="bg-indigo-50 p-6 rounded-xl shadow hover:shadow-md transition-shadow">
          <h3 class="text-lg font-semibold text-indigo-600 mb-2">To-Do Stats</h3>
          <p class="text-gray-600">You have 5 tasks pending today.</p>
        </div>
        <div class="bg-purple-50 p-6 rounded-xl shadow hover:shadow-md transition-shadow">
          <h3 class="text-lg font-semibold text-purple-600 mb-2">Quick Actions</h3>
          <p class="text-gray-600">Add a new task or check completed tasks.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional fade-in animation for dashboard */
@keyframes fade-in {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>
