<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { todoService, tagService } from '@/lib/database'

const todos = ref([])
const tags = ref([])
const loading = ref(false)
const error = ref(null)
const newTodoTitle = ref('')
const newTodoDescription = ref('')
const newTodoPriority = ref(2)
const newTodoDueDate = ref('')
const selectedTags = ref([])
const editingId = ref(null)
const editTitle = ref('')
const editDescription = ref('')
const filterStatus = ref('all')
const filterPriority = ref('all')
const filterTag = ref('all')

const user = ref(null)

const priorityLabels = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
}

const statusColors = {
  todo: '#3b82f6',
  in_progress: '#f59e0b',
  done: '#10b981',
}

const filteredTodos = computed(() => {
  return todos.value.filter(todo => {
    const statusMatch = filterStatus.value === 'all' || todo.status === filterStatus.value
    const priorityMatch = filterPriority.value === 'all' || String(todo.priority) === filterPriority.value
    const tagMatch = filterTag.value === 'all' || (todo.todo_tags && todo.todo_tags.some(t => t.tag_id === filterTag.value))
    return statusMatch && priorityMatch && tagMatch
  })
})

onMounted(async () => {
  await getUser()
  await fetchTodos()
  await fetchTags()
})

async function getUser() {
  const { data: { user: authUser } } = await supabase.auth.getUser()
  user.value = authUser
}

async function fetchTodos() {
  try {
    loading.value = true
    error.value = null
    if (user.value) {
      todos.value = await todoService.getTodos(user.value.id)
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function fetchTags() {
  try {
    if (user.value) {
      tags.value = await tagService.getTags(user.value.id)
    }
  } catch (err) {
    error.value = err.message
  }
}

async function addTodo() {
  if (!newTodoTitle.value.trim()) return

  try {
    const newTodo = await todoService.createTodo(user.value.id, {
      title: newTodoTitle.value,
      description: newTodoDescription.value,
      priority: newTodoPriority.value,
      due_date: newTodoDueDate.value || null,
      status: 'todo',
    })

    for (const tagId of selectedTags.value) {
      await todoService.addTagToTodo(newTodo.id, tagId)
    }

    newTodoTitle.value = ''
    newTodoDescription.value = ''
    newTodoPriority.value = 2
    newTodoDueDate.value = ''
    selectedTags.value = []

    await fetchTodos()
  } catch (err) {
    error.value = err.message
  }
}

async function updateTodo(todo) {
  try {
    await todoService.updateTodo(todo.id, {
      title: todo.title,
      description: todo.description,
      status: todo.status,
      priority: todo.priority,
      due_date: todo.due_date,
    })
    editingId.value = null
    await fetchTodos()
  } catch (err) {
    error.value = err.message
  }
}

async function toggleStatus(todo) {
  const statusCycle = ['todo', 'in_progress', 'done']
  const currentIndex = statusCycle.indexOf(todo.status)
  const newStatus = statusCycle[(currentIndex + 1) % statusCycle.length]
  
  try {
    await todoService.updateTodo(todo.id, { status: newStatus })
    await fetchTodos()
  } catch (err) {
    error.value = err.message
  }
}

async function deleteTodo(todoId) {
  try {
    await todoService.deleteTodo(todoId)
    await fetchTodos()
  } catch (err) {
    error.value = err.message
  }
}

function startEdit(todo) {
  editingId.value = todo.id
  editTitle.value = todo.title
  editDescription.value = todo.description
}

async function addNewTag() {
  const tagName = prompt('Enter tag name:')
  if (!tagName) return

  try {
    await tagService.createTag(user.value.id, tagName)
    await fetchTags()
  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
    <h1>My Todos</h1>

    <div v-if="error" style="color: #dc2626; margin: 10px 0; padding: 10px; background: #fee2e2; border-radius: 4px;">
      Error: {{ error }}
    </div>

    <!-- Filters -->
    <div style="margin: 20px 0; display: flex; gap: 10px; flex-wrap: wrap;">
      <select v-model="filterStatus" style="padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
        <option value="all">All Status</option>
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select v-model="filterPriority" style="padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
        <option value="all">All Priority</option>
        <option value="1">Low</option>
        <option value="2">Medium</option>
        <option value="3">High</option>
      </select>

      <select v-model="filterTag" style="padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
        <option value="all">All Tags</option>
        <option v-for="tag in tags" :key="tag.id" :value="tag.id">{{ tag.name }}</option>
      </select>
    </div>

    <!-- Add New Todo -->
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2>Add New Todo</h2>
      <input
        v-model="newTodoTitle"
        type="text"
        placeholder="Todo title"
        style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #d1d5db; border-radius: 4px; box-sizing: border-box;"
      />
      <textarea
        v-model="newTodoDescription"
        placeholder="Description (optional)"
        style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #d1d5db; border-radius: 4px; box-sizing: border-box; min-height: 80px;"
      ></textarea>
      <div style="display: flex; gap: 10px; margin: 10px 0;">
        <select v-model.number="newTodoPriority" style="padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;">
          <option value="1">Low Priority</option>
          <option value="2">Medium Priority</option>
          <option value="3">High Priority</option>
        </select>
        <input
          v-model="newTodoDueDate"
          type="datetime-local"
          style="padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;"
        />
      </div>
      <div style="margin: 10px 0;">
        <label>Tags:</label>
        <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px;">
          <label v-for="tag in tags" :key="tag.id">
            <input v-model="selectedTags" :value="tag.id" type="checkbox" />
            {{ tag.name }}
          </label>
          <button @click="addNewTag" style="padding: 5px 10px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
            + New Tag
          </button>
        </div>
      </div>
      <button
        @click="addTodo"
        style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;"
      >
        Add Todo
      </button>
    </div>

    <!-- Todos List -->
    <div>
      <h2>Todos ({{ filteredTodos.length }})</h2>
      <div v-if="loading">Loading...</div>
      <div v-else-if="filteredTodos.length === 0">
        <p style="color: #6b7280;">No todos found</p>
      </div>
      <div v-else>
        <div
          v-for="todo in filteredTodos"
          :key="todo.id"
          style="background: white; border: 1px solid #e5e7eb; border-left: 4px solid; border-left-color: v-bind('statusColors[todo.status]'); padding: 15px; margin: 10px 0; border-radius: 4px;"
        >
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div style="flex: 1;">
              <h3 style="margin: 0 0 5px 0;">
                <span
                  @click="toggleStatus(todo)"
                  :style="{ textDecoration: todo.status === 'done' ? 'line-through' : 'none', cursor: 'pointer', color: statusColors[todo.status] }"
                >
                  {{ todo.title }}
                </span>
              </h3>
              <p v-if="todo.description" style="margin: 5px 0; color: #6b7280;">{{ todo.description }}</p>
              <div style="display: flex; gap: 10px; margin: 10px 0; flex-wrap: wrap;">
                <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 0.875rem;">
                  {{ priorityLabels[todo.priority] }}
                </span>
                <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 0.875rem; text-transform: capitalize;">
                  {{ todo.status }}
                </span>
                <span v-if="todo.due_date" style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 0.875rem;">
                  Due: {{ new Date(todo.due_date).toLocaleDateString() }}
                </span>
              </div>
              <div v-if="todo.todo_tags && todo.todo_tags.length > 0" style="display: flex; gap: 5px; flex-wrap: wrap;">
                <span
                  v-for="tagRel in todo.todo_tags"
                  :key="tagRel.tag_id"
                  style="background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.875rem;"
                >
                  {{ tags.find(t => t.id === tagRel.tag_id)?.name }}
                </span>
              </div>
            </div>
            <div style="display: flex; gap: 5px;">
              <button
                @click="startEdit(todo)"
                style="padding: 5px 10px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;"
              >
                Edit
              </button>
              <button
                @click="deleteTodo(todo.id)"
                style="padding: 5px 10px; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer;"
              >
                Delete
              </button>
            </div>
          </div>

          <!-- Edit Mode -->
          <div v-if="editingId === todo.id" style="margin-top: 15px; padding: 15px; background: #f9fafb; border-radius: 4px;">
            <input
              v-model="editTitle"
              type="text"
              style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #d1d5db; border-radius: 4px; box-sizing: border-box;"
            />
            <textarea
              v-model="editDescription"
              style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #d1d5db; border-radius: 4px; box-sizing: border-box; min-height: 60px;"
            ></textarea>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
              <button
                @click="() => { todo.title = editTitle; todo.description = editDescription; updateTodo(todo); }"
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
