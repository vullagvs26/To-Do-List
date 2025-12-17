<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  todos: {
    type: Array,
    required: true
  },
  tags: {
    type: Array,
    default: () => []
  },
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-status', 'edit', 'delete'])

const sortKey = ref('created_at')
const sortOrder = ref('desc')

const priorityLabels = {
  1: 'Low',
  2: 'Medium',
  3: 'High'
}

const statusLabels = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done'
}

const sortedTodos = computed(() => {
  const sorted = [...props.todos].sort((a, b) => {
    let aVal = a[sortKey.value]
    let bVal = b[sortKey.value]

    // Handle special cases
    if (sortKey.value === 'priority') {
      aVal = a.priority || 0
      bVal = b.priority || 0
    } else if (sortKey.value === 'title') {
      aVal = (a.title || '').toLowerCase()
      bVal = (b.title || '').toLowerCase()
    } else if (sortKey.value === 'due_date') {
      aVal = a.due_date ? new Date(a.due_date).getTime() : 0
      bVal = b.due_date ? new Date(b.due_date).getTime() : 0
    }

    if (sortOrder.value === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
    }
  })

  return sorted
})

const setSortKey = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const getSortIcon = (key) => {
  if (sortKey.value !== key) return '↕'
  return sortOrder.value === 'asc' ? '↑' : '↓'
}

const getTagName = (tagId) => {
  const tag = props.tags.find(t => t.id === tagId)
  return tag ? tag.name : ''
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const getStatusColor = (status) => {
  const colors = {
    todo: props.isDarkMode ? '#3b82f6' : '#2563eb',
    in_progress: props.isDarkMode ? '#f59e0b' : '#d97706',
    done: props.isDarkMode ? '#10b981' : '#059669'
  }
  return colors[status] || '#6b7280'
}
</script>

<template>
  <div class="table-container" :class="{ 'dark-mode': isDarkMode }">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th @click="setSortKey('title')" class="sortable">
              Task Name {{ getSortIcon('title') }}
            </th>
            <th @click="setSortKey('status')" class="sortable">
              Status {{ getSortIcon('status') }}
            </th>
            <th @click="setSortKey('priority')" class="sortable">
              Priority {{ getSortIcon('priority') }}
            </th>
            <th @click="setSortKey('due_date')" class="sortable">
              Due Date {{ getSortIcon('due_date') }}
            </th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="sortedTodos.length === 0">
            <td colspan="6" class="no-data">No tasks found</td>
          </tr>
          <tr v-for="todo in sortedTodos" :key="todo.id">
            <td class="task-title">
              <span :class="{ 'line-through': todo.status === 'done' }">
                {{ todo.title }}
              </span>
              <p v-if="todo.description" class="task-description">
                {{ todo.description.substring(0, 50) }}{{ todo.description.length > 50 ? '...' : '' }}
              </p>
            </td>
            <td>
              <span 
                class="status-badge"
                :style="{ backgroundColor: getStatusColor(todo.status) }"
                @click="emit('toggle-status', todo)"
              >
                {{ statusLabels[todo.status] }}
              </span>
            </td>
            <td>
              <span class="priority-badge" :class="`priority-${todo.priority}`">
                {{ priorityLabels[todo.priority] }}
              </span>
            </td>
            <td>{{ formatDate(todo.due_date) }}</td>
            <td>
              <div class="tags-cell">
                <span
                  v-for="tagRel in (todo.todo_tags || [])"
                  :key="tagRel.tag_id"
                  class="tag-badge"
                >
                  {{ getTagName(tagRel.tag_id) }}
                </span>
                <span v-if="!todo.todo_tags || todo.todo_tags.length === 0" class="no-tags">
                  No tags
                </span>
              </div>
            </td>
            <td class="actions-cell">
              <button @click="emit('edit', todo)" class="btn btn-edit">
                Edit
              </button>
              <button @click="emit('delete', todo.id)" class="btn btn-delete">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-container.dark-mode {
  background: #1f2937;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

thead {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.dark-mode thead {
  background: #111827;
  border-bottom: 2px solid #374151;
}

th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark-mode th {
  color: #e5e7eb;
}

th.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
}

th.sortable:hover {
  background: #f3f4f6;
}

.dark-mode th.sortable:hover {
  background: #1f2937;
}

td {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  color: #6b7280;
  font-size: 0.875rem;
}

.dark-mode td {
  border-bottom: 1px solid #374151;
  color: #9ca3af;
}

tbody tr:hover {
  background: #f9fafb;
}

.dark-mode tbody tr:hover {
  background: #111827;
}

.task-title {
  font-weight: 500;
  color: #111827;
}

.dark-mode .task-title {
  color: #f3f4f6;
}

.task-title .line-through {
  text-decoration: line-through;
  opacity: 0.6;
}

.task-description {
  margin: 4px 0 0 0;
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: normal;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: opacity 0.2s;
}

.status-badge:hover {
  opacity: 0.8;
}

.priority-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.priority-badge.priority-1 {
  background: #d1fae5;
  color: #065f46;
}

.dark-mode .priority-badge.priority-1 {
  background: #064e3b;
  color: #6ee7b7;
}

.priority-badge.priority-2 {
  background: #dbeafe;
  color: #1e40af;
}

.dark-mode .priority-badge.priority-2 {
  background: #1e3a8a;
  color: #93c5fd;
}

.priority-badge.priority-3 {
  background: #fee2e2;
  color: #991b1b;
}

.dark-mode .priority-badge.priority-3 {
  background: #7f1d1d;
  color: #fca5a5;
}

.tags-cell {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tag-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
}

.no-tags {
  color: #9ca3af;
  font-style: italic;
  font-size: 0.75rem;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit {
  background: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background: #2563eb;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
}

.no-data {
  text-align: center;
  padding: 40px 16px;
  color: #9ca3af;
  font-style: italic;
}

@media (max-width: 768px) {
  .table-container {
    padding: 12px;
  }
  
  th, td {
    padding: 8px 12px;
    font-size: 0.8rem;
  }
  
  .actions-cell {
    flex-direction: column;
  }
}
</style>
