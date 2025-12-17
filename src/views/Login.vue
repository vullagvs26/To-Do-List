<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

const login = async () => {
  loading.value = true
  error.value = null
  const email = username.value
  console.log('Attempting login with:', email)

  const { error: err } = await supabase.auth.signInWithPassword({
    email,
    password: password.value
  })

  console.log('Login error:', err)
  if (err) {
    error.value = err.message
  } else {
    router.push('/dashboard')
  }
  loading.value = false
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500">
    <div class="relative bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md animate-fade-in">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">Welcome Back</h1>

      <form @submit.prevent="login" class="space-y-6">
        <div class="relative">
          <input
            id="email"
            v-model="username"
            type="email"
            placeholder=" "
            required
            class="peer w-full border-b-2 border-gray-300 focus:border-indigo-500 outline-none py-2 text-gray-700 placeholder-transparent transition-colors"
          />
          <label
            for="email"
            class="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-indigo-500 peer-focus:text-sm"
          >
            Email
          </label>
        </div>

        <div class="relative">
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder=" "
            required
            class="peer w-full border-b-2 border-gray-300 focus:border-indigo-500 outline-none py-2 text-gray-700 placeholder-transparent transition-colors"
          />
          <label
            for="password"
            class="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-indigo-500 peer-focus:text-sm"
          >
            Password
          </label>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-indigo-500 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <div v-if="error" class="mt-6 text-center text-red-600 font-medium bg-red-100 p-2 rounded-md">
        {{ error }}
      </div>

      <p class="mt-6 text-center text-gray-500 text-sm">
        Don't have an account? <a href="#" class="text-indigo-500 hover:underline">Sign up</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}
</style>
