<template>
  <div class="app-layout">
    <AppHeader @toggle-search="showSearch = !showSearch" />

    <!-- 搜索浮层（后续实现） -->
    <div v-if="showSearch" class="search-overlay">
      <div class="search-container">
        <input ref="searchInput" v-model="searchKeyword" type="text" placeholder="搜索文章..." class="search-input"
          @keyup.enter="handleSearch" />
        <button class="search-close" @click="showSearch = false">✕</button>
      </div>
    </div>

    <!-- 主内容区域 -->
    <main class="main-content">
      <div class="container">
        <!-- 使用 KeepAlive 缓存页面 -->
        <ErrorBoundary>
          <RouterView v-slot="{ Component, route }">
            <KeepAlive :include="cachedViews">
              <component :is="Component" :key="route.fullPath" />
            </KeepAlive>
          </RouterView>
        </ErrorBoundary>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterView } from 'vue-router'
import ErrorBoundary from '@/components/common/ErrorBoundary.vue'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'

const showSearch = ref(false)
const searchKeyword = ref('')
const searchInput = ref(null)

// 需要缓存的页面（通过路由 meta.keepAlive 控制）
const cachedViews = computed(() => {
  // 可以从路由中动态收集
  return ['Home', 'onHandler']
})

function handleSearch() {
  if (searchKeyword.value.trim()) {
    // 跳转到搜索页
    // 这里后续实现
    console.log('搜索:', searchKeyword.value)
    showSearch.value = false
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: $spacing-xl 0;
  min-height: 60vh;
}

.search-overlay {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
  padding: $spacing-md $spacing-lg;
  z-index: 99;
  animation: slideDown 0.25s ease;

  .search-container {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    gap: $spacing-sm;
  }

  .search-input {
    flex: 1;
    padding: $spacing-md $spacing-lg;
    border: 2px solid var(--color-border);
    border-radius: $radius-lg;
    font-size: $font-size-md;
    background: var(--color-bg);
    color: var(--color-text-primary);
    outline: none;
    transition: border-color $transition-fast;

    &:focus {
      border-color: $color-primary;
    }
  }

  .search-close {
    padding: 0 $spacing-lg;
    border: none;
    background: transparent;
    font-size: $font-size-xl;
    color: var(--color-text-muted);
    cursor: pointer;

    &:hover {
      color: var(--color-text-primary);
    }
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>