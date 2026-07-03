<!-- src/components/common/ErrorBoundary.vue -->
<template>
    <div v-if="hasError" class="error-boundary">
      <div class="error-content">
        <span class="error-icon">😅</span>
        <h2>{{ errorTitle }}</h2>
        <p>{{ errorMessage }}</p>
        <button class="retry-btn" @click="retry">重新加载</button>
      </div>
    </div>
    <slot v-else />
  </template>
  
  <script setup>
  import { ref, onErrorCaptured } from 'vue'
  
  const props = defineProps({
    errorTitle: {
      type: String,
      default: '出错了',
    },
    errorMessage: {
      type: String,
      default: '页面加载失败，请重试',
    },
  })
  
  const hasError = ref(false)
  
  // 捕获子组件错误
  onErrorCaptured((err, instance, info) => {
    console.error('❌ ErrorBoundary 捕获到错误:', err, info)
    hasError.value = true
    
    // 阻止错误继续冒泡
    return false
  })
  
  function retry() {
    hasError.value = false
    // 重新加载当前页面
    window.location.reload()
  }
  </script>
  
  <style lang="scss" scoped>
  @import '@/assets/styles/variables.scss';
  
  .error-boundary {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    padding: $spacing-xl;
  }
  
  .error-content {
    text-align: center;
    max-width: 400px;
    
    .error-icon {
      font-size: 48px;
      display: block;
      margin-bottom: $spacing-md;
    }
    
    h2 {
      font-size: $font-size-xl;
      color: var(--color-text-primary);
      margin-bottom: $spacing-sm;
    }
    
    p {
      color: var(--color-text-secondary);
      margin-bottom: $spacing-lg;
    }
    
    .retry-btn {
      padding: $spacing-sm $spacing-xl;
      background: $color-primary;
      color: #fff;
      border: none;
      border-radius: $radius-md;
      font-size: $font-size-sm;
      cursor: pointer;
      transition: background $transition-fast;
      
      &:hover {
        background: $color-primary-dark;
      }
    }
  }
  </style>