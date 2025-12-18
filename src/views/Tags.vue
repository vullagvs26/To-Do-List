<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { tagService } from '@/lib/database'
import { useDarkMode } from '@/composables/useDarkMode'
import PageWrapper from '@/components/PageWrapper.vue'

const { isDarkMode } = useDarkMode()
const tags = ref([])
const loading = ref(false)
const error = ref(null)
const newTagName = ref('')
const editingId = ref(null)
const editName = ref('')

const user = ref(null)

onMounted(async () => {
  await getUser()
  await fetchTags()
})

async function getUser() {
  const { data: { user: authUser } } = await supabase.auth.getUser()
  user.value = authUser
}

async function fetchTags() {
  try {
    loading.value = true
    error.value = null
    if (user.value) {
      tags.value = await tagService.getTags(user.value.id)
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function addTag() {
  if (!newTagName.value.trim()) return

  try {
    await tagService.createTag(user.value.id, newTagName.value)
    newTagName.value = ''
    await fetchTags()
  } catch (err) {
    error.value = err.message
  }
}

async function updateTag(tag) {
  try {
    await tagService.updateTag(tag.id, tag.name)
    editingId.value = null
    await fetchTags()
  } catch (err) {
    error.value = err.message
  }
}

async function deleteTag(tagId) {
  if (confirm('Are you sure you want to delete this tag?')) {
    try {
      await tagService.deleteTag(tagId)
      await fetchTags()
    } catch (err) {
      error.value = err.message
    }
  }
}

function startEdit(tag) {
  editingId.value = tag.id
  editName.value = tag.name
}
</script>

<template>
  <PageWrapper :isDarkMode="isDarkMode">
    <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
      <h1>Tags</h1>

      <div v-if="error" style="color: #dc2626; margin: 10px 0; padding: 10px; background: #fee2e2; border-radius: 4px;">
        Error: {{ error }}
      </div>

    <!-- Add New Tag -->
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2>Create New Tag</h2>
      <div style="display: flex; gap: 10px;">
        <input
          v-model="newTagName"
          type="text"
          placeholder="Tag name"
          style="flex: 1; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px;"
          @keyup.enter="addTag"
        />
        <button
          @click="addTag"
          style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;"
        >
          Create Tag
        </button>
      </div>
    </div>

    <!-- Tags List -->
    <div>
      <h2>Your Tags ({{ tags.length }})</h2>
      <div v-if="loading">Loading...</div>
      <div v-else-if="tags.length === 0">
        <p style="color: #6b7280;">No tags yet. Create one to organize your todos!</p>
      </div>
      <div v-else>
        <div
          v-for="tag in tags"
          :key="tag.id"
          style="background: white; border: 1px solid #e5e7eb; padding: 15px; margin: 10px 0; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;"
        >
          <div style="flex: 1;">
            <div v-if="editingId === tag.id" style="display: flex; gap: 10px;">
              <input
                v-model="editName"
                type="text"
                style="flex: 1; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;"
              />
              <button
                @click="() => { tag.name = editName; updateTag(tag); }"
                style="padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer;"
              >
                Save
              </button>
              <button
                @click="editingId = null"
                style="padding: 8px 16px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer;"
              >
                Cancel
              </button>
            </div>
            <div v-else>
              <h3 style="margin: 0;">{{ tag.name }}</h3>
              <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 0.875rem;">
                Created: {{ new Date(tag.created_at).toLocaleDateString() }}
              </p>
            </div>
          </div>
          <div v-if="editingId !== tag.id" style="display: flex; gap: 5px;">
            <button
              @click="startEdit(tag)"
              style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              Edit
            </button>
            <button
              @click="deleteTag(tag.id)"
              style="padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </PageWrapper>
</template>
