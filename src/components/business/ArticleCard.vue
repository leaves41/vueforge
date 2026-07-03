<template>
  <div class="article-card" @click="emit('click')">
    <!-- 封面图 -->
    <div v-if="article.cover" class="card-cover">
      <img :src="article.cover" :alt="article.title" loading="lazy" />
      <span v-if="!article.isPublished" class="badge-draft">草稿</span>
    </div>

    <!-- 内容 -->
    <div class="card-body">
      <div class="card-meta">
        <span class="category">{{ article.category }}</span>
        <span class="date">{{ formatDate(article.createdAt) }}</span>
      </div>

      <h3 class="card-title">{{ article.title }}</h3>
      <p class="card-summary">{{ article.summary }}</p>

      <div class="card-footer">
        <div class="tags">
          <span v-for="tag in article.tags" :key="tag" class="tag"> #{{ tag }} </span>
        </div>
        <div class="stats">
          <span>👁️ {{ article.viewCount }}</span>
          <span>❤️ {{ article.likeCount }}</span>
          <span>💬 {{ article.commentCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'

// -------- Props --------
const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

// -------- Emits --------
const emit = defineEmits(['click'])

// -------- 工具函数 --------
function formatDate(date) {
  return dayjs(date).format('YYYY-MM-DD')
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.article-card {
  background: var(--color-bg-card);
  border-radius: $radius-lg;
  border: 1px solid var(--color-border);
  overflow: hidden;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
    border-color: $color-primary;
  }
}

.card-cover {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--color-bg-hover);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $transition-slow;
  }

  &:hover img {
    transform: scale(1.05);
  }

  .badge-draft {
    position: absolute;
    top: $spacing-md;
    right: $spacing-md;
    padding: $spacing-xs $spacing-sm;
    background: $color-warning;
    color: #fff;
    font-size: $font-size-xs;
    font-weight: 600;
    border-radius: $radius-sm;
  }
}

.card-body {
  padding: $spacing-md;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-sm;
  font-size: $font-size-xs;
  color: var(--color-text-muted);

  .category {
    padding: 2px $spacing-sm;
    background: rgba($color-primary, 0.1);
    color: $color-primary;
    border-radius: $radius-sm;
    font-weight: 500;
  }
}

.card-title {
  font-size: $font-size-lg;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: $spacing-sm;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-summary {
  font-size: $font-size-sm;
  color: var(--color-text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: $spacing-md;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: $spacing-sm;
  padding-top: $spacing-sm;
  border-top: 1px solid var(--color-border);

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;

    .tag {
      font-size: $font-size-xs;
      color: $color-primary;
      background: rgba($color-primary, 0.08);
      padding: 0 $spacing-sm;
      border-radius: $radius-sm;
    }
  }

  .stats {
    display: flex;
    gap: $spacing-md;
    font-size: $font-size-xs;
    color: var(--color-text-muted);

    span {
      display: flex;
      align-items: center;
      gap: 2px;
    }
  }
}
</style>
