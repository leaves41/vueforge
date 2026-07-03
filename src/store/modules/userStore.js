import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/**
 * 用户状态管理
 * 管理：登录状态、用户信息、Token
 */
export const useUserStore = defineStore('user', () => {
  // -------- State --------
  const token = ref(null)
  const userInfo = ref(null) // { id, username, avatar, role, email }

  // -------- Getters --------
  const isLoggedIn = computed(() => !!token.value)

  const username = computed(() => userInfo.value?.username || '游客')

  const avatar = computed(() => userInfo.value?.avatar || '/default-avatar.png')

  const isAdmin = computed(() => userInfo.value?.role === 'admin')

  // -------- Actions --------
  function setToken(newToken) {
    token.value = newToken
    // 自动写入 axios 请求头（后续在 request.js 中统一处理）
  }

  function setUserInfo(info) {
    userInfo.value = info
  }

  function login(data) {
    // 模拟登录，实际调用 API
    setToken(data.token)
    setUserInfo(data.user)
  }

  function logout() {
    token.value = null
    userInfo.value = null
    // 清除 axios 请求头（后续实现）
  }

  function updateUserInfo(info) {
    userInfo.value = { ...userInfo.value, ...info }
  }

  return {
    // State
    token,
    userInfo,
    // Getters
    isLoggedIn,
    username,
    avatar,
    isAdmin,
    // Actions
    setToken,
    setUserInfo,
    login,
    logout,
    updateUserInfo,
  }
})