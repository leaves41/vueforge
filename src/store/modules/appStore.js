import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/**
 * 应用全局状态
 * 管理：主题模式、侧边栏展开、加载状态等
 */
export const useAppStore = defineStore('app', () => {
  // -------- State --------
  const isDarkMode = ref(false)
  const isSidebarCollapsed = ref(false)
  const globalLoading = ref(false)
  const notification = ref(null) // { type: 'success'|'error'|'info', message: string }

  // -------- Getters (computed) --------
  const currentTheme = computed(() => (isDarkMode.value ? 'dark' : 'light'))

  // -------- Actions --------
  function toggleDarkMode() {
    isDarkMode.value = !isDarkMode.value
    // 应用到 DOM
    document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
    // 保存到 localStorage（后续持久化）
  }

  function setDarkMode(value) {
    isDarkMode.value = value
    document.documentElement.setAttribute('data-theme', value ? 'dark' : 'light')
  }

  function toggleSidebar() {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  }

  function showLoading() {
    globalLoading.value = true
  }

  function hideLoading() {
    globalLoading.value = false
  }

  function showNotification({ type, message, duration = 3000 }) {
    notification.value = { type, message }
    if (duration > 0) {
      setTimeout(() => {
        notification.value = null
      }, duration)
    }
  }

  return {
    // State
    isDarkMode,
    isSidebarCollapsed,
    globalLoading,
    notification,
    // Getters
    currentTheme,
    // Actions
    toggleDarkMode,
    setDarkMode,
    toggleSidebar,
    showLoading,
    hideLoading,
    showNotification,
  }
})