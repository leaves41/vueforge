<template>
    <div class="article-detail">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
            <span class="spinner"></span>
            加载文章...
        </div>

        <!-- 文章内容 -->
        <article v-else-if="article" class="article-content">
            <!-- 封面图 -->
            <div v-if="article.cover" class="article-cover">
                <img :src="article.cover" :alt="article.title" />
            </div>

            <!-- 标题 -->
            <h1 class="article-title">{{ article.title }}</h1>

            <!-- 元信息 -->
            <div class="article-meta">
                <span class="category">{{ article.category }}</span>
                <span class="date">{{ formatDate(article.createdAt) }}</span>
                <span class="views">👁️ {{ article.viewCount }}</span>
                <span class="likes">❤️ {{ article.likeCount }}</span>
            </div>

            <!-- 标签 -->
            <div v-if="article.tags && article.tags.length" class="article-tags">
                <span v-for="tag in article.tags" :key="tag" class="tag">
                    #{{ tag }}
                </span>
            </div>

            <!-- 正文 -->
            <div class="article-body" v-html="renderedContent"></div>

            <!-- 返回按钮 -->
            <button class="back-btn" @click="goBack">← 返回列表</button>
        </article>

        <!-- 404 -->
        <div v-else class="not-found">
            <h2>😅 文章不存在</h2>
            <p>请检查链接是否正确</p>
            <button class="back-btn" @click="goBack">返回首页</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import dayjs from 'dayjs'
import request from '@/api/request'

const route = useRoute()
const router = useRouter()

// ---------- 状态 ----------
const article = ref(null)
const loading = ref(false)

// ---------- 渲染 Markdown ----------
const renderedContent = computed(() => {
    if (!article.value?.content) return ''
    return marked(article.value.content)
})

// ---------- 格式化日期 ----------
function formatDate(date) {
    return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// ---------- 获取文章详情 ----------
async function fetchArticle(id) {
    if (!id) return

    loading.value = true
    try {
        const data = await request.get(`/articles/${id}`)
        article.value = data
    } catch (error) {
        console.error('获取文章失败:', error)
        article.value = null
    } finally {
        loading.value = false
    }
}

// ---------- 返回 ----------
function goBack() {
    router.push('/')
}

// ---------- 监听路由参数变化 ----------
watch(
    () => route.params.id,
    (newId) => {
        if (newId) {
            fetchArticle(newId)
        }
    }
)

// ---------- 生命周期 ----------
onMounted(() => {
    const id = route.params.id
    if (id) {
        fetchArticle(id)
    }
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.article-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: $spacing-xl 0;
}

// -------- 加载状态 --------
.loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-md;
    padding: $spacing-2xl 0;
    color: var(--color-text-muted);
    font-size: $font-size-md;
}

.spinner {
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 3px solid var(--color-border);
    border-top-color: $color-primary;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

// -------- 文章内容 --------
.article-content {
    background: var(--color-bg-card);
    border-radius: $radius-lg;
    border: 1px solid var(--color-border);
    overflow: hidden;
}

.article-cover {
    width: 100%;
    height: 300px;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.article-title {
    font-size: $font-size-2xl;
    font-weight: 700;
    color: var(--color-text-primary);
    padding: $spacing-lg $spacing-xl 0;
    line-height: 1.3;
}

.article-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-md $spacing-xl;
    color: var(--color-text-muted);
    font-size: $font-size-sm;

    .category {
        padding: 2px $spacing-sm;
        background: rgba($color-primary, 0.1);
        color: $color-primary;
        border-radius: $radius-sm;
        font-weight: 500;
    }
}

.article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
    padding: 0 $spacing-xl $spacing-md;

    .tag {
        font-size: $font-size-xs;
        color: $color-primary;
        background: rgba($color-primary, 0.08);
        padding: 2px $spacing-sm;
        border-radius: $radius-sm;
    }
}

.article-body {
    padding: $spacing-xl;
    color: var(--color-text-primary);
    line-height: 1.8;
    font-size: $font-size-md;

    // Markdown 样式
    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4) {
        margin: $spacing-lg 0 $spacing-md;
        font-weight: 600;
    }

    :deep(p) {
        margin-bottom: $spacing-md;
    }

    :deep(ul),
    :deep(ol) {
        padding-left: $spacing-xl;
        margin-bottom: $spacing-md;
    }

    :deep(blockquote) {
        padding: $spacing-md $spacing-lg;
        border-left: 4px solid $color-primary;
        background: var(--color-bg-hover);
        margin-bottom: $spacing-md;
        color: var(--color-text-secondary);
    }

    :deep(pre) {
        padding: $spacing-md;
        background: var(--color-bg-hover);
        border-radius: $radius-md;
        overflow-x: auto;
        margin-bottom: $spacing-md;
        font-size: $font-size-sm;
    }

    :deep(code) {
        padding: 2px $spacing-sm;
        background: var(--color-bg-hover);
        border-radius: $radius-sm;
        font-size: $font-size-sm;
    }

    :deep(img) {
        max-width: 100%;
        border-radius: $radius-md;
    }
}

// -------- 返回按钮 --------
.back-btn {
    display: inline-block;
    margin: $spacing-xl;
    padding: $spacing-sm $spacing-xl;
    border: 1px solid var(--color-border);
    border-radius: $radius-md;
    background: transparent;
    color: var(--color-text-secondary);
    font-size: $font-size-sm;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover {
        border-color: $color-primary;
        color: $color-primary;
    }
}

// -------- 404 --------
.not-found {
    text-align: center;
    padding: $spacing-2xl 0;

    h2 {
        font-size: $font-size-2xl;
        margin-bottom: $spacing-md;
    }

    p {
        color: var(--color-text-muted);
        margin-bottom: $spacing-lg;
    }
}

// -------- 响应式 --------
@media (max-width: 768px) {
    .article-detail {
        padding: $spacing-md 0;
    }

    .article-title {
        font-size: $font-size-xl;
        padding: $spacing-md;
    }

    .article-meta {
        padding: $spacing-sm $spacing-md;
        font-size: $font-size-xs;
        gap: $spacing-sm;
    }

    .article-body {
        padding: $spacing-md;
        font-size: $font-size-sm;
    }

    .back-btn {
        margin: $spacing-md;
    }

    .article-cover {
        height: 200px;
    }
}
</style>