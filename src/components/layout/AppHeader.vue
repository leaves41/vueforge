<template>
    <header class="app-header">
      <div class="header-container">
        <!-- Logo -->
        <div class="logo" @click="$router.push('/')">
          <span class="logo-icon">⚡</span>
          <span class="logo-text">VueForge</span>
        </div>
  
        <!-- 导航菜单 -->
        <nav class="nav-menu">
          <router-link to="/" class="nav-item" active-class="active" exact>
            <span>🏠</span> 首页
          </router-link>
          <router-link to="/category" class="nav-item" active-class="active">
            <span>📂</span> 分类
          </router-link>
          <router-link to="/tag" class="nav-item" active-class="active">
            <span>🏷️</span> 标签
          </router-link>
          <router-link to="/about" class="nav-item" active-class="active">
            <span>👤</span> 关于
          </router-link>
        </nav>
  
        <!-- 右侧功能区 -->
        <div class="header-actions">
          <!-- 搜索按钮 -->
          <button class="action-btn" @click="emit('toggleSearch')" title="搜索">
            <span>🔍</span>
          </button>
  
          <!-- 暗色模式切换 -->
          <button class="action-btn" @click="toggleTheme" :title="isDark ? '切换到亮色' : '切换到暗色'">
            <span>{{ isDark ? '☀️' : '🌙' }}</span>
          </button>
  
          <!-- 用户 -->
          <div v-if="userStore.isLoggedIn" class="user-info">
            <img :src="userStore.avatar" alt="avatar" class="avatar" />
            <span class="username">{{ userStore.username }}</span>
          </div>
          <button v-else class="action-btn" @click="$router.push('/login')">
            <span>🔑</span> 登录
          </button>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useAppStore } from '@/store/modules/appStore'
  import { useUserStore } from '@/store/modules/userStore'
  
  const appStore = useAppStore()
  const userStore = useUserStore()
  
  const isDark = computed(() => appStore.isDarkMode)
  
  const emit = defineEmits(['toggleSearch'])
  
  function toggleTheme() {
    appStore.toggleDarkMode()
  }
  </script>
  
  <style lang="scss" scoped>
  @import '@/assets/styles/variables.scss';
  
  .app-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--color-bg-card);
    border-bottom: 1px solid var(--color-border);
    backdrop-filter: blur(8px);
    transition: background $transition-base, border-color $transition-base;
  }
  
  .header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 $spacing-lg;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    cursor: pointer;
    user-select: none;
  
    .logo-icon {
      font-size: $font-size-xl;
    }
  
    .logo-text {
      font-size: $font-size-lg;
      font-weight: 700;
      color: $color-primary;
      letter-spacing: -0.5px;
    }
  }
  
  .nav-menu {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  
    .nav-item {
      padding: $spacing-sm $spacing-md;
      border-radius: $radius-md;
      color: var(--color-text-secondary);
      font-weight: 500;
      transition: all $transition-fast;
  
      &:hover {
        color: $color-primary;
        background: var(--color-bg-hover);
      }
  
      &.active {
        color: $color-primary;
        background: rgba($color-primary, 0.1);
      }
  
      span {
        margin-right: $spacing-xs;
      }
    }
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  
    .action-btn {
      padding: $spacing-sm $spacing-md;
      border: none;
      background: transparent;
      border-radius: $radius-md;
      cursor: pointer;
      font-size: $font-size-md;
      color: var(--color-text-secondary);
      transition: all $transition-fast;
  
      &:hover {
        background: var(--color-bg-hover);
        color: $color-primary;
      }
    }
  
    .user-info {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding-left: $spacing-sm;
  
      .avatar {
        width: 32px;
        height: 32px;
        border-radius: $radius-full;
        border: 2px solid var(--color-border);
      }
  
      .username {
        font-size: $font-size-sm;
        font-weight: 500;
        color: var(--color-text-primary);
      }
    }
  }
  
  // 响应式
  @media (max-width: 768px) {
    .nav-menu {
      display: none;
    }
    .header-container {
      padding: 0 $spacing-md;
    }
  }
  </style>