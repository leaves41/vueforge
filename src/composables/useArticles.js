import { ref } from 'vue'
import request from '@/api/request'

/**
 * 文章管理组合式函数
 * 封装文章列表、详情、CRUD 操作
 */
export function useArticles() {
  const articles = ref([])
  const article = ref(null)
  const loading = ref(false)
  const error = ref(null)

  /**
   * 获取文章列表
   */
  async function fetchArticles(params = {}) {
    loading.value = true
    error.value = null
    try {
      const data = await request.get('/articles', { params })
      articles.value = data.list || []
      return data
    } catch (err) {
      error.value = err.message
      articles.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取单篇文章
   */
  async function fetchArticle(id) {
    if (!id) return
    loading.value = true
    error.value = null
    try {
      const data = await request.get(`/articles/${id}`)
      article.value = data
      return data
    } catch (err) {
      error.value = err.message
      article.value = null
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建文章
   */
  async function createArticle(data) {
    // 模拟创建
    return request.post('/articles', data)
  }

  /**
   * 更新文章
   */
  async function updateArticle(id, data) {
    return request.put(`/articles/${id}`, data)
  }

  /**
   * 删除文章
   */
  async function deleteArticle(id) {
    return request.delete(`/articles/${id}`)
  }

  return {
    // State
    articles,
    article,
    loading,
    error,
    // Actions
    fetchArticles,
    fetchArticle,
    createArticle,
    updateArticle,
    deleteArticle,
  }
}