export const vDebounce = {
  mounted(el, binding) {
    //获取延迟时间
    let delay = Number(binding.arg) || 300

    //获取处理函数
    const handle = binding.value

    if (typeof handle !== 'function') {
      console.warn('v-Debounce需要传入一个处理函数')
      return
    }

    let timer = null

    //封装方法
    const handlefunc = function (event) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }

      timer = setTimeout(() => {
        handle(event)
        timer = null
      }, delay)
    }

    let eventName = binding.modifiers?.keyup ? 'keyup' : 'input'
    //保持现有函数结构
    el._debounce = {
      delay,
      eventName,
      handle,
      handlefunc
    }

    el.addEventListener(eventName, handlefunc)
  },
  updated(el, binding) {
    // 如果函数变了，需要重新绑定
    if (el._debounce?.handle !== binding.value) {
      //清理旧的定时器
      let eventName = binding.modifiers?.keyup ? 'keyup' : 'input'
      el.removeEventListener(eventName, el._debounce?.handlefunc)

      const delay = Number(binding.arg)

      const handle = binding.value

      let timer = null

      const handlefunc = function (event) {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }

        timer = setTimeout(() => {
          handle(event)
        }, delay)
      }

      el._debounce = { delay, eventName, handle, handlefunc }

      el.addEventListener(eventName, handlefunc)
    }
  },
  unmounted(el) {
    if (el._debounce) {
      const eventName = el._debounce.eventName || 'input'
      el.removeEventListener(eventName, el._debounce.handlefunc)
    }
  }
}
