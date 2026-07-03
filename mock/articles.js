// mock/articles.js

// 生成 20 条文章数据
const generateArticles = () => {
  const categories = ['Vue', 'React', 'CSS', 'JavaScript', '工程化']
  const tags = ['前端', 'Vue', 'React', 'CSS', 'JavaScript', '工程化', 'Webpack', 'Vite']

  return Array.from({ length: 20 }, (_, i) => ({
    id: `article_${i + 1}`,
    title: `Vue 3 实战文章 ${i + 1}`,
    summary: `这是第 ${i + 1} 篇文章的摘要内容，讲述了 Vue 3 的核心特性和最佳实践。`,
    content: `# Vue 3 实战\n\n这是文章内容...`,
    cover: '',
    category: categories[i % categories.length],
    tags: [tags[i % tags.length], tags[(i + 1) % tags.length]],
    author: ['张三', '李四', '王五', '赵六'][i % 4],
    viewCount: Math.floor(Math.random() * 1000) + 100,
    likeCount: Math.floor(Math.random() * 200) + 10,
    commentCount: Math.floor(Math.random() * 100),
    isPublished: Math.random() > 0.2,
    createdAt: new Date(Date.now() - i * 86400000).toISOString().replace('T', ' ').slice(0, 19),
    updatedAt: new Date(Date.now() - i * 86400000).toISOString().replace('T', ' ').slice(0, 19)
  }))
}

const articleList = generateArticles()

// ============================================
// Mock 接口
// ============================================

export default [
  // -------- 1. 获取文章列表 --------
  {
    url: '/api/articles',
    method: 'get',
    response: ({ query }) => {
      console.log('📡 [Mock] 拦截到 /api/articles 请求', query)

      const page = parseInt(query.page) || 1
      const pageSize = parseInt(query.pageSize) || 6
      const category = query.category || ''

      let filtered = [...articleList]
      if (category) {
        filtered = filtered.filter((item) => item.category === category)
      }

      const total = filtered.length
      const start = (page - 1) * pageSize
      const end = Math.min(start + pageSize, total)
      const list = filtered.slice(start, end)

      return {
        code: 200,
        data: {
          list,
          pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize)
          }
        },
        message: 'success'
      }
    }
  },

  // -------- 2. 获取分类列表 --------
  {
    url: '/api/categories',
    method: 'get',
    response: () => {
      console.log('📡 [Mock] 拦截到 /api/categories 请求')

      const categories = [...new Set(articleList.map((item) => item.category))]
      const data = categories.map((name, index) => ({
        id: `cat_${index + 1}`,
        name,
        count: articleList.filter((item) => item.category === name).length
      }))

      return {
        code: 200,
        data,
        message: 'success'
      }
    }
  },

  // -------- 3. 获取文章详情 --------
  {
    url: /\/api\/articles\/\w+/,
    method: 'get',
    response: ({ url }) => {
      const id = url.split('/').pop()
      console.log(`📡 [Mock] 拦截到文章详情: ${id}`)

      const article = articleList.find((item) => item.id === id)

      if (!article) {
        return {
          code: 404,
          data: null,
          message: '文章不存在'
        }
      }

      article.viewCount += 1

      return {
        code: 200,
        data: article,
        message: 'success'
      }
    }
  },

  // -------- 4. 登录 --------
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }) => {
      console.log('📡 [Mock] 拦截到登录请求')

      const { username, password } = JSON.parse(body)

      if (username === 'admin' && password === '123456') {
        return {
          code: 200,
          data: {
            token: 'mock_token_' + Date.now(),
            user: {
              id: 'user_001',
              username: 'admin',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
              email: 'admin@vueforge.com',
              role: 'admin',
              bio: 'Vue 爱好者'
            }
          },
          message: '登录成功'
        }
      }

      return {
        code: 401,
        data: null,
        message: '用户名或密码错误'
      }
    }
  },

  // -------- 5. 获取用户信息 --------
  {
    url: '/api/user/profile',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          id: 'user_001',
          username: 'admin',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
          email: 'admin@vueforge.com',
          role: 'admin',
          bio: 'Vue 爱好者'
        },
        message: 'success'
      }
    }
  }
]
