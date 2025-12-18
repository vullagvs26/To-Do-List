<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { profileService } from '@/lib/database'
import { useDarkMode } from '@/composables/useDarkMode'
import PageWrapper from '@/components/PageWrapper.vue'

const { isDarkMode } = useDarkMode()
const user = ref(null)
const profile = ref(null)
const loading = ref(false)
const error = ref(null)
const success = ref(null)
const isEditing = ref(false)
const formData = ref({
  username: '',
  full_name: '',
  avatar_url: '',
})

onMounted(async () => {
  await getUser()
  await fetchProfile()
})

async function getUser() {
  const { data: { user: authUser } } = await supabase.auth.getUser()
  user.value = authUser
}

async function fetchProfile() {
  try {
    loading.value = true
    error.value = null
    if (user.value) {
      profile.value = await profileService.getProfile(user.value.id)
      if (profile.value) {
        formData.value = {
          username: profile.value.username || '',
          full_name: profile.value.full_name || '',
          avatar_url: profile.value.avatar_url || '',
        }
      }
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  try {
    error.value = null
    success.value = null

    if (!formData.value.username.trim()) {
      error.value = 'Username is required'
      return
    }

    if (profile.value) {
      // Update existing profile
      await profileService.updateProfile(user.value.id, formData.value)
    } else {
      // Create new profile
      await profileService.createProfile(user.value.id, formData.value.username)
      // Update with full data
      await profileService.updateProfile(user.value.id, formData.value)
    }

    success.value = 'Profile saved successfully!'
    isEditing.value = false
    await fetchProfile()
    setTimeout(() => {
      success.value = null
    }, 3000)
  } catch (err) {
    error.value = err.message
  }
}

function cancelEdit() {
  if (profile.value) {
    formData.value = {
      username: profile.value.username || '',
      full_name: profile.value.full_name || '',
      avatar_url: profile.value.avatar_url || '',
    }
  }
  isEditing.value = false
}

async function logout() {
  try {
    await supabase.auth.signOut()
    // Router will redirect to login
  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <PageWrapper :isDarkMode="isDarkMode">
    <div style="padding: 20px; max-width: 600px; margin: 0 auto;">
      <h1>Profile</h1>

      <div v-if="error" style="color: #dc2626; margin: 10px 0; padding: 10px; background: #fee2e2; border-radius: 4px;">
        Error: {{ error }}
      </div>

      <div v-if="success" style="color: #059669; margin: 10px 0; padding: 10px; background: #d1fae5; border-radius: 4px;">
        {{ success }}
      </div>

      <div v-if="loading" style="text-align: center; padding: 20px;">
        Loading...
      </div>

      <div v-else style="background: white; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
        <!-- User Email Info -->
        <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb;">
        <label style="display: block; color: #6b7280; font-size: 0.875rem; font-weight: 500; margin-bottom: 5px;">
          Email
        </label>
        <p style="margin: 0; font-size: 1.125rem;">{{ user?.email }}</p>
        </div>

        <!-- Display Mode -->
        <div v-if="!isEditing">
        <div style="margin-bottom: 15px;">
          <label style="display: block; color: #6b7280; font-size: 0.875rem; font-weight: 500; margin-bottom: 5px;">
            Username
          </label>
          <p style="margin: 0; font-size: 1.125rem;">
            {{ profile?.username || 'Not set' }}
          </p>
        </div>

        <div style="margin-bottom: 15px;">
          <label style="display: block; color: #6b7280; font-size: 0.875rem; font-weight: 500; margin-bottom: 5px;">
            Full Name
          </label>
          <p style="margin: 0; font-size: 1.125rem;">
            {{ profile?.full_name || 'Not set' }}
          </p>
        </div>

        <div style="margin-bottom: 15px;">
          <label style="display: block; color: #6b7280; font-size: 0.875rem; font-weight: 500; margin-bottom: 5px;">
            Avatar URL
          </label>
          <p style="margin: 0; font-size: 0.875rem; word-break: break-all;">
            {{ profile?.avatar_url || 'Not set' }}
          </p>
          <img v-if="profile?.avatar_url" :src="profile.avatar_url" style="max-width: 150px; margin-top: 10px; border-radius: 8px;" alt="Avatar" />
        </div>

        <div style="margin-bottom: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
          <label style="display: block; color: #6b7280; font-size: 0.875rem; font-weight: 500; margin-bottom: 5px;">
            Member Since
          </label>
          <p style="margin: 0; font-size: 0.875rem;">
            {{ profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown' }}
          </p>
        </div>

        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button
            @click="isEditing = true"
            style="padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;"
          >
            Edit Profile
          </button>
          <button
            @click="logout"
            style="padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;"
          >
            Logout
          </button>
        </div>
        </div>

        <!-- Edit Mode -->
        <div v-else>
        <div style="margin-bottom: 15px;">
          <label style="display: block; color: #6b7280; font-size: 0.875rem; font-weight: 500; margin-bottom: 5px;">
            Username
          </label>
          <input
            v-model="formData.username"
            type="text"
            style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px; box-sizing: border-box;"
          />
        </div>

        <div style="margin-bottom: 15px;">
          <label style="display: block; color: #6b7280; font-size: 0.875rem; font-weight: 500; margin-bottom: 5px;">
            Full Name
          </label>
          <input
            v-model="formData.full_name"
            type="text"
            style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px; box-sizing: border-box;"
          />
        </div>

        <div style="margin-bottom: 15px;">
          <label style="display: block; color: #6b7280; font-size: 0.875rem; font-weight: 500; margin-bottom: 5px;">
            Avatar URL
          </label>
          <input
            v-model="formData.avatar_url"
            type="url"
            placeholder="https://example.com/avatar.jpg"
            style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px; box-sizing: border-box;"
          />
          <img v-if="formData.avatar_url" :src="formData.avatar_url" style="max-width: 150px; margin-top: 10px; border-radius: 8px;" alt="Avatar Preview" />
        </div>

        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button
            @click="saveProfile"
            style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;"
          >
            Save Profile
          </button>
          <button
            @click="cancelEdit"
            style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;"
          >
            Cancel
          </button>
        </div>
      </div>
      </div>
    </div>
  </PageWrapper>
</template>
