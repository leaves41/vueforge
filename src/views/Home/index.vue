<template>
    <div class="home-page">
        <!-- 1. 分类筛选栏 -->
        <div class="filter-bar">
            <button class="filter-btn" :class="{ active: selectedCategory === '' }" @click="filterByCategory('')">
                全部
                <span class="count">{{ totalArticles }}</span>
            </button>
            <button v-for="cat in categories" :key="cat.id" class="filter-btn"
                :class="{ active: selectedCategory === cat.name }" @click="filterByCategory(cat.name)">
                {{ cat.name }}
                <span class="count">{{ cat.count }}</span>
            </button>
        </div>

        <!-- 2. 加载状态 -->
        <div v-if="loading" class="loading-state">
            <span class="spinner"></span>
            加载文章...
        </div>

        <!-- 3. 文章列表 -->
        <div v-else-if="articles.length > 0" class="article-grid">
            <ArticleCard v-for="article in articles" :key="article.id" :article="article"
                @click="goToDetail(article.id)" />
        </div>

        <!-- 4. 空状态 -->
        <div v-else class="empty-state">
            <p>📝 暂无文章</p>
        </div>

        <!-- 5. 分页 -->
        <div v-if="totalPages > 1" class="pagination">
            <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
                ← 上一页
            </button>
            <span class="page-info">
                {{ currentPage }} / {{ totalPages }}
            </span>
            <button class="page-btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
                下一页 →
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useArticles } from '@/composables/useArticles'
import { usePagination } from '@/composables/usePagination'
import ArticleCard from '@/components/business/ArticleCard.vue'
import request from '@/api/request'

const router = useRouter()

// ---------- 使用组合式函数 ----------
const { articles, loading, fetchArticles } = useArticles()
const { currentPage, pageSize, total, totalPages, setPagination, changePage } =
    usePagination(6)

// ---------- 状态 ----------
const categories = ref([])
const selectedCategory = ref('')

// ---------- 计算属性 ----------
const totalArticles = computed(() => {
    return categories.value.reduce((sum, cat) => sum + cat.count, 0)
})

// ---------- 获取文章列表（增强） ----------
async function loadArticles() {
    const params = {
        page: currentPage.value,
        pageSize: pageSize.value,
    }
    if (selectedCategory.value) {
        params.category = selectedCategory.value
    }

    try {
        const data = await fetchArticles(params)
        setPagination(data.pagination)
    } catch (error) {
        // 错误已在 useArticles 中处理
        console.error('加载文章失败:', error)
    }
}

// ---------- 获取分类列表 ----------
async function fetchCategories() {
    try {
        const data = await request.get('/categories')
        categories.value = data || []
    } catch (error) {
        console.error('获取分类失败:', error)
    }
}

// ---------- 筛选分类 ----------
function filterByCategory(category) {
    selectedCategory.value = category
    currentPage.value = 1
}

// ---------- 跳转详情 ----------
function goToDetail(id) {
    router.push(`/article/${id}`)
}

// ---------- 监听 ----------
watch(currentPage, () => {
    loadArticles()
    window.scrollTo({ top: 0, behavior: 'smooth' })
})

watch(selectedCategory, () => {
    loadArticles()
})

// ---------- 生命周期 ----------
onMounted(() => {
    fetchCategories()
    loadArticles()
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.home-page {
    padding: $spacing-xl 0;
}

// -------- 筛选栏 --------
.filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
    margin-bottom: $spacing-xl;
    padding-bottom: $spacing-md;
    border-bottom: 1px solid var(--color-border);
}

.filter-btn {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-sm $spacing-md;
    border: 2px solid var(--color-border);
    border-radius: $radius-full;
    background: var(--color-bg-card);
    color: var(--color-text-secondary);
    font-size: $font-size-sm;
    font-weight: 500;
    cursor: pointer;
    transition: all $transition-fast;

    .count {
        font-size: $font-size-xs;
        background: var(--color-bg-hover);
        padding: 0 $spacing-sm;
        border-radius: $radius-full;
        color: var(--color-text-muted);
    }

    &:hover {
        border-color: $color-primary;
        color: $color-primary;
    }

    &.active {
        border-color: $color-primary;
        background: $color-primary;
        color: #fff;

        .count {
            background: rgba(255, 255, 255, 0.2);
            color: #fff;
        }
    }
}

// -------- 文章网格 --------
.article-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: $spacing-lg;
    margin-bottom: $spacing-xl;
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

// -------- 空状态 --------
.empty-state {
    text-align: center;
    padding: $spacing-2xl 0;
    color: var(--color-text-muted);
    font-size: $font-size-lg;
}

// -------- 分页 --------
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-md;
    padding-top: $spacing-lg;
    border-top: 1px solid var(--color-border);
}

.page-btn {
    padding: $spacing-sm $spacing-lg;
    border: 1px solid var(--color-border);
    border-radius: $radius-md;
    background: var(--color-bg-card);
    color: var(--color-text-primary);
    font-size: $font-size-sm;
    cursor: pointer;
    transition: all $transition-fast;

    &:hover:not(:disabled) {
        border-color: $color-primary;
        color: $color-primary;
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
}

.page-info {
    font-size: $font-size-sm;
    color: var(--color-text-secondary);
    min-width: 80px;
    text-align: center;
}

// -------- 响应式 --------
@media (max-width: 768px) {
    .home-page {
        padding: $spacing-md 0;
    }

    .article-grid {
        grid-template-columns: 1fr;
        gap: $spacing-md;
    }

    .filter-bar {
        gap: $spacing-xs;
    }

    .filter-btn {
        padding: $spacing-xs $spacing-sm;
        font-size: $font-size-xs;
    }
}
</style>