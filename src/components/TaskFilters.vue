<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  tags: {
    type: Array,
    default: () => []
  },
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:filters', 'update:search'])

const searchQuery = ref('')
const filterStatus = ref('all')
const filterPriority = ref('all')
const filterTag = ref('all')
const filterDueDate = ref('all')

watch([searchQuery, filterStatus, filterPriority, filterTag, filterDueDate], () => {
  emit('update:filters', {
    status: filterStatus.value,
    priority: filterPriority.value,
    tag: filterTag.value,
    dueDate: filterDueDate.value
  })
  emit('update:search', searchQuery.value)
})

const clearFilters = () => {
  searchQuery.value = ''
  filterStatus.value = 'all'
  filterPriority.value = 'all'
  filterTag.value = 'all'
  filterDueDate.value = 'all'
}
</script>

<template>
  <div class="filters-container" :class="{ 'dark-mode': isDarkMode }">
    <!-- Search Bar -->
    <div class="search-section">
      <div class="search-wrapper">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search tasks by title or description..."
          class="search-input"
        />
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <label class="filter-label">Status</label>
        <select v-model="filterStatus" class="filter-select">
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label">Priority</label>
        <select v-model="filterPriority" class="filter-select">
          <option value="all">All Priority</option>
          <option value="1">Low</option>
          <option value="2">Medium</option>
          <option value="3">High</option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label">Tag</label>
        <select v-model="filterTag" class="filter-select">
          <option value="all">All Tags</option>
          <option v-for="tag in tags" :key="tag.id" :value="tag.id">
            {{ tag.name }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label">Due Date</label>
        <select v-model="filterDueDate" class="filter-select">
          <option value="all">All Dates</option>
          <option value="overdue">Overdue</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <button @click="clearFilters" class="clear-btn">
        Clear All
      </button>
    </div>
  </div>
</template>

<style scoped>
.filters-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.filters-container.dark-mode {
  background: #1f2937;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.search-section {
  margin-bottom: 20px;
}

.search-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 44px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
  background: white;
  color: #111827;
}

.dark-mode .search-input {
  background: #111827;
  border-color: #374151;
  color: #f3f4f6;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark-mode .search-input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.filters-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark-mode .filter-label {
  color: #9ca3af;
}

.filter-select {
  padding: 10px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  color: #111827;
}

.dark-mode .filter-select {
  background: #111827;
  border-color: #374151;
  color: #f3f4f6;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dark-mode .filter-select:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.clear-btn {
  padding: 10px 20px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.clear-btn:hover {
  background: #4b5563;
}

.dark-mode .clear-btn {
  background: #4b5563;
}

.dark-mode .clear-btn:hover {
  background: #374151;
}

@media (max-width: 768px) {
  .filters-container {
    padding: 16px;
  }
  
  .filters-section {
    grid-template-columns: 1fr;
  }
}
</style>
