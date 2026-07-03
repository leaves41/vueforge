# 任务目标

- [x] **完善首页**
- [x] **文章详情页**
- [x] **组合式函数**
- [x] **代码优化**

---



# QA

#### Q2: `onMounted` 和 `onActivated` 的区别？

**答：**

- `onMounted`：组件**首次挂载**时执行一次
- `onActivated`：组件**每次激活**时执行（包含首次挂载）

**使用场景：**

```
// ❌ 被 KeepAlive 缓存后，onMounted 不会再次执行
onMounted(() => {
  fetchData()  // 只有首次执行
})

// ✅ 每次页面可见都执行
onActivated(() => {
  fetchData()  // 每次激活都刷新数据
})
```

----

#### Q3: `v-if` 和 `v-show` 的区别？

**答：**

|              | `v-if`                | `v-show`           |
| :----------- | :-------------------- | :----------------- |
| **原理**     | 创建/销毁 DOM         | 切换 display: none |
| **初始渲染** | 条件为 false 时不渲染 | 始终渲染           |
| **切换开销** | 大（销毁/重建）       | 小（切换 CSS）     |
| **适用场景** | 条件变化少            | 频繁切换           |

**项目实例：**

```
<!-- 加载状态：v-if，显示/隐藏频繁切换 -->
<div v-if="loading" class="loading-state">加载中...</div>

<!-- 文章列表：v-else-if -->
<div v-else-if="articles.length > 0">...</div>

<!-- 空状态：v-else -->
<div v-else>暂无文章</div>
```

---

### 第二类：组合式 API

#### Q4: 什么是组合式函数（Composables）？为什么用它？

**答：**

组合式函数是将**逻辑相关的代码**封装到一起的函数，可以复用。

**解决的问题：**

1. **逻辑分散**：Options API 中一个功能的逻辑分散在 data、methods、watch 中
2. **代码重复**：多个组件需要相同逻辑时，只能复制粘贴
3. **复用困难**：mixin 有命名冲突、来源不清晰等问题

**项目实例：**

```
// 封装分页逻辑
export function usePagination(initialPageSize = 10) {
  const currentPage = ref(1)
  const pageSize = ref(initialPageSize)
  const total = ref(0)
  const totalPages = ref(0)

  function changePage(page) {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
  }

  return { currentPage, pageSize, totalPages, changePage, setPagination }
}

// 在组件中使用
const { currentPage, changePage } = usePagination(6)
// 只关心业务逻辑，不需要关心分页实现
```

---

#### Q5: `<script setup>` 有什么好处？

**答：**

1. **代码更简洁**：不需要 `export default`、`components` 注册
2. **性能更好**：编译时优化
3. **更好的类型推导**：对 TypeScript 更友好
4. **顶层变量自动暴露**：不需要手动返回

```
<!-- ❌ 普通写法 -->
<script>
export default {
  components: { ArticleCard },
  data() {
    return { count: 0 }
  },
  methods: {
    increment() { this.count++ }
  }
}
</script>

<!-- ✅ script setup -->
<script setup>
import ArticleCard from './ArticleCard.vue'
const count = ref(0)
function increment() { count.value++ }
</script>
```

---

### 第三类：路由

#### Q6: 路由守卫有哪些？你的项目用了什么？

**答：**

| 守卫类型     | 说明                  | 使用场景           |
| :----------- | :-------------------- | :----------------- |
| **全局前置** | `beforeEach`          | 登录验证、权限检查 |
| **全局后置** | `afterEach`           | 埋点、滚动恢复     |
| **路由独享** | `beforeEnter`         | 单个路由的权限     |
| **组件内**   | `onBeforeRouteUpdate` | 参数变化时刷新数据 |

**项目实例：**

```
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置标题
  document.title = to.meta.title || 'VueForge'
  
  // 权限检查
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }
  
  next()
})
```

---

#### Q7: 路由懒加载怎么实现？有什么好处？

**答：**

```
// ❌ 直接导入（打包到一个文件）
import Home from '@/views/Home/index.vue'

// ✅ 懒加载（单独打包）
const Home = () => import('@/views/Home/index.vue')
```

**好处：**

1. **首屏加载快**：只加载当前页面代码
2. **按需加载**：访问时才下载
3. **减少包体积**：代码被拆分成多个 chunk

---

#### Q8: 你的项目做了哪些性能优化？

**答：**

1. **路由懒加载**

   javascript

   ```
   const Home = () => import('@/views/Home/index.vue')
   ```

   

2. **KeepAlive 页面缓存**

   vue

   ```
   <KeepAlive :include="['Home', 'Category']">
     <RouterView />
   </KeepAlive>
   ```

3. **分页加载**

   - 每页只请求 6 条数据
   - 减少首屏渲染压力

4. **组件复用**

   - `ArticleCard` 被循环使用
   - `usePagination` 逻辑复用

5. **防抖（后续实现）**

   - 搜索输入停止 500ms 后才请求

---

### Q11: 路由参数变化时，组件不更新怎么办？

**答：**

使用 `watch` 监听路由参数：

```
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// ✅ 监听参数变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchArticle(newId)
  }
})
```

或者使用 `onBeforeRouteUpdate`：

```
import { onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteUpdate((to, from, next) => {
  // 路由更新前执行
  fetchArticle(to.params.id)
  next()
})
```

---

