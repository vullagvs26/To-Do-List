<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

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
  const priorityCounts = {
    1: 0, // Low
    2: 0, // Medium
    3: 0  // High
  }

  props.todos.forEach(todo => {
    if (priorityCounts.hasOwnProperty(todo.priority)) {
      priorityCounts[todo.priority]++
    }
  })

  return {
    labels: ['Low Priority', 'Medium Priority', 'High Priority'],
    datasets: [
      {
        label: 'Tasks',
        data: [priorityCounts[1], priorityCounts[2], priorityCounts[3]],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',   // Green for Low
          'rgba(59, 130, 246, 0.7)',  // Blue for Medium
          'rgba(239, 68, 68, 0.7)'    // Red for High
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(239, 68, 68)'
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
      position: 'bottom',
      labels: {
        color: props.isDarkMode ? '#e5e7eb' : '#374151',
        font: {
          size: 12
        },
        padding: 15
      }
    },
    title: {
      display: true,
      text: 'Tasks by Priority',
      color: props.isDarkMode ? '#f3f4f6' : '#111827',
      font: {
        size: 16,
        weight: 'bold'
      },
      padding: {
        bottom: 20
      }
    },
    tooltip: {
      backgroundColor: props.isDarkMode ? '#1f2937' : '#ffffff',
      titleColor: props.isDarkMode ? '#f3f4f6' : '#111827',
      bodyColor: props.isDarkMode ? '#e5e7eb' : '#374151',
      borderColor: props.isDarkMode ? '#4b5563' : '#d1d5db',
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: function(context) {
          const label = context.label || ''
          const value = context.parsed
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
          return `${label}: ${value} tasks (${percentage}%)`
        }
      }
    }
  }
}))
</script>

<template>
  <div class="chart-container">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>
