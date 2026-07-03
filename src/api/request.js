import axios from 'axios'
import { useUserStore } from '@/store/modules/userStore'
import { useAppStore } from '@/store/modules/appStore'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  adapter: 'xhr', // ← 显式指定使用 XHR
  headers: {
    'Content-Type': 'application/json'
  }
})

// -------- 请求拦截器 --------
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()

    // 添加 Token
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }

    // ✅ 给 GET 请求添加时间戳，防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    // 显示 loading
    const appStore = useAppStore()
    appStore.showLoading()

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// -------- 响应拦截器 --------
request.interceptors.response.use(
  (response) => {
    console.log('📦 响应数据:', response.data) // ✅ 添加这行

    const appStore = useAppStore()
    appStore.hideLoading()

    // ✅ 检查响应数据格式
    const { code, data, message } = response.data

    // Mock.js 返回的格式：{ code: 200, data: {...}, message: 'success' }
    if (code === 200 || code === 0) {
      return data // ✅ 直接返回 data
    }

    // 业务错误
    appStore.showNotification({
      type: 'error',
      message: message || '请求失败'
    })
    return Promise.reject(new Error(message || '请求失败'))
  },
  (error) => {
    const appStore = useAppStore()
    appStore.hideLoading()

    // HTTP 错误处理
    const status = error.response?.status
    const userStore = useUserStore()

    switch (status) {
      case 401:
        userStore.logout()
        window.location.href = '/login'
        break
      case 403:
        appStore.showNotification({ type: 'error', message: '没有权限' })
        break
      case 404:
        appStore.showNotification({ type: 'error', message: '资源不存在' })
        break
      case 500:
        appStore.showNotification({ type: 'error', message: '服务器错误' })
        break
      default:
        appStore.showNotification({
          type: 'error',
          message: error.message || '网络请求失败'
        })
    }

    return Promise.reject(error)
  }
)

export default request
