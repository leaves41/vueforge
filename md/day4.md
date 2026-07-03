# 任务目标

| 任务                             | 核心知识点                        | 难度  |
| :------------------------------- | :-------------------------------- | :---- |
| **1. 虚拟列表（长列表优化）**    | 渲染性能、`useVirtualList`        | ⭐⭐⭐⭐⭐ |
| **2. 图片懒加载（`v-lazy`）**    | Intersection Observer、自定义指令 | ⭐⭐⭐⭐  |
| **3. 打包分析与优化**            | Vite 配置、代码分割、Tree Shaking | ⭐⭐⭐⭐  |
| **4. 错误边界（ErrorBoundary）** | `onErrorCaptured`、异常处理       | ⭐⭐⭐   |

---

# 1. 虚拟列表学习

- 虚拟列表一共有四层构成
  - 第一层，固定高度，`overflow: auto`，负责提供滚动条和视口
  - **第二层（占位层 Phantom）**：高度是 `totalHeight`（比如 80000px）。**它的任务只有一个：撑开滚动条，让浏览器觉得“内容有 8 万像素高”。**
  - **第三层（偏移层 ）灵魂层级**：`transform` 让虚拟列表实现了“只渲染一小段 DOM，却能在滚动轨道上任意位置精准悬浮显示”的魔法
  - 第四层 内容层，vfor循环内容

理解起来就像是，第一层提供了一个滑动窗口，第二层站住位置，让滑动列表的滑块根据有多少数据变小，第三层用transform将本来该显示在最上方的实际数据列表刚好显示在滑动窗口内，第一层提供@scroll方法，每次滚动重新计算偏移量和展示的内容





# 2. # 图片懒加载

   >图片懒加载的懒体现在哪里？
   >
   >图片在后台下载，先显示占位图，等到完全下载完成才显示，这样做可以避免布局抖动
   >
   >
   >
   >图片懒加载实现步骤：
   >
   >1. 创建监听器，监听dom进入屏幕的时间
   >2. 进入屏幕后创建image下载图片
   >3. 在图片onload完成后赋值给el，完成图片显示
   >
   >
   >
   >### 代码顺序陷阱
   >
   >步骤2和步骤3顺序要反过来
   >
   >- **错误写法（你可能会这样想）**：
   >
   >  ```
   >  img.src = src        // 2. 开始下载
   >  img.onload = () => { // 3. 监听完成
   >    el.src = src
   >  }
   >  ```
   >
   >- **正确写法（源码中的写法）**：
   >
   >  ```
   >  img.onload = () => { // 必须先绑定监听
   >    el.src = src
   >  }
   >  img.src = src        // 再开始下载
   >  ```
   >
   >  因为如果图片**命中浏览器缓存**，`img.src = src` 这一行执行时，图片会**立即（同步地）**从硬盘缓存中加载完成，`onload` 事件会瞬间被触发。
   >  如果你把 `img.src = src` 写在前面，等执行到 `img.onload = ...` 时，图片早就加载完了，**事件监听器就错过了这次触发**，导致 `el.src` 永远不会被赋值，图片卡死在占位图状态。
   >
   >  
   >
   >  
   >
   >  

   

# 3. 打包分析与优化

插件指令：

```
npm install rollup-plugin-visualizer -D
npm install -D terser
```

vite.config.js

```
// vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import { viteMockServe } from 'vite-plugin-mock'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
    viteMockServe({
      mockPath: 'mock',
      enable: true,
      logger: true,
    }),
    // 打包分析（只在构建时启用）
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // 手动代码分割
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['element-plus', 'ant-design-vue'],
        },
      },
    },
    // 压缩选项
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除 console
        drop_debugger: true,
      },
    },
    // 生成 SourceMap（调试用）
    sourcemap: false,
  },
})
```

添加package.json指令

```
"analyze": "npm run build -- --mode analyze"
"analyze": "vite build -- --mode analyze"
```









# QA

#### Q1: 你的虚拟列表原理是什么？为什么不用 `display: none` 或 `v-if`？

**💡 专业回答（面试官频频点头版）**：

> “虚拟列表的核心思想是**只渲染用户可视区域内的 DOM**。原理是监听滚动容器的 `scrollTop`，通过公式 `startIndex = Math.floor(scrollTop / itemHeight)` 计算出当前应该从数据数组的哪个位置开始截取。
>
> **为什么不直接用 `v-if`？**
> 如果使用 `v-if` 或 `display: none`，虽然视觉上隐藏了，但**DOM 节点依然存在于内存中**。当列表有 10 万条数据时，浏览器依然会为每个节点分配内存和事件监听，导致页面卡顿甚至崩溃。虚拟列表在 DOM 层面只维持了 `visibleCount + bufferSize` 个节点（比如 20 个），**无论数据量多大，DOM 节点数恒定**，这才是真正的性能优化。”

#### Q2: 如果列表项高度不固定（动态高度），你的虚拟列表会出问题吗？怎么解决？

**💡 专业回答（展示深度）**：

> “会！固定高度的虚拟列表计算 `startIndex` 和 `offsetY` 完全依赖 `itemHeight`，如果高度不固定，滚动条长度和可视区域内容就会错乱。
>
> **解决方案有两种**：
>
> 1. **预估高度 + 动态修正**：给每个项一个预估高度，渲染后通过 `getBoundingClientRect()` 获取真实高度，缓存起来，后续滚动时根据缓存的实际高度重新计算 `startIndex`。
> 2. **改用 `ResizeObserver`**：监听每个列表项的大小变化，动态更新高度缓存。
>
> 在实际项目中，如果列表内容差异较大（比如文章标题长短不一），**动态高度方案会更复杂**，通常我们会建议后端限制文本字数，或者统一使用卡片布局来保证高度一致。”

### 🎯 第二类：图片懒加载与自定义指令

#### Q3: 你写的 `v-lazy` 指令底层用了什么 API？为什么不用 `scroll` 事件监听？

**💡 专业回答**：

> “底层用了 **Intersection Observer API**。这是浏览器原生提供的异步观察 API，用于监测元素是否进入视口。
>
> **为什么不用 `scroll` 事件？**
> `scroll` 事件会**高频触发**（每秒触发几十次），需要手动做节流（`throttle`），而且判断 `getBoundingClientRect().top` 会**强制回流**，严重影响性能。
>
> `Intersection Observer` 是**浏览器底层异步**的，它在 `requestIdleCallback` 阶段执行，完全**不阻塞主线程**，性能更优。我还在指令里加了 `rootMargin: '100px'`，让图片提前 100px 开始加载，用户根本感觉不到加载延迟。”



### 🎯 第三类：打包分析与构建优化

#### Q4: 项目打包后体积太大了，你一般会怎么分析和优化？

**💡 专业回答（条理清晰版）**：

> “我会分 **4 步** 系统化处理：
>
> 1. **分析**：用 `rollup-plugin-visualizer` 生成 `stats.html`，看哪些模块占空间最大。
> 2. **代码分割（Code Splitting）**：在 `vite.config.js` 的 `manualChunks` 中，把 `vue`、`vue-router`、`pinia` 抽成 `vue-vendor`，把 UI 库抽成 `ui-vendor`，利用浏览器缓存减少重复加载。
> 3. **删除冗余**：生产环境用 `terserOptions` 移除 `console.log` 和 `debugger`。
> 4. **按需加载**：检查是否引入了完整的第三方库（如 `lodash`），换成 `lodash-es` 或按需引入组件。
>
> **面试官追问：你们的 `chunk` 文件命名策略是什么？**
> **答**：用 `[name]-[hash]` 格式。`[hash]` 根据文件内容变化，文件没变则哈希不变，用户浏览器可以利用缓存，不用每次重新下载。”

#### Q5: Vite 和 Webpack 在打包原理上有什么本质区别？

**💡 专业回答**：

> “**Webpack** 是**打包时（Bundle）** 构建，它会将所有的模块先打包成一个或多个 `bundle.js`，再启动开发服务器，项目越大启动越慢。
>
> **Vite** 利用浏览器原生 **ES Module (ESM)**，在开发环境下**不打包（No Bundle）**，直接通过 `type="module"` 让浏览器按需加载文件。Vite 只对 `node_modules` 中的依赖进行 **预构建（Pre-bundling）**，使用 `esbuild`（Go 语言编写）极速处理。
>
> 到了**生产环境**，Vite 内部依然使用 **Rollup** 打包，兼顾了开发体验和生产优化。”



### 🎯 第四类：错误边界与稳定性

#### Q6: 你的 `ErrorBoundary` 组件能捕获所有错误吗？它捕获不到什么？

**💡 专业回答（犀利且真诚）**：

> “**不能**。`onErrorCaptured` 只能捕获**组件内部**的错误，包括生命周期钩子、模板渲染和事件处理器。
>
> **捕获不到的情况有**：
>
> 1. **异步回调**（`setTimeout`、`Promise` 中抛出的错误）
> 2. **事件监听器中的错误**（除非用 `try-catch` 包裹）
> 3. **组件树之外**的全局错误。
>
> 所以，我通常采用**多层防护**：
>
> - 组件层用 `ErrorBoundary`（降级 UI）
> - 全局层用 `app.config.errorHandler`（上报日志）
> - 异步层用 `window.addEventListener('unhandledrejection')`（捕获未处理的 Promise 错误）
> - 接口层用 Axios 拦截器（捕获 HTTP 异常）
>
> 这样即使 JS 出错，页面也不会白屏，用户能看到友好的提示。”



#### Q7: 为什么要在 Axios 拦截器里处理 401，而不是在每个请求里写 `catch`？

**💡 专业回答（展示工程化思维）**：

> “如果每个请求都写 `catch` 处理 401，代码里会出现几百处重复逻辑，且一旦登录态过期逻辑调整（比如跳转路由变了），维护就是灾难。
>
> 我采用**响应拦截器统一处理**，让业务代码保持干净。
> **实现细节**：在拦截器里，我使用 `useUserStore()` 清除 Token，并利用 `window.location.href` 跳转到登录页。同时，我还会**记录当前路径**（`router.currentRoute.value.fullPath`），登录成功后自动跳回原页面，提升用户体验。”



### 🎯 第五类：综合能力（决定薪资的题）

#### Q8: 假如用户反馈页面滚动特别卡，你觉得可能是什么原因？怎么排查？

**💡 专业回答（体现 Debug 思路）**：

> “我会按以下路径排查：
>
> 1. **检查列表数据量**：是不是直接渲染了上千条 DOM？如果是，立即上虚拟列表。
> 2. **检查滚动监听**：有没有在 `@scroll` 里做复杂计算？如果有，改用 `Intersection Observer` 或加上 `requestAnimationFrame` 节流。
> 3. **检查图片加载**：图片是否过大？有没有做懒加载？如果没有，用 `v-lazy`。
> 4. **开启 Performance 面板**：录制一次滚动操作，看是 **Scripting（JS 执行）** 耗时还是 **Rendering（样式计算/回流）** 耗时。如果是回流问题，检查是否有频繁触发的 `getBoundingClientRect` 或 `offsetTop` 读写操作，将它们合并到 `requestAnimationFrame` 中执行。”

### 🚀 面试急救包（万一被问住怎么办？）

**如果面试官问：虚拟列表怎么支持 `keep-alive` 缓存滚动位置？**

> **答**：这是一个很好的优化点。虚拟列表的滚动位置本质是 `scrollTop`。如果页面被 `KeepAlive` 缓存，我可以在 `onActivated` 时读取存储的 `scrollTop`，通过 `containerRef.value.scrollTop = savedScrollTop` 恢复位置。这通常配合 `onDeactivated` 时保存 `scrollTop` 来实现。

**如果面试官问：打包出来的 `vendor` 文件特别大怎么办？**

> **答**：我会检查 `manualChunks` 的策略。如果 `vue-vendor` 超过 500kb，考虑进一步拆分（如 `vue` 单独拆，`element-plus` 单独拆）。同时开启 **gzip 压缩**（Nginx 或 Vite 的 `compress` 插件），gzip 后通常能减少 70% 的体积。





