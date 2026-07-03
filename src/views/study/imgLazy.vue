<template>
    <div class="image-grid">
        <div v-for="img in images" :key="img.id" class="image-item">
            <!-- 懒加载图片 -->
            <img v-lazy="img.url" alt="图片" />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
const images = ref([
    { id: 1, url: 'https://picsum.photos/400/300?random=1' },
    { id: 2, url: 'https://picsum.photos/400/300?random=2' },
    // ... 更多图片
])
</script>