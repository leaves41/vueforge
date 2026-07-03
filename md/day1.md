# 任务目标
- [x] 构建项目

- [x] 清理无用代码 & 重构目录结构

- [x] 配置全局样式

- [x] 配置router

- [x] 配置pinia

- [x] 创建mock

- [x] 创建布局组件

---



# 构建项目

```cmd
npm create vue@3.10.0 vueforge

✔ Project name: … vueforge
✔ Add TypeScript? … No
✔ Add JSX Support? … No
✔ Add Vue Router for Single Page Application development? … Yes
✔ Add Pinia for state management? … Yes
✔ Add Vitest for Unit Testing? … No
✔ Add an End-to-End Testing Solution? … No
✔ Add ESLint for code quality? … Yes
✔ Add Prettier for code formatting? … Yes
```



# QA

## 📌 第一类：Vue 基础

### Q1: Vue 3 的响应式原理是什么？

**答：**

> Vue 3 使用 **Proxy** 实现响应式。当数据被访问时，`get` 操作收集依赖（track）；当数据被修改时，`set` 操作触发更新（trigger）。
>
> 相比 Vue 2 的 `Object.defineProperty`，Proxy 可以：
>
> - 监听数组变化（不需要重写数组方法）
> - 监听对象新增属性
> - 性能更好
>
> `ref` 底层也是用 `reactive` 实现的，只是包裹了一层 `.value`。

### Q2: `ref` 和 `reactive` 有什么区别？怎么选择？

**答：**

| 对比         | `ref`                       | `reactive`               |
| :----------- | :-------------------------- | :----------------------- |
| **数据类型** | 任何类型（基本类型 + 对象） | 仅对象/数组              |
| **访问方式** | `.value`                    | 直接访问                 |
| **解构**     | 可以用 `toRefs` 保持响应性  | 解构会丢失响应性         |
| **重新赋值** | 可以整体重新赋值            | 整体重新赋值会失去响应性 |

**选择建议：**

- 基本类型 → 用 `ref`
- 对象/数组且不需要解构 → 用 `reactive`
- 需要解构的对象 → 用 `ref` + `toRefs`
- **我的项目统一用 `ref`**，更简单，避免混淆

javascript

```
// 项目中的实际使用
const articles = ref([])           // ✅ 数组用 ref
const loading = ref(false)         // ✅ 布尔用 ref
const isDarkMode = ref(false)      // ✅ 布尔用 ref
```

---

### Q3: `computed` 和 `watch` 的区别？

**答：**

| 对比         | `computed`                 | `watch`                          |
| :----------- | :------------------------- | :------------------------------- |
| **用途**     | 计算派生值                 | 执行副作用                       |
| **缓存**     | 有缓存，依赖不变不重新计算 | 无缓存                           |
| **返回值**   | 必须 return                | 不返回值                         |
| **异步操作** | 不支持                     | 支持                             |
| **使用场景** | 数据转换、过滤、计算       | 数据变化时执行异步请求、DOM 操作 |

**项目实例：**

javascript

```
// ✅ computed：计算派生值
const currentTheme = computed(() => {
  return isDarkMode.value ? 'dark' : 'light'
})

// ✅ watch：监听变化执行副作用
watch(currentPage, () => {
  fetchArticles()  // 页码变化时重新请求数据
  window.scrollTo({ top: 0 })
})
```

___



## 📌 第二类：组合式 API

### Q4: 为什么要有 Composition API？解决了什么问题？

**答：**

> **Options API 的问题：**
>
> 1. **逻辑分散**：一个功能的逻辑（data、methods、watch）分散在不同选项中
> 2. **代码碎片化**：复杂组件中，同一功能的代码被切分成多块
> 3. **复用困难**：mixin 有命名冲突、来源不清晰等问题
>
> **Composition API 的优势：**
>
> 1. **逻辑聚合**：相关功能可以放在一起
> 2. **更好的类型推导**：对 TypeScript 更友好
> 3. **逻辑复用**：通过组合式函数（Composables）轻松复用
>
> **我的项目实践：**
>
> javascript
>
> ```
> // ✅ 逻辑聚合：分页相关代码都在 usePagination 中
> const { currentPage, pageSize, changePage } = usePagination(6)
> 
> // ❌ Options API 写法：分页逻辑分散在 data、methods、watch 中
> data() { return { currentPage: 1 } },
> methods: { changePage() {} },
> watch: { currentPage() {} }
> ```
>
> 

---

### Q5: `<script setup>` 和普通 `<script>` 有什么区别？

**答：**

> `<script setup>` 是语法糖，编译后变成普通 `<script>`。
>
> **区别：**
>
> |              | `<script setup>`     | 普通 `<script>`      |
> | :----------- | :------------------- | :------------------- |
> | **简洁性**   | 更简洁，少写很多代码 | 需要 export default  |
> | **顶层变量** | 自动暴露给模板       | 需要手动返回         |
> | **性能**     | 略好（编译时优化）   | 标准                 |
> | **组件注册** | 导入即用             | 需要 components 选项 |
>
> **项目实例：**
>
> vue
>
> ```
> <!-- ✅ <script setup> 写法 -->
> <script setup>
> import { ref } from 'vue'
> import ArticleCard from '@/components/business/ArticleCard.vue'
> const count = ref(0)  // 自动暴露给模板
> </script>
> 
> <!-- ❌ 普通写法（Options API） -->
> <script>
> import ArticleCard from '@/components/business/ArticleCard.vue'
> export default {
>   components: { ArticleCard },
>   data() {
>     return { count: 0 }
>   }
> }
> </script>
> ```

---



## 📌 第三类：组件通信

### Q6: Vue 3 中组件通信有哪些方式？

**答：**

| 方式               | 适用场景       | 项目实例                |
| :----------------- | :------------- | :---------------------- |
| **Props**          | 父→子          | `:article="article"`    |
| **Emits**          | 子→父          | `@click="goToDetail"`   |
| **v-model**        | 双向绑定       | 表单输入（后续实现）    |
| **provide/inject** | 跨层级传递     | 主题、用户信息          |
| **Pinia**          | 全局状态       | `appStore`、`userStore` |
| **$attrs**         | 属性透传       | 高阶组件                |
| **$refs**          | 调用子组件方法 | 后续实现                |
| **Event Bus**      | Vue 3 不推荐   | 用 Pinia 替代           |

**项目实例：**

vue

```
<!-- Props：父传子 -->
<ArticleCard :article="article" @click="goToDetail" />

<!-- Emits：子传父 -->
<script setup>
const emit = defineEmits(['click'])
emit('click')
</script>

<!-- Pinia：全局状态 -->
const appStore = useAppStore()
appStore.toggleDarkMode()
```

---

## 📌 第四类：路由

### Q7: 路由守卫的作用？你项目里用了哪些？

**答：**

> 路由守卫用于在路由跳转前后执行逻辑，常见用途：
>
> 1. **登录拦截**：未登录用户无法访问需要认证的页面
> 2. **权限控制**：不同角色看到不同页面
> 3. **页面标题**：动态设置标题
> 4. **埋点统计**：记录用户访问路径
>
> **我的项目使用了全局前置守卫：**
>
> javascript
>
> ```
> router.beforeEach((to, from, next) => {
>   // 1. 设置页面标题
>   document.title = to.meta.title || 'VueForge'
>   
>   // 2. 权限检查
>   const userStore = useUserStore()
>   if (to.meta.requiresAuth && !userStore.isLoggedIn) {
>     return next({ path: '/login', query: { redirect: to.fullPath } })
>   }
>   
>   // 3. 已登录访问登录页 → 跳首页
>   if (to.meta.requiresGuest && userStore.isLoggedIn) {
>     return next({ path: '/' })
>   }
>   
>   next()
> })
> ```

---



### Q8: 路由懒加载是如何实现的？有什么好处？

**答：**

> **实现方式：** 使用动态 `import()`
>
> javascript
>
> ```
> // ❌ 直接加载（打包到一个文件）
> import Home from '@/views/Home/index.vue'
> 
> // ✅ 懒加载（单独打包，按需加载）
> const Home = () => import('@/views/Home/index.vue')
> ```
>
> 
>
> **好处：**
>
> 1. **首屏加载更快**：只加载当前页面需要的代码
> 2. **减少初始包体积**：代码被拆分成多个 chunk
> 3. **按需加载**：用户访问时才下载对应页面代码
>
> **Vite 原理：** Vite 在构建时自动将 `() => import()` 转换为独立的 chunk。

---



## 📌 第五类：状态管理（Pinia）

### Q9: Pinia 和 Vuex 有什么区别？为什么选择 Pinia？

**答：**

> | 对比           | Pinia      | Vuex             |
> | :------------- | :--------- | :--------------- |
> | **Mutations**  | ❌ 不需要   | ✅ 需要           |
> | **TypeScript** | 天然支持   | 需要额外配置     |
> | **代码量**     | 更少       | 更多             |
> | **模块化**     | 自动模块化 | 需要手动 modules |
> | **插件**       | 支持       | 支持             |
> | **学习曲线**   | 平缓       | 陡峭             |
>
> **核心区别：**
>
> - Vuex 有 `state`、`mutations`、`actions`、`getters`
> - Pinia 去掉 `mutations`，只有 `state`、`getters`、`actions`
> - 更简洁，更接近 Vue 3 的组合式 API 风格
>
> **项目实例：**
>
> javascript
>
> ```
> // Pinia 风格（组合式 API）
> export const useAppStore = defineStore('app', () => {
>   const count = ref(0)                    // state
>   const double = computed(() => count.value * 2)  // getter
>   function increment() { count.value++ }  // action
>   return { count, double, increment }
> })
> ```



## 📌 第六类：主题切换（CSS 变量）

### Q10: 你的主题切换是怎么实现的？

**答：**

> 项目采用 **CSS 变量 + 属性选择器 + Pinia** 的方式。
>
> **1. CSS 层面：**
>
> css
>
> ```
> :root { --color-bg: #f5f7fa; }
> [data-theme="dark"] { --color-bg: #0d0d1a; }
> ```
>
> 
>
> **2. 状态管理：**
>
> javascript
>
> ```
> const isDarkMode = ref(false)
> function toggleDarkMode() {
>   isDarkMode.value = !isDarkMode.value
>   document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
>   localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
> }
> ```
>
> 
>
> **3. 组件使用：**
>
> vue
>
> ```
> <div class="card" style="background: var(--color-bg)" />
> ```
>
> 
>
> **为什么这样设计？**
>
> - 性能好（CSS 变量由浏览器原生支持）
> - 代码简洁（组件无需关心主题逻辑）
> - 扩展性强（添加新主题只需加 `[data-theme="xxx"]`）
> - 持久化（localStorage 保存用户偏好）

---

## 📌 第七类：生命周期

### Q11: Vue 3 的生命周期有哪些？和 Vue 2 有什么区别？

**答：**

| Vue 2           | Vue 3 (Composition API) | 说明               |
| :-------------- | :---------------------- | :----------------- |
| `beforeCreate`  | `setup()`               | 初始化前           |
| `created`       | `setup()`               | 初始化完成         |
| `beforeMount`   | `onBeforeMount`         | 挂载前             |
| `mounted`       | `onMounted`             | 挂载完成           |
| `beforeUpdate`  | `onBeforeUpdate`        | 更新前             |
| `updated`       | `onUpdated`             | 更新完成           |
| `beforeDestroy` | `onBeforeUnmount`       | 卸载前             |
| `destroyed`     | `onUnmounted`           | 卸载完成           |
| `activated`     | `onActivated`           | `<KeepAlive>` 激活 |
| `deactivated`   | `onDeactivated`         | `<KeepAlive>` 停用 |
| `errorCaptured` | `onErrorCaptured`       | 错误捕获           |

**关键变化：**

- `beforeCreate` 和 `created` 被 `setup()` 替代
- 生命周期函数需要从 `vue` 导入
- 所有生命周期函数名前加 `on`（如 `onMounted`）

---



## 📌 第八类：性能优化

### Q12: 你项目中做了哪些性能优化？

**答：**

> **1. 路由懒加载**
>
> javascript
>
> ```
> const Home = () => import('@/views/Home/index.vue')
> ```
>
> 
>
> **2. 页面缓存（KeepAlive）**
>
> vue
>
> ```
> <KeepAlive :include="cachedViews">
>   	<RouterView />
> </KeepAlive>
> ```
>
> KeepAlive 是 Vue 的内置组件，用于缓存组件实例，避免频繁创建和销毁。
>
> **使用场景：**
>
> - Tab 切换（如后台管理系统的标签页）
> - 列表页和详情页来回切换
>- 需要保留用户操作状态（表单、滚动位置）
> 
>**注意事项：**
> 
> - 组件必须定义 `name` 才能被 `include` 识别
>- 缓存组件数量要控制，避免内存泄漏
> - 缓存的数据需要依赖刷新时，用 `onActivated`

> **3. 图片懒加载（后续实现）**
>
> - 使用 `loading="lazy"` 属性
>- 自定义 `v-lazy` 指令
> 
> **4. 分页加载**
> 
>- 每页只请求 6 条数据
> - 减少首屏渲染压力
>
> **5. 防抖搜索（后续实现）**
>
> - 输入停止 500ms 后才发起请求
>- 减少不必要的 API 调用
> 
> **6. 组合式函数复用**
>   
> - `usePagination` 抽离分页逻辑
> - 减少重复代码

---

### Q13: Vue是一个渐进式框架，他的渐进式思想体现在哪里？

答：

>web世界是十分多样化的，不同开发者在web上构建的应用会存在非常大的差异，考虑到这一点，vue的设计非常注重灵活性和**可以被逐步集成**这个特点，根据不同的需求场景，你可以用不同的方式使用Vue:
>
>- 无需构建步骤，渐进式增强静态HTML
>- 在任何页面中作为Web Components嵌入
>- 单页面应用（SPA）
>- 全栈/服务端渲染（SSR）
>- jamstact/静态站点生成
>- 开发桌面端/移动端/WebGL/命令行终端界面











### QX: $attrs的作用是什么？有哪些应用场景

答：

>`$attrs` 是一个对象，它包含了**父组件传递给子组件，但子组件没有在 `props` 或 `emits` 中显式声明（定义）的所有属性。**
>
>他有以下特点：
>
>- 只包含未显示声明的属性，如果已经在props或者emits中声明的属性，则不会在$attrs中
>
>- 如果子组件中存在多个根节点，则渲染逻辑什么都不会做，你必须显示的去绑定到某个组件上，**注意，这种情况下不需要设置 `inheritAttrs: false`**
>
>  ```js
>  <template>
>    <header>Header Area</header>
>    <!-- 手动将透传的属性绑定到 main 标签上 -->
>    <main v-bind="$attrs">Content Area</main>
>  </template>
>  ```
>
>  主要的应用场景：
>
>  1. #### 1. 简化组件 API，避免声明一堆 Props
>
>     当你在封装一个基于原生标签的组件时（比如 `Input`、`Button`），原生标签有几十个属性（`type`, `placeholder`, `disabled`, `maxlength`, `readonly` 等）。
>     如果你不用 `$attrs`，你就得在子组件里把这几十个属性全写成 `props`，太繁琐了。
>     用 `$attrs`，你只需 `v-bind="$attrs"`，父组件传什么，原生标签就接什么，**极大提升了组件的通用性**。
>
>     #### 2. 事件透传
>
>     在 Vue 3 中，事件（如 `@click`、`@focus`、`@blur`）也被放在了 `$attrs` 里。
>     通过 `v-bind="$attrs"`，你可以很轻松地让父组件能够监听到子组件内部原生元素的事件，而不需要在子组件里写一堆 `this.$emit`。
>
>     #### 3. 高阶组件（HOC）或二次封装第三方库
>
>     假设你引入了一个第三方 UI 库的 `<el-table>`，你想在外面再包一层自己的 `<MyTable>`。你不可能把 `<el-table>` 所有的 props 和事件都在 `<MyTable>` 里重新声明一遍。
>     此时，直接在 `<MyTable>` 内部写：
>
>     ```html
>     <el-table v-bind="$attrs" v-bind="$props">
>       <!-- 你的插槽逻辑 -->
>     </el-table>
>     ```
>
>     这样 `<MyTable>` 就成了一个完美的透明代理，父组件怎么用 `<el-table>`，就可以原封不动地怎么用 `<MyTable>`。



Q14: 使用composition API封装出的函数可以在组件中引入使用，那么他本质还是抽象的一种方法，那么他为什么比vue2的mixin好呢，他同样也存在变量名重复的问题，是因为他可以按需导入吗？

答：

>你的思考非常敏锐，而且抓住了关键点。**你完全说对了一点：Composition API（组合式API）并没有从物理上消除“变量名重复”这个现象。**
>
>但它的优势绝不仅仅是“按需导入”这么表面。为了让你透彻理解，我们从**“冲突的后果”**和**“代码的透明度”**这两个本质维度来对比：
>
>### 1. 冲突发生的位置（致命差异）
>
>- **Vue2 Mixin（隐式合并）**：冲突发生在 `this` 上。如果 Mixin A 有 `data` 属性 `name`，Mixin B 也有 `name`，Vue 会**静默地（或报弱警告）按合并策略覆盖**。你在组件里写 `this.name`，根本不知道这个 `name` 是从 A 来的还是 B 来的，还是被组件自己的 data 覆盖了。**这是“黑盒污染”。**
>- **Composition API（显式解构）**：冲突发生在 `setup()` 函数内的**变量作用域**里。假设你引入 `useA` 和 `useB`，它们都返回 `data`：
>
>javascript
>
>```
>// 在 setup 中
>const { data } = useA(); 
>const { data } = useB(); // ❌ 报错：重复声明 data
>```
>
>
>
>**重点来了**：JavaScript 的语法检查会**立刻**在你编写代码时抛出错误（或 ESLint 红线）。你只需要随手重命名：
>
>javascript
>
>```
>const { data: dataA } = useA();
>const { data: dataB } = useB();
>```
>
>
>
>这种冲突是**显式**的，在你写代码的当下就被解决了，而非等到运行时出现诡异的数据错乱。
>
>------
>
>### 2. 来源的透明度（可维护性天壤之别）
>
>- **Mixin**：模板中使用 `this.handleClick`，你要想知道这个函数是哪个 Mixin 提供的，必须打开文件头部的 `mixins: [A, B, C]` 数组，然后逐个点开文件去查找。**依赖关系像“隐式继承”**。
>- **Composition API**：模板中使用 `dataA` 或 `handleA`，你直接在 `setup` 顶层的 `return {}` 里一看，就能精准知道这个变量来自 `useA` 函数。**依赖关系像“显式组合”**。这就是“按需导入”带来的附带好处——**代码即文档**。
>
>------
>
>### 3. 内部逻辑的耦合性（为什么 Mixin 容易“死”）
>
>- **Mixin**：Mixin A 内部可能会调用 `this.xxx`，而这个 `xxx` 恰好是 Mixin B 提供的。这就导致 Mixin 之间产生了**隐式依赖**。当你删除或修改 Mixin B 时，Mixin A 会悄无声息地坏掉，维护极其困难（著名的“Mixin 脆弱链条”）。
>- **Composition API**：`useVirtualList` 返回的 `scrollTop`、`visibleItems` 全都是独立的响应式引用。如果 `useA` 需要 `useB` 的数据，它会**显式地作为参数传入**：
>
>javascript
>
>```
>const resultA = useA();
>const resultB = useB(resultA.someData); // 依赖关系一目了然
>```
>
>
>
>这是纯函数式的组合，输入输出明确，不存在“隐式魔法”。
>
>------
>
>### 4. 类型推导（TypeScript 支持）
>
>- **Mixin**：Vue2 的 Mixin 类型推导极其复杂，TypeScript 很难正确推导出 `this` 上混入的属性，经常需要手动 `extends` 或声明合并，体验很差。
>- **Composition API**：`useVirtualList` 就是一个普通的函数，它返回的对象类型完全可以被 TS 完美推导。变量重命名后，TS 依然能精准追踪类型。**按需导入的函数天然具有完美的类型推断。**
>
>------
>
>### 5. 关于“按需导入”的真正价值
>
>你提到的“按需导入”不仅仅是“节省打包体积”（虽然 Tree-shaking 确实能摇掉没用到的函数）。
>
>**更重要的价值在于“逻辑颗粒度”**：
>在 Vue2 中，你为了复用 1 个方法，往往要把整个 Mixin 全部引入，连带一堆你用不到的数据和生命周期钩子都塞进组件里。
>而在 Composition API 中，你可以**只取你想要的返回值**：
>
>javascript
>
>```
>// 我只想要滚动的数据，不要它的更新方法
>const { visibleItems, totalHeight } = useVirtualList(list, { itemHeight: 100 });
>```
>
>
>
>这种“精确解构”让组件的输入输出变得极其干净，最大程度减少了不必要的耦合。
>
>
>
>**Mixin 的问题不是“变量名重复”，而是“黑盒式的隐式合并”导致了不确定性和高耦合。**
>**Composition API 即使有变量名重复，也是“白盒式的显式作用域”，你可以轻松地用解构重命名来解决，而且来源清晰、逻辑透明、易于测试。**

