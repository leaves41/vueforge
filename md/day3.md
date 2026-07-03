# 任务目标

- [x] **自定义指令 `v-permission`**
- [x] 自定义指令  **`v-debounce`**
- [x]  **评论系统（嵌套评论）**
- [x] **表单处理（发布文章）**

---



# 知识点

## 1.自定义指令

除了 Vue 内置的一系列指令 (比如 `v-model` 或 `v-show`) 之外，Vue 还允许你注册自定义的指令 (Custom Directives)。

### 自定义指令的使用时机

>只有当所需功能只能通过直接的 DOM 操作来实现时，才应该使用自定义指令。
>
>**"自定义指令"是 Vue 留给你的"后门"**——当 Vue 的模板语法（`v-if`、`v-for`、`` 等）和组件化方案**无法触及**底层 DOM 原生操作时，才需要打开这个后门。
>
>**换句话说**：能用**模板**解决的，绝不用**指令**；能用**组件**封装的，绝不用**指令**。

### 使用方法

1. 编写自定义js逻辑
2. 使用到dom上

```vue
<div v-Highlight>
    vHighlight
</div>
-------------------------------------------------
const vHighlight = {
    mounted: (el) => {
        el.classList.add('is-highlight')
    }
}
-------------------------------------------------

.is-highlight {
    background-color: bisque;
}

```



### 3 个典型场景

- #### 操作 DOM 的原生 API（焦点、滚动、尺寸）

​		你想让一个输入框在页面加载后**自动获得焦点**。Vue 的模板语法做不到这一点，必须调用原生 `input.focus()`。

```vue
// ✅ 正确使用自定义指令
Vue.directive('focus', {
  mounted(el) {
    el.focus() // 直接的 DOM 操作
  }
})

// 使用
<input v-focus />
```



- #### 集成第三方非 Vue 的 JS 库

​		比如你引入了 jQuery 插件、ECharts 图表、或者一个原生 JS 的拖拽库。这些库的初始化方法都需要**传入一个真实的 DOM 元素**。

```vue
// ✅ 正确使用自定义指令（以 ECharts 为例）
Vue.directive('chart', {
  mounted(el, binding) {
    const chart = echarts.init(el) // 直接用 DOM 元素初始化
    chart.setOption(binding.value)
  }
})

// 使用
<div v-chart="chartOptions" style="width:400px;height:300px"></div>
```

- #### 监听浏览器原生事件（且需要精确控制）

比如你想监听**点击页面其他地方关闭弹窗**（`clickoutside`），或者监听**滚动到底部加载更多**。这些事件的绑定和移除，必须直接操作 `document` 或 `window` 对象。

```vue
// ✅ 正确使用自定义指令（点击外部关闭）
Vue.directive('click-outside', {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value() // 执行关闭方法
      }
    }
    document.addEventListener('click', el.clickOutsideEvent) // 直接的 DOM 操作
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent) // 必须清理
  }
})

// 使用
<div v-click-outside="closeModal">弹窗内容</div>
```



## 2.gap，   cursor  这些css属性是干嘛的？

### gap

>它专门用来设置**网格（Grid）**、**弹性盒子（Flex）** 和**多列（Columns）**布局中项目之间的间距。
>
>**核心要点：** 它设置的是**项目之间**的间距，而不是项目**周围**的边距（margin）。
>
>   gap: <row-gap> <column-gap>;

### `cursor` 属性（改变鼠标样式）

>它用来指定当鼠标指针悬停在元素上时，应该显示成什么样式。这能极大地提升用户体验，告诉用户这个元素是可点击的、可拖动的，还是正在加载等。
>
>| 值                     | 效果                   | 使用场景                             |
>| :--------------------- | :--------------------- | :----------------------------------- |
>| `default`              | 默认箭头（通常为箭头） | 普通文本或普通区域                   |
>| `pointer`              | 小手 👆                 | **按钮、链接**，表示可点击           |
>| `text`                 | I 字形光标             | 文本输入框或可选中文本的区域         |
>| `wait`                 | 沙漏或转圈圈 ⏳         | 表示程序正在加载，不能操作           |
>| `progress`             | 箭头加转圈圈           | 表示程序正在加载，但仍可操作         |
>| `move`                 | 十字箭头               | 表示元素可以被拖动移动               |
>| `grab`                 | 手掌张开 ✋             | 表示可抓取拖动的元素（如滚动条滑块） |
>| `grabbing`             | 手掌合拢 ✊             | 表示正在抓取拖动中                   |
>| `not-allowed`          | 禁止符号 🚫             | 表示当前操作被禁止                   |
>| `zoom-in` / `zoom-out` | 放大镜➕ / ➖            | 表示可放大或缩小视图                 |



## 3.递归实现评论系统组件

组件内部调用自己

# QA

#### Q1: 你项目里为什么要封装 `v-permission` 指令？它的原理是什么？

**💡 专业回答**：

> “在后台管理系统中，按钮级的权限控制是刚需。如果不用指令，我需要在每个按钮上写 `v-if="user.role === 'admin'"`，代码极度冗余且难以维护。
>
> 我封装了 `v-permission` 指令，它接收一个角色字符串或数组。**原理**是在指令的 `mounted` 钩子中，从 Pinia 的 `userStore` 里取出当前用户角色，与传入值比对。如果无权限，则通过 `el.style.display = 'none'` 或 `el.remove()` 移除该 DOM 元素。
>
> 而且我考虑了**动态权限变更**，在 `updated` 钩子中重新判断，这样即使用户信息更新，视图也能自动响应。”

#### Q2: Vue 3 自定义指令的钩子函数有哪些？`mounted` 和 `updated` 有什么区别？

**💡 专业回答**：

> “Vue 3 自定义指令主要有 7 个生命周期钩子，最常用的是 `mounted`、`updated` 和 `unmounted`。
>
> - **`mounted`**：指令**第一次**绑定到元素时触发，只执行一次，适合做初始化。
> - **`updated`**：指令所在的组件 **DOM 更新后**触发，适合做权限或值的响应式更新。
> - **核心区别**：`mounted` 是 ‘**入局**’，`updated` 是 ‘**应变**’。比如用户从普通用户切到管理员，`updated` 会重新判断权限，`mounted` 不会。”

#### Q3: 你在项目里用 `v-debounce` 解决了什么问题？如果不防抖会怎样？

**💡 专业回答**：

> “我在搜索框里用了 `v-debounce`。如果不做防抖，用户每敲一个字母都会触发一次 API 请求，这会造成**服务器压力激增**和**前端渲染卡顿**，且请求返回顺序错乱会导致展示错误数据。
>
> 我封装了 `v-debounce` 指令，它通过 `setTimeout` 维护一个等待队列。当用户连续输入时，前一个 `timer` 被清空，直到用户停止输入 `300ms` 后才真正执行函数。这极大提升了搜索体验，也节省了服务器资源。”

#### Q4: 你做的 `v-debounce` 和直接在 `@input` 里写 `setTimeout` 有什么优势？

**💡 专业回答**：

> “写在 `@input` 里是**强耦合**，每个需要防抖的地方都要复制一遍逻辑，且容易内存泄漏（忘记清除 `timer`）。
>
> 封装成 `v-debounce` 指令是**声明式**的，只需要 `v-debounce:500="search"` 即可，**关注点分离**让模板更干净。指令内部还统一管理了 `timer` 的清除，并且在 `unmounted` 时会自动清理事件监听，避免了内存泄漏。”

#### Q5: 你的评论组件是如何实现“回复套回复”无限层级的？

**💡 专业回答**：

> “我用了**递归组件**。`CommentItem` 组件会先渲染当前评论，然后检查 `comment.replies` 数组。如果有子评论，就会在内部再次调用自己 `<CommentItem v-for="..."/>`，并设定一个 `depth` 属性来逐层缩进。
>
> **关键点**：递归组件必须设置 `name` 属性，以便在模板中引用自身。同时，为了防止死循环，数据结构必须是树形结构，且后台限制了最大层级。”
>
> **面试官追问：递归组件的 `key` 怎么处理？**
> **答**：“用子评论的 `id` 做 `key`，比如 `:key="reply.id"`，确保 Vue 能精准追踪每个节点的身份，避免状态错乱。”

#### Q6: 为什么用 `useUserStore()` 而不是 `inject('userStore')`？

**💡 专业回答**：

> “这是一个很好的切入点。虽然 `inject` 能拿到数据，但在 Pinia 架构下是**反模式**。
>
> 1. **依赖溯源**：`useUserStore()` 直接从 Pinia 根实例拿数据，是**单例模式**；而 `inject` 依赖父级 `provide`，一旦父级没提供或组件被挪动，就会报错。
> 2. **类型安全**：`useUserStore()` 有完美的 TypeScript 类型推导；`inject('...')` 返回 `unknown`，需要手动断言，容易出错。
> 3. **设计原则**：Pinia 官方就是设计用来替代 `provide/inject` 进行全局状态管理的。我们只在**特定上下文（如主题、语言）** 用 `inject`，全局状态统一走 Store。”

### 🎯 第四类：关于表单与 `v-model`

#### Q7: 你做的发布文章表单，如果用户没填标题就提交，你是怎么拦截的？

**💡 专业回答**：

> “我做了**前端轻校验**。在 `@submit.prevent` 的 `handleSubmit` 方法里，我对必填项（标题、分类、内容）做了 `trim()` 判空。同时，我利用 `required` 属性做了 H5 原生提示。
>
> 另外，我利用了 **`v-model.trim`** 修饰符，自动过滤首尾空格，防止用户只输入空格造成‘假数据’。如果校验不通过，会用 `alert` 或 `notification` 组件提示用户，不会真正发起 API 请求。”

#### Q8: 为什么vue-for循环中不使用序号来当成Key值呢

**💡 专业回答**：

>：**在 `v-for` 中使用序号（index）作为 `key`，等于“没有用”甚至“负作用”，因为它无法准确跟踪每个节点的身份，会导致 DOM 复用错乱、组件状态丢失，以及性能下降。**
>
>**因为 Index 是“位置”而不是“身份”。** 一旦数据顺序发生变化（增、删、改、排序），Index 和数据的绑定关系就断裂了。

