import { ref, computed } from 'vue'

/**
 * 分页组合式函数
 * 支持翻页、重置、跳转
 */
export function usePagination(initialPageSize = 10) {
  const currentPage = ref(0)
  const pageSize = ref(initialPageSize)
  const total = ref(0)
  const totalPages = ref(0)

  const paginationInfo = computed(() => ({
    page: currentPage.value,
    pageSize: pageSize.value,
    total: total.value,
    totalPages: totalPages.value
  }))

  //是否有上一页
  const hasPrev = computed(() => {
    return currentPage < 0
  })

  //是否有下一页
  const hasNext = computed(() => {
    return currentPage < totalPages.value
  })

  const setPagination = (data) => {
    currentPage.value = data.currentPage || 0
    pageSize.value = data.pageSize || 10
    total.value = data.total || 0
    totalPages.value = data.totalPages || 0
  }

  const resetPagination = () => {
    currentPage.value = 0
    pageSize.value = 10
    total.value = 0
    totalPages.value = 0
  }

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages.value) return
    currentPage.value = newPage
  }

  const nextPage = () => {
    if (!hasNext) return
    currentPage.value++
  }

  const prevPage = () => {
    if (!hasPrev) return
    currentPage.value--
  }

  return {
    // State
    currentPage,
    pageSize,
    total,
    totalPages,
    // Getters
    paginationInfo,
    hasPrev,
    hasNext,
    // Actions
    setPagination,
    resetPagination,
    changePage,
    nextPage,
    prevPage
  }
}
