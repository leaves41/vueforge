/**
 * 路由定义 - 所有页面路由在此配置
 * 注意：后台管理路由通过 addRoute 动态添加（后续实现）
 */

// 懒加载组件（代码分割）
const Home = () => import('@/views/Home/index.vue')
const onHandler = () => import('@/views/study/onHandler.vue')
const test = () => import('@/views/study/test.vue')
const cssStu = () => import('@/views/study/cssStu.vue')
const dashboard = () => import('@/views/Dashboard/index.vue')
const laohj = () => import('@/views/study/laohj.vue')
const imgLazy = () => import('@/views/study/imgLazy.vue')
const errorTest = () => import('@/views/study/errorTest.vue')
const ArticleDetail = () => import('@/views/Article/Detail.vue')
// const CategoryArchive = () => import('@/views/Category/index.vue')
// const TagArchive = () => import('@/views/Tag/index.vue')
// const About = () => import('@/views/About/index.vue')
// const Login = () => import('@/views/Login/index.vue')
// const NotFound = () => import('@/views/NotFound/index.vue')

// 后台管理（后续实现，先占位）
// const Dashboard = () => import('@/views/Dashboard/index.vue')

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页',
      keepAlive: true // 页面缓存
    }
  },
  {
    path: '/onHandler',
    name: 'onHandler',
    component: onHandler,
    meta: {
      title: '事件处理学习界面',
      keepAlive: true // 页面缓存
    }
  },
  {
    path: '/cssStu',
    name: 'cssStu',
    component: cssStu,
    meta: {
      title: 'css查缺补漏',
      keepAlive: false // 页面缓存
    }
  },
  {
    path: '/laohj',
    name: 'laohj',
    component: laohj,
    meta: {
      title: '老虎机',
      keepAlive: false // 页面缓存
    }
  },
  {
    path: '/errorTest',
    name: 'errorTest',
    component: errorTest,
    meta: {
      title: '错误拦截测试',
      keepAlive: false // 页面缓存
    }
  },
  {
    path: '/test',
    name: 'test',
    component: test,
    meta: {
      title: '测试',
      keepAlive: false // 页面缓存
    }
  },

  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: ArticleDetail,
    meta: {
      title: '文章详情'
    }
  },
  {
    path: '/imgLazy',
    name: 'imgLazy',
    component: imgLazy,
    meta: {
      title: '图片懒加载'
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: dashboard,
    meta: {
      title: '虚拟列表'
    }
  }
  // {
  //   path: '/category/:name?',
  //   name: 'Category',
  //   component: CategoryArchive,
  //   meta: {
  //     title: '分类归档',
  //   },
  // },
  // {
  //   path: '/tag/:name?',
  //   name: 'Tag',
  //   component: TagArchive,
  //   meta: {
  //     title: '标签归档',
  //   },
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: About,
  //   meta: {
  //     title: '关于我',
  //   },
  // },
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: Login,
  //   meta: {
  //     title: '登录',
  //     requiresGuest: true, // 仅未登录可访问
  //   },
  // },
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   component: Dashboard,
  //   meta: {
  //     title: '控制台',
  //     requiresAuth: true, // 需要登录
  //   },
  // },
  // // 404 兜底 - 必须放在最后
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: NotFound,
  //   meta: {
  //     title: '页面未找到',
  //   },
  // },
]
