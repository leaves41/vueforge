<template>
    <div class="machine-wrapper">

        <!-- 1. 上方区域：老虎机网格 + 覆盖其中的图片 -->
        <div class="grid-container">
            <!-- 外围 6x6 网格 (20个格子) -->
            <div v-for="(score, index) in slotScores" :key="index" class="grid-cell" :style="positionMap[index]" :class="{
                'active': highlightIndex === index,
                'flash-blink': showResultFlash && highlightIndex === index
            }">
                <span>{{ score }}</span>
            </div>

            <!-- 中间模块：比基尼美女图 (绝对定位在网格中央) -->
            <div class="center-image-card">
                <img :src="bikiniImage" alt="比基尼美女" class="beauty-img" />
                <!-- 如果结果揭晓，会有一个闪烁边框 -->
                <div v-if="showResultFlash" class="result-flash-border"></div>
            </div>
        </div>

        <!-- 2. 下方区域：押注的比分 (放在网格的下方) -->
        <div class="bottom-bet-card">
            <span class="bet-label">押注的比分</span>
            <span class="bet-score">{{ centerScore }}</span>
        </div>

        <!-- 3. 结果面板 (弹窗弹出，取代 alert) -->
        <transition name="pop-up">
            <div v-if="showResult" class="result-overlay" :class="{ 'win-bg': isWinning }">
                <div class="result-content">
                    <span v-if="isWinning" class="win-text">🎉 恭喜命中！ 🎉</span>
                    <span v-else class="lose-text">😅 很遗憾，未命中</span>
                    <div class="result-detail">
                        开奖比分：<b>{{ finalResultScore }}</b> ，你押：{{ centerScore }}
                    </div>
                </div>
            </div>
        </transition>

        <!-- 4. 底部：控制按钮区 -->
        <div class="control-panel">
            <div class="bet-selector">
                <button v-for="bet in betOptions" :key="bet" class="bet-btn"
                    :class="{ 'selected': centerScore === bet }" @click="centerScore = bet" :disabled="isRunning">
                    {{ bet }}
                </button>
            </div>
            <button class="start-btn" @click="startSpin" :disabled="isRunning">
                {{ isRunning ? '旋转中...' : '启动老虎机' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import girlImg from '@/assets/img/gril.jpg'
import { useArticles } from '@/composables/useArticles'

// ====== 1. 数据配置 ======
// 合规的网图（比基尼/泳装美女图，如需替换请直接改此链接）
const bikiniImage = ref(girlImg)

// 外围20个格子的比分池
const slotScores = ref([
    '1:0', '2:0', '3:0', '4:0', '5:0',
    '0:1', '0:2', '0:3', '1:1', '2:1',
    '3:1', '4:1', '1:2', '2:2', '3:2',
    '4:2', '2:3', '3:3', '4:3', '5:3'
])

// 下注选项池
const betOptions = ['1:0', '2:0', '3:0', '1:1', '2:1', '3:1', '0:1', '2:2', '3:2', '4:2', '0:0', '5:3']
const centerScore = ref('1:0')

// ====== 2. 游戏状态 ======
const isRunning = ref(false)
const highlightIndex = ref(0)
let timeoutId = null

// 结果状态
const showResult = ref(false) // 是否显示最终结果弹窗
const showResultFlash = ref(false) // 结果揭晓瞬间的闪烁特效
const isWinning = ref(false)
const finalResultScore = ref('')

// ====== 3. 20个格子在6x6网格中的坐标映射 (完全匹配你的截图排布) ======
const positionMap = [
    // 第1行 (0-5)
    { 'grid-column': '1', 'grid-row': '1' }, { 'grid-column': '2', 'grid-row': '1' },
    { 'grid-column': '3', 'grid-row': '1' }, { 'grid-column': '4', 'grid-row': '1' },
    { 'grid-column': '5', 'grid-row': '1' }, { 'grid-column': '6', 'grid-row': '1' },
    // 右侧列 (6-9)
    { 'grid-column': '6', 'grid-row': '2' }, { 'grid-column': '6', 'grid-row': '3' },
    { 'grid-column': '6', 'grid-row': '4' }, { 'grid-column': '6', 'grid-row': '5' },
    // 底部行 (10-15)
    { 'grid-column': '6', 'grid-row': '6' }, { 'grid-column': '5', 'grid-row': '6' },
    { 'grid-column': '4', 'grid-row': '6' }, { 'grid-column': '3', 'grid-row': '6' },
    { 'grid-column': '2', 'grid-row': '6' }, { 'grid-column': '1', 'grid-row': '6' },
    // 左侧列 (16-19)
    { 'grid-column': '1', 'grid-row': '5' }, { 'grid-column': '1', 'grid-row': '4' },
    { 'grid-column': '1', 'grid-row': '3' }, { 'grid-column': '1', 'grid-row': '2' }
]

// ====== 4. 老虎机核心运行逻辑 ======
const startSpin = () => {
    if (isRunning.value) return
    showResult.value = false
    showResultFlash.value = false
    isRunning.value = true

    if (timeoutId) { clearTimeout(timeoutId); timeoutId = null }

    const finalIndex = Math.floor(Math.random() * 20)
    const MAX_TIME = 4000 // 旋转时长
    const startTime = Date.now()
    let currentDelay = 60

    const step = () => {
        highlightIndex.value = (highlightIndex.value + 1) % 20
        const elapsed = Date.now() - startTime

        if (elapsed < MAX_TIME) {
            // 物理缓动减速
            const progress = elapsed / MAX_TIME
            currentDelay = 60 + progress * 450
            timeoutId = setTimeout(step, currentDelay)
        } else {
            // 旋转结束，开始闪烁（取代弹窗）
            highlightIndex.value = finalIndex
            isRunning.value = false
            timeoutId = null

            finalResultScore.value = slotScores.value[finalIndex]
            isWinning.value = finalResultScore.value === centerScore.value

            // 触发老虎机闪烁特效
            showResultFlash.value = true

            // 闪烁 0.8 秒后，弹出弹窗提示结果
            setTimeout(() => {
                showResultFlash.value = false
                showResult.value = true
            }, 800)
        }
    }
    timeoutId = setTimeout(step, 60)
}
</script>

<style scoped>
/* ===== 整体外框 ===== */
.machine-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #0d0d0d;
    width: fit-content;
    margin: 0 auto;
    border-radius: 16px;
}

/* ===== 1. 上方网格区 ===== */
.grid-container {
    position: relative;
    /* 关键：让内部图片相对于此容器绝对定位 */
    width: 720px;
    height: 720px;
    background-color: #111;
    border: 6px solid #e53935;
    border-radius: 8px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(6, 1fr);
    overflow: hidden;
}

.grid-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1a1a1a;
    border: 1px solid #333;
    color: #666;
    font-weight: bold;
    font-size: 16px;
    transition: all 0.1s ease;
    z-index: 1;
}

/* 旋转时的移动光效 */
.grid-cell.active {
    background-color: #b71c1c;
    border-color: #ff5252;
    box-shadow: 0 0 25px rgba(229, 57, 53, 0.8) inset;
    color: #fff;
    transform: scale(0.95);
}

/* 结果揭晓时的闪烁特效 (剧烈闪烁) */
@keyframes flashBlink {

    0%,
    100% {
        background-color: #b71c1c;
        color: #fff;
        border-color: #ff5252;
    }

    50% {
        background-color: #ffeb3b;
        color: #000;
        border-color: #fff;
        box-shadow: 0 0 50px #ffeb3b;
        transform: scale(1.05);
    }
}

.grid-cell.flash-blink {
    animation: flashBlink 0.15s infinite alternate;
}

/* ===== 中心图片区 (根据截图叠在网格中间) ===== */
.center-image-card {
    position: absolute;
    top: 20%;
    left: 20%;
    width: 60%;
    height: 60%;
    /* border: 6px solid #e53935; */
    border-radius: 8px;
    overflow: hidden;
    z-index: 10;
    background: #000;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
    pointer-events: none;
    /* 不遮挡点击 */
}

.beauty-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 图片上的闪烁边框 */
.result-flash-border {
    position: absolute;
    top: -6px;
    left: -6px;
    right: -6px;
    bottom: -6px;
    border: 8px solid #ffeb3b;
    animation: flashBlink 0.15s infinite alternate;
    pointer-events: none;
}

/* ===== 2. 底部押注比分区域 (独立于网格之下) ===== */
.bottom-bet-card {
    width: 720px;
    /* 与网格同宽 */
    margin-top: 20px;
    /* 与网格保持间距 */
    background-color: #1a1a1a;
    border: 6px solid #e53935;
    border-radius: 8px;
    padding: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
}

.bet-label {
    color: #888;
    font-size: 24px;
    font-weight: bold;
}

.bet-score {
    color: #ff5252;
    font-size: 32px;
    font-weight: 900;
    letter-spacing: 2px;
    text-shadow: 0 0 15px rgba(255, 82, 82, 0.5);
}

/* ===== 3. 结果面板 ===== */
.result-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.9);
    padding: 30px 50px;
    border: 3px solid #e53935;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 20;
    min-width: 250px;
}

.result-content {
    text-align: center;
    color: #fff;
    font-size: 24px;
    font-weight: bold;
}

.win-text {
    color: #ffeb3b;
    text-shadow: 0 0 20px #ffeb3b;
}

.lose-text {
    color: #ccc;
}

.result-detail {
    margin-top: 10px;
    font-size: 18px;
    color: #aaa;
}

.result-detail b {
    color: #ff5252;
}

/* 弹出动画 */
.pop-up-enter-active {
    animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.pop-up-leave-active {
    animation: popOut 0.2s ease forwards;
}

@keyframes popIn {
    from {
        transform: translate(-50%, -50%) scale(0.5);
        opacity: 0;
    }

    to {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
}

@keyframes popOut {
    from {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }

    to {
        transform: translate(-50%, -50%) scale(0.5);
        opacity: 0;
    }
}

/* ===== 4. 底部控制按钮区 ===== */
.control-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
    width: 100%;
}

.bet-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 10px;
    overflow-x: auto;
    width: 720px;
    justify-content: flex-start;
}

.bet-btn {
    flex-shrink: 0;
    background: #222;
    color: #aaa;
    border: 2px solid #444;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s;
}

.bet-btn:hover:not(:disabled) {
    border-color: #e53935;
    color: #fff;
}

.bet-btn.selected {
    background: #e53935;
    border-color: #e53935;
    color: #fff;
    box-shadow: 0 0 15px rgba(229, 57, 53, 0.6);
}

.bet-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.start-btn {
    padding: 14px 50px;
    background: linear-gradient(135deg, #e53935, #b71c1c);
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(229, 57, 53, 0.4);
    transition: 0.2s;
}

.start-btn:hover:not(:disabled) {
    transform: translateY(-3px);
}

.start-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}
</style>