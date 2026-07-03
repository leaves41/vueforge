<!-- src/views/Dashboard/index.vue -->
<template>
  <div class="dashboard">
    <h1>📊 文章管理（虚拟列表）</h1>
    <p class="info">共 {{ total }} 篇文章，当前显示第 {{ start + 1 }} - {{ end }} 条</p>

    <div ref="containerRef" class="virtual-scroll-container" @scroll="onScroll">
      <div class="virtual-scroll-phantom" :style="{ height: `${totalHeight}px` }">
        <div class="virtual-scroll-content" :style="{ transform: `translateY(${offsetY}px)` }">
          <div v-for="item in visibleItems" :key="item.id" class="virtual-item">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-meta">
              <span class="category">{{ item.category }}</span>
              <span class="date">{{ formatDate(item.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useVirtualList } from '@/composables/useVirtualList'
import dayjs from 'dayjs'
import { translate } from 'element-plus'

// 模拟 1000 条数据
const allItems = ref(
  Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    title: `Vue 3 实战文章 ${i + 1}`,
    category: ['Vue', 'React', 'CSS', 'JavaScript'][i % 4],
    createdAt: new Date().toISOString(),
  }))
)

const {
  containerRef,
  visibleItems,
  totalHeight,
  offsetY,
  onScroll,
  total,
  start,
  end,
} = useVirtualList(allItems, {
  itemHeight: 80,
  bufferSize: 3
})

function formatDate(date) {
  return dayjs(date).format('YYYY-MM-DD')
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.dashboard {
  padding: $spacing-xl 0;

  .info {
    color: var(--color-text-muted);
    margin-bottom: $spacing-md;
  }
}

.virtual-scroll-container {
  height: 600px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  background: var(--color-bg-card);
  position: relative;
}

.virtual-scroll-phantom {
  position: relative;
  width: 100%;
}

.virtual-scroll-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.virtual-item {
  height: 80px;
  padding: $spacing-md $spacing-lg;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: background $transition-fast;

  &:hover {
    background: var(--color-bg-hover);
  }

  .item-title {
    font-weight: 500;
    color: var(--color-text-primary);
    margin-bottom: $spacing-xs;
  }

  .item-meta {
    display: flex;
    gap: $spacing-md;
    font-size: $font-size-xs;
    color: var(--color-text-muted);

    .category {
      padding: 0 $spacing-sm;
      background: rgba($color-primary, 0.1);
      color: $color-primary;
      border-radius: $radius-sm;
    }
  }
}
</style>