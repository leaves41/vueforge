<template>
    <footer class="app-footer">
        <div class="footer-container">
            <p class="footer-text">
                © {{ new Date().getFullYear() }}
                <a href="/">VueForge</a>
                — 用 ❤️ 和 Vue 3 锻造
            </p>
            <div class="footer-links">
                <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
                <a href="https://vuejs.org" target="_blank" rel="noopener">Vue 3</a>
                <a href="/about">关于</a>
            </div>
        </div>
    </footer>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.app-footer {
    margin-top: auto;
    padding: $spacing-lg 0;
    border-top: 1px solid var(--color-border);
    background: var(--color-bg-card);
    transition: background $transition-base, border-color $transition-base;
}

.footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 $spacing-lg;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: $spacing-md;
}

.footer-text {
    font-size: $font-size-sm;
    color: var(--color-text-muted);

    a {
        color: $color-primary;
        font-weight: 600;

        &:hover {
            color: $color-primary-light;
        }
    }
}

.footer-links {
    display: flex;
    align-items: center;
    gap: $spacing-lg;

    a {
        font-size: $font-size-sm;
        color: var(--color-text-muted);
        transition: color $transition-fast;

        &:hover {
            color: $color-primary;
        }
    }
}

// 响应式
@media (max-width: 640px) {
    .footer-container {
        flex-direction: column;
        text-align: center;
        padding: 0 $spacing-md; 
    }

    .footer-links {
        gap: $spacing-md;
    }
}
</style>