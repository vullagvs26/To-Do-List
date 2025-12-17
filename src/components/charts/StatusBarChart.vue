<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  todos: {
    type: Array,
    required: true
  },
  isDarkMode: {
    type: Boolean,
    default: false
  }
})

const chartData = computed(() => {
  const statusCounts = {
    todo: 0,
    in_progress: 0,
    done: 0
  }

  props.todos.forEach(todo => {
    if (statusCounts.hasOwnProperty(todo.status)) {
      statusCounts[todo.status]++
    }
  })

  return {
    labels: ['To Do', 'In Progress', 'Done'],
    datasets: [
      {
        label: 'Number of Tasks',
        data: [statusCounts.todo, statusCounts.in_progress, statusCounts.done],
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',  // Blue for To Do
          'rgba(245, 158, 11, 0.6)',  // Orange for In Progress
          'rgba(16, 185, 129, 0.6)'   // Green for Done
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(16, 185, 129)'
        ],
        borderWidth: 2
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: props.isDarkMode ? '#e5e7eb' : '#374151',
        font: {
          size: 12
        }
      }
    },
    title: {
      display: true,
      text: 'Tasks by Status',
      color: props.isDarkMode ? '#f3f4f6' : '#111827',
      font: {
        size: 16,
        weight: 'bold'
      }
    },
    tooltip: {
      backgroundColor: props.isDarkMode ? '#1f2937' : '#ffffff',
      titleColor: props.isDarkMode ? '#f3f4f6' : '#111827',
      bodyColor: props.isDarkMode ? '#e5e7eb' : '#374151',
      borderColor: props.isDarkMode ? '#4b5563' : '#d1d5db',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      callbacks: {
        label: function(context) {
          const label = context.dataset.label || ''
          const value = context.parsed.y
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
          return `${label}: ${value} (${percentage}%)`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        color: props.isDarkMode ? '#9ca3af' : '#6b7280'
      },
      grid: {
        color: props.isDarkMode ? '#374151' : '#e5e7eb'
      }
    },
    x: {
      ticks: {
        color: props.isDarkMode ? '#9ca3af' : '#6b7280'
      },
      grid: {
        color: props.isDarkMode ? '#374151' : '#e5e7eb'
      }
    }
  }
}))
</script>

<template>
  <div class="chart-container">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>
