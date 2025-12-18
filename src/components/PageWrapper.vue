<script setup>
defineProps({
  isDarkMode: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div :class="{ 'dark': isDarkMode }" class="page-wrapper">
    <div class="page-container">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  transition: background 0.3s ease;
}

.page-wrapper.dark {
  background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%);
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease, color 0.3s ease;
}

.page-wrapper.dark .page-container {
  background: #1f2937;
  color: #f3f4f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Dark mode text - White/Light Grey */
.page-wrapper.dark :deep(h1),
.page-wrapper.dark :deep(h2),
.page-wrapper.dark :deep(h3),
.page-wrapper.dark :deep(h4),
.page-wrapper.dark :deep(h5),
.page-wrapper.dark :deep(h6),
.page-wrapper.dark :deep(p),
.page-wrapper.dark :deep(label),
.page-wrapper.dark :deep(span),
.page-wrapper.dark :deep(div) {
  color: #f3f4f6 !important;
}

/* Dark mode form inputs */
.page-wrapper.dark :deep(input),
.page-wrapper.dark :deep(textarea),
.page-wrapper.dark :deep(select) {
  background-color: #374151;
  color: #f3f4f6;
  border-color: #4b5563;
}

.page-wrapper.dark :deep(input::placeholder),
.page-wrapper.dark :deep(textarea::placeholder) {
  color: #9ca3af;
}

/* Override all white backgrounds */
.page-wrapper.dark :deep([style*="background: white"]),
.page-wrapper.dark :deep([style*="background:#f3f4f6"]) {
  background-color: #2d3748 !important;
}

/* Override RGB borders (229, 231, 235 = #e5e7eb) */
.page-wrapper.dark :deep([style*="rgb(229, 231, 235)"]),
.page-wrapper.dark :deep([style*="rgb(209, 213, 219)"]),
.page-wrapper.dark :deep([style*="rgb(229,231,235)"]) {
  border-color: #4b5563 !important;
  background-color: #2d3748 !important;
  color: #f3f4f6 !important;
}

/* Override grey text */
.page-wrapper.dark :deep([style*="color: #6b7280"]),
.page-wrapper.dark :deep([style*="color: #111827"]),
.page-wrapper.dark :deep([style*="color:#6b7280"]) {
  color: #f3f4f6 !important;
}

/* Alert boxes */
.page-wrapper.dark :deep([style*="background: #fee2e2"]) {
  background-color: #7f1d1d !important;
  color: #fca5a5 !important;
}

.page-wrapper.dark :deep([style*="background: #d1fae5"]) {
  background-color: #064e3b !important;
  color: #86efac !important;
}

/* Generic dark mode for all divs with inline styles */
.page-wrapper.dark :deep(div[style]) {
  background-color: #2d3748 !important;
  color: #f3f4f6 !important;
  border-color: #4b5563 !important;
}
</style>