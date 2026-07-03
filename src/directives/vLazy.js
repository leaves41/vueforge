// src/directives/vLazy.js

/**
 * 图片懒加载指令 v-lazy
 * 用法：<img v-lazy="imageUrl" />
 * 可选：<img v-lazy="imageUrl" placeholder="占位图" />
 */
export const vLazy = {
  mounted(el, binding) {
    // 保存展位图
    let placeholder = binding.modifiers?.placeholder || ''

    //如果传入的是对象，则取其中的属性
    const src = typeof binding.value === 'string' ? binding.value : binding.value?.src

    if (!src) {
      console.warn('v-lazy 需要传入图片地址')
      return
    }

    //设置占位图
    if (placeholder) {
      el.src = placeholder
    } else {
      // 默认占位：灰色背景
      el.style.backgroundColor = '#f0f0f0'
      el.style.minHeight = '100px'
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new Image()
            img.onload = () => {
              el.src = src
              el.style.backgroundColor = 'transparent'
              el.style.minHeight = 'auto'
            }

            img.onerror = () => {
              // 加载失败显示错误占位
              el.src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ccc"%3E%3Crect width="24" height="24" fill="%23f0f0f0"/%3E%3Ctext x="12" y="14" text-anchor="middle" font-size="10" fill="%23999"%3E❌%3C/text%3E%3C/svg%3E'
            }

            img.src = src

            // 停止观察
            observer.unobserve(el)
          }
        })
      },
      {
        // 提前 100px 开始加载
        rootMargin: '100px',
        threshold: 0.01
      }
    )

    //开始监听
    observer.observe(el)

    // 保存 observer 以便清理
    el._lazyObserver = observer
  },
  unmounted(el) {
    if (el._lazyObserver) {
      el._lazyObserver.unobserve(el)
      delete el._lazyObserver
    }
  }
}
