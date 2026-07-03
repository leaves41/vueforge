import { ref, computed, onMounted, onUnmounted } from 'vue'

/**虚拟列表
 * array  完整的数据列表
 * options 配置项
 * options.itemHeight  每个元素的大小
 * options.bufferSize  缓冲区大小
 */

export function useVirtualList(items, options) {
  const { itemHeight = 80, bufferSize = 3 } = options

  //状态变量
  const containerRef = ref(null) //最外层虚拟列表实例
  const scrollTop = ref(0) //距离顶部的滑动距离
  const containerHeight = ref(0) //屏幕视口高度

  //计算属性

  const totalItems = computed(() => items.value.length || 0)
  const totalHeight = computed(() => totalItems.value * itemHeight)

  //计算可视区域内有多少项目
  const visibleCount = computed(() => {
    return Math.ceil(containerHeight.value / itemHeight + bufferSize * 2)
  })

  //计算起始角标
  const startIndex = computed(() => {
    return Math.max(0, Math.floor(scrollTop.value / itemHeight) - bufferSize)
  })
  //计算结束角标
  const endIndex = computed(() => {
    return Math.min(totalItems.value, startIndex.value + visibleCount.value)
  })

  //可视区域的数据列表
  const visibleItems = computed(() => {
    return items.value.slice(startIndex.value, endIndex.value) || []
  })

  //偏移量
  const offsetY = computed(() => startIndex.value * itemHeight)

  function onScroll(event) {
    scrollTop.value = event.target.scrollTop
  }

  function updateContainerHeight() {
    if (containerRef.value) {
      containerHeight.value = containerRef.value.clientHeight
    }
  }

  onMounted(() => {
    setTimeout(() => {
      updateContainerHeight()
    }, 0)

    // 监听窗口大小变化
    window.addEventListener('resize', updateContainerHeight)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateContainerHeight)
  })

  return {
    containerRef,
    scrollTop,
    visibleItems,
    totalHeight,
    offsetY,
    onScroll,
    updateContainerHeight,
    // 暴露一些便捷信息
    total: totalItems,
    start: startIndex,
    end: endIndex
  }
}
