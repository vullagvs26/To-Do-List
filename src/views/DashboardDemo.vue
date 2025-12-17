<script setup>
import { ref, computed } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'
import StatusBarChart from '@/components/charts/StatusBarChart.vue'
import PriorityPieChart from '@/components/charts/PriorityPieChart.vue'
import TaskFilters from '@/components/TaskFilters.vue'
import TaskTable from '@/components/TaskTable.vue'

const { isDarkMode, toggleDarkMode } = useDarkMode()

// Mock data for demonstration
const todos = ref([
  {
    id: 1,
    title: 'Design new landing page',
    description: 'Create mockups and wireframes for the new landing page',
    status: 'in_progress',
    priority: 3,
    due_date: '2025-12-20T00:00:00',
    todo_tags: [{ tag_id: 1 }],
    created_at: '2025-12-15T00:00:00'
  },
  {
    id: 2,
    title: 'Fix authentication bug',
    description: 'Users are unable to login with social accounts',
    status: 'todo',
    priority: 3,
    due_date: '2025-12-18T00:00:00',
    todo_tags: [{ tag_id: 2 }],
    created_at: '2025-12-16T00:00:00'
  },
  {
    id: 3,
    title: 'Write API documentation',
    description: 'Document all REST API endpoints with examples',
    status: 'done',
    priority: 2,
    due_date: '2025-12-15T00:00:00',
    todo_tags: [{ tag_id: 3 }],
    created_at: '2025-12-10T00:00:00'
  },
  {
    id: 4,
    title: 'Update dependencies',
    description: 'Update all npm packages to latest versions',
    status: 'todo',
    priority: 1,
    due_date: '2025-12-25T00:00:00',
    todo_tags: [{ tag_id: 4 }],
    created_at: '2025-12-14T00:00:00'
  },
  {
    id: 5,
    title: 'Implement search functionality',
    description: 'Add full-text search for all resources',
    status: 'in_progress',
    priority: 2,
    due_date: '2025-12-22T00:00:00',
    todo_tags: [{ tag_id: 1 }, { tag_id: 2 }],
    created_at: '2025-12-17T00:00:00'
  },
  {
    id: 6,
    title: 'Code review for PR #123',
    description: 'Review and provide feedback on the new feature implementation',
    status: 'done',
    priority: 2,
    due_date: '2025-12-16T00:00:00',
    todo_tags: [{ tag_id: 2 }],
    created_at: '2025-12-16T00:00:00'
  },
  {
    id: 7,
    title: 'Optimize database queries',
    description: 'Improve performance by adding indexes and optimizing slow queries',
    status: 'todo',
    priority: 3,
    due_date: '2025-12-19T00:00:00',
    todo_tags: [{ tag_id: 4 }],
    created_at: '2025-12-15T00:00:00'
  },
  {
    id: 8,
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment',
    status: 'done',
    priority: 2,
    due_date: '2025-12-14T00:00:00',
    todo_tags: [{ tag_id: 4 }],
    created_at: '2025-12-12T00:00:00'
  }
])

const tags = ref([
  { id: 1, name: 'Design' },
  { id: 2, name: 'Bug' },
  { id: 3, name: 'Documentation' },
  { id: 4, name: 'DevOps' }
])

// View toggles
const currentView = ref('overview')

// Filter states
const filters = ref({
  status: 'all',
  priority: 'all',
  tag: 'all',
  dueDate: 'all'
})
const searchQuery = ref('')

// Edit modal state
const editingTodo = ref(null)
const editTitle = ref('')
const editDescription = ref('')

// Computed statistics
const stats = computed(() => {
  const total = todos.value.length
  const completed = todos.value.filter(t => t.status === 'done').length
  const inProgress = todos.value.filter(t => t.status === 'in_progress').length
  const pending = todos.value.filter(t => t.status === 'todo').length
  const overdue = todos.value.filter(t => {
    if (!t.due_date || t.status === 'done') return false
    return new Date(t.due_date) < new Date()
  }).length

  return {
    total,
    completed,
    inProgress,
    pending,
    overdue,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
  }
})

// Filtered todos based on search and filters
const filteredTodos = computed(() => {
  let filtered = [...todos.value]

  // Apply search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(todo => 
      todo.title.toLowerCase().includes(query) ||
      (todo.description && todo.description.toLowerCase().includes(query))
    )
  }

  // Apply status filter
  if (filters.value.status !== 'all') {
    filtered = filtered.filter(t => t.status === filters.value.status)
  }

  // Apply priority filter
  if (filters.value.priority !== 'all') {
    filtered = filtered.filter(t => String(t.priority) === filters.value.priority)
  }

  // Apply tag filter
  if (filters.value.tag !== 'all') {
    filtered = filtered.filter(t => 
      t.todo_tags && t.todo_tags.some(tag => tag.tag_id === filters.value.tag)
    )
  }

  // Apply due date filter
  if (filters.value.dueDate !== 'all') {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

    filtered = filtered.filter(t => {
      if (!t.due_date) return false
      const dueDate = new Date(t.due_date)

      switch (filters.value.dueDate) {
        case 'overdue':
          return dueDate < now && t.status !== 'done'
        case 'today':
          return dueDate >= today && dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
        case 'week':
          return dueDate >= today && dueDate < weekFromNow
        case 'month':
          return dueDate >= today && dueDate < monthFromNow
        default:
          return true
      }
    })
  }

  return filtered
})

const updateFilters = (newFilters) => {
  filters.value = newFilters
}

const updateSearch = (query) => {
  searchQuery.value = query
}

const toggleStatus = (todo) => {
  const statusCycle = ['todo', 'in_progress', 'done']
  const currentIndex = statusCycle.indexOf(todo.status)
  const newStatus = statusCycle[(currentIndex + 1) % statusCycle.length]
  todo.status = newStatus
}

const startEdit = (todo) => {
  editingTodo.value = todo
  editTitle.value = todo.title
  editDescription.value = todo.description || ''
}

const saveEdit = () => {
  if (!editingTodo.value) return
  editingTodo.value.title = editTitle.value
  editingTodo.value.description = editDescription.value
  editingTodo.value = null
}

const cancelEdit = () => {
  editingTodo.value = null
  editTitle.value = ''
  editDescription.value = ''
}

const deleteTodo = (todoId) => {
  if (!confirm('Are you sure you want to delete this task?')) return
  const index = todos.value.findIndex(t => t.id === todoId)
  if (index > -1) {
    todos.value.splice(index, 1)
  }
}
</script>

<template>
  <div class="dashboard-container" :class="{ 'dark': isDarkMode }">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">Dashboard Demo</h1>
        <div class="header-actions">
          <button @click="toggleDarkMode" class="icon-btn" :title="isDarkMode ? 'Light Mode' : 'Dark Mode'">
            <svg v-if="!isDarkMode" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <div class="dashboard-content">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: #dbeafe;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#3b82f6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Tasks</p>
            <p class="stat-value">{{ stats.total }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #d1fae5;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#10b981">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">Completed</p>
            <p class="stat-value">{{ stats.completed }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #fed7aa;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#f59e0b">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">In Progress</p>
            <p class="stat-value">{{ stats.inProgress }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #fee2e2;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#ef4444">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="stat-content">
            <p class="stat-label">Overdue</p>
            <p class="stat-value">{{ stats.overdue }}</p>
          </div>
        </div>

        <div class="stat-card stat-card-wide">
          <div class="stat-content">
            <p class="stat-label">Completion Rate</p>
            <div class="progress-container">
              <div class="progress-bar" :style="{ width: stats.completionRate + '%' }"></div>
            </div>
            <p class="stat-value">{{ stats.completionRate }}%</p>
          </div>
        </div>
      </div>

      <!-- View Toggle -->
      <div class="view-toggle">
        <button 
          @click="currentView = 'overview'"
          :class="{ 'active': currentView === 'overview' }"
          class="view-btn"
        >
          Overview
        </button>
        <button 
          @click="currentView = 'charts'"
          :class="{ 'active': currentView === 'charts' }"
          class="view-btn"
        >
          Charts
        </button>
        <button 
          @click="currentView = 'table'"
          :class="{ 'active': currentView === 'table' }"
          class="view-btn"
        >
          Table
        </button>
      </div>

      <!-- Filters -->
      <TaskFilters 
        :tags="tags" 
        :isDarkMode="isDarkMode"
        @update:filters="updateFilters"
        @update:search="updateSearch"
      />

      <!-- Overview View -->
      <div v-if="currentView === 'overview'" class="view-content">
        <div class="charts-grid">
          <div class="chart-card">
            <StatusBarChart :todos="filteredTodos" :isDarkMode="isDarkMode" />
          </div>
          <div class="chart-card">
            <PriorityPieChart :todos="filteredTodos" :isDarkMode="isDarkMode" />
          </div>
        </div>

        <div class="recent-tasks">
          <h3 class="section-title">Recent Tasks ({{ filteredTodos.slice(0, 5).length }})</h3>
          <div v-if="filteredTodos.length === 0" class="empty-state">
            <p>No tasks found. Try adjusting your filters.</p>
          </div>
          <div v-else class="task-list">
            <div 
              v-for="todo in filteredTodos.slice(0, 5)" 
              :key="todo.id"
              class="task-item"
            >
              <div class="task-item-header">
                <h4 :class="{ 'line-through': todo.status === 'done' }">{{ todo.title }}</h4>
                <span class="task-status" :class="`status-${todo.status}`">
                  {{ todo.status.replace('_', ' ') }}
                </span>
              </div>
              <p v-if="todo.description" class="task-description">{{ todo.description }}</p>
              <div class="task-meta">
                <span class="priority-badge" :class="`priority-${todo.priority}`">
                  {{ todo.priority === 1 ? 'Low' : todo.priority === 2 ? 'Medium' : 'High' }}
                </span>
                <span v-if="todo.due_date" class="due-date">
                  Due: {{ new Date(todo.due_date).toLocaleDateString() }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts View -->
      <div v-if="currentView === 'charts'" class="view-content">
        <div class="charts-grid-full">
          <div class="chart-card-large">
            <StatusBarChart :todos="filteredTodos" :isDarkMode="isDarkMode" />
          </div>
          <div class="chart-card-large">
            <PriorityPieChart :todos="filteredTodos" :isDarkMode="isDarkMode" />
          </div>
        </div>
      </div>

      <!-- Table View -->
      <div v-if="currentView === 'table'" class="view-content">
        <TaskTable 
          :todos="filteredTodos"
          :tags="tags"
          :isDarkMode="isDarkMode"
          @toggle-status="toggleStatus"
          @edit="startEdit"
          @delete="deleteTodo"
        />
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editingTodo" class="modal-overlay" @click.self="cancelEdit">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Edit Task</h3>
          <button @click="cancelEdit" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Title</label>
            <input v-model="editTitle" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="editDescription" class="form-textarea" rows="4"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="cancelEdit" class="btn btn-secondary">Cancel</button>
          <button @click="saveEdit" class="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Reusing exact same styles from Dashboard.vue */
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
}

.dashboard-container.dark {
  background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%);
}

.dashboard-header {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.dark .dashboard-header {
  background: #1f2937;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.dark .dashboard-title {
  color: #f3f4f6;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.icon-btn {
  padding: 10px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark .icon-btn {
  background: #374151;
}

.icon-btn:hover {
  background: #e5e7eb;
  transform: scale(1.05);
}

.dark .icon-btn:hover {
  background: #4b5563;
}

.icon {
  width: 20px;
  height: 20px;
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 16px;
  align-items: center;
  transition: transform 0.2s;
}

.dark .stat-card {
  background: #1f2937;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card-wide {
  grid-column: span 2;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 28px;
  height: 28px;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 4px 0;
  font-weight: 500;
}

.dark .stat-label {
  color: #9ca3af;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.dark .stat-value {
  color: #f3f4f6;
}

.progress-container {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;
}

.dark .progress-container {
  background: #374151;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 4px;
  transition: width 0.3s;
}

.view-toggle {
  display: flex;
  gap: 8px;
  background: white;
  padding: 6px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dark .view-toggle {
  background: #1f2937;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.view-btn {
  flex: 1;
  padding: 10px 20px;
  border: none;
  background: transparent;
  color: #6b7280;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn:hover {
  background: #f3f4f6;
}

.dark .view-btn:hover {
  background: #374151;
}

.view-btn.active {
  background: #3b82f6;
  color: white;
}

.dark .view-btn {
  color: #9ca3af;
}

.view-content {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.charts-grid-full {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark .chart-card {
  background: #1f2937;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.chart-card-large {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 400px;
}

.dark .chart-card-large {
  background: #1f2937;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.recent-tasks {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark .recent-tasks {
  background: #1f2937;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 20px 0;
}

.dark .section-title {
  color: #f3f4f6;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-item {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.dark .task-item {
  background: #111827;
}

.task-item-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 8px;
}

.task-item h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.dark .task-item h4 {
  color: #f3f4f6;
}

.line-through {
  text-decoration: line-through;
  opacity: 0.6;
}

.task-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-todo {
  background: #dbeafe;
  color: #1e40af;
}

.dark .status-todo {
  background: #1e3a8a;
  color: #93c5fd;
}

.status-in_progress {
  background: #fed7aa;
  color: #92400e;
}

.dark .status-in_progress {
  background: #78350f;
  color: #fbbf24;
}

.status-done {
  background: #d1fae5;
  color: #065f46;
}

.dark .status-done {
  background: #064e3b;
  color: #6ee7b7;
}

.task-description {
  margin: 0 0 8px 0;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

.dark .task-description {
  color: #9ca3af;
}

.task-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.priority-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.priority-1 {
  background: #d1fae5;
  color: #065f46;
}

.dark .priority-1 {
  background: #064e3b;
  color: #6ee7b7;
}

.priority-2 {
  background: #dbeafe;
  color: #1e40af;
}

.dark .priority-2 {
  background: #1e3a8a;
  color: #93c5fd;
}

.priority-3 {
  background: #fee2e2;
  color: #991b1b;
}

.dark .priority-3 {
  background: #7f1d1d;
  color: #fca5a5;
}

.due-date {
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .due-date {
  color: #9ca3af;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.dark .modal-content {
  background: #1f2937;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.dark .modal-header {
  border-bottom: 1px solid #374151;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.dark .modal-header h3 {
  color: #f3f4f6;
}

.modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #6b7280;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
}

.dark .modal-close:hover {
  background: #374151;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.dark .form-group label {
  color: #e5e7eb;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
  background: white;
  color: #111827;
}

.dark .form-input,
.dark .form-textarea {
  background: #111827;
  border-color: #374151;
  color: #f3f4f6;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e5e7eb;
}

.dark .modal-footer {
  border-top: 1px solid #374151;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.dark .btn-secondary {
  background: #374151;
  color: #e5e7eb;
}

.dark .btn-secondary:hover {
  background: #4b5563;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

@media (max-width: 1024px) {
  .charts-grid-full {
    grid-template-columns: 1fr;
  }
  
  .stat-card-wide {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 16px;
  }
  
  .header-content {
    padding: 16px;
  }
  
  .dashboard-title {
    font-size: 1.25rem;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .view-toggle {
    flex-direction: column;
  }
}
</style>
