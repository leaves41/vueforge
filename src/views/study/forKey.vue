<template>
    <div class="app">
        <h1>🔑 v-for Key 对比实验</h1>
        <p class="subtitle">
            在两个列表的输入框中随便填些内容，然后点击「在头部插入」按钮，观察输入框的内容会不会「错位」。
        </p>

        <div class="container">
            <!-- ========== 错误示范：用 index 作 key ========== -->
            <div class="box danger">
                <h2>❌ 用 index 作 key <span>(错误示范)</span></h2>
                <div class="btn-group">
                    <button class="btn btn-primary" @click="insertHead('index')">⬆️ 在头部插入</button>
                    <button class="btn btn-danger" @click="shuffle('index')">🔀 随机打乱</button>
                    <button class="btn btn-warning" @click="reset">↩️ 重置</button>
                </div>
                <div v-for="(item, index) in listIndex" :key="index" class="item">
                    <span class="badge">key= {{ index }}</span>
                    <span class="label">{{ item.label }}</span>
                    <input type="text" :placeholder="'输入 ' + item.label" v-model="item.value" />
                </div>
                <div class="tip error">
                    ⚠️ 注意：插入新数据后，输入框的内容会「跟错人」！
                </div>
                <div class="debug-info">
                    <strong>当前数据：</strong>
                    <pre>{{listIndex.map(i => `${i.label}:${i.value || '空'}`).join(' → ')}}</pre>
                </div>
            </div>

            <!-- ========== 正确示范：用 id 作 key ========== -->
            <div class="box success">
                <h2>✅ 用 id 作 key <span>(正确示范)</span></h2>
                <div class="btn-group">
                    <button class="btn btn-primary" @click="insertHead('id')">⬆️ 在头部插入</button>
                    <button class="btn btn-danger" @click="shuffle('id')">🔀 随机打乱</button>
                    <button class="btn btn-warning" @click="reset">↩️ 重置</button>
                </div>
                <div v-for="item in listId" :key="item.id" class="item">
                    <span class="badge">key= {{ item.id }}</span>
                    <span class="label">{{ item.label }}</span>
                    <input type="text" :placeholder="'输入 ' + item.label" v-model="item.value" />
                </div>
                <div class="tip success">
                    ✅ 插入新数据后，输入框的内容始终跟着正确的「人」走！
                </div>
                <div class="debug-info">
                    <strong>当前数据：</strong>
                    <pre>{{listId.map(i => `${i.label}:${i.value || '空'}`).join(' → ')}}</pre>
                </div>
            </div>
        </div>

        <div class="guide">
            <strong>💡 操作步骤：</strong><br />
            1. 在左右两个列表的输入框里分别输入 <code>A</code>、<code>B</code>、<code>C</code> 对应的内容（比如填上 A、B、C）<br />
            2. 点击「在头部插入」，会插入一个 <code>X</code> 到最前面<br />
            3. 观察：左边（index）的输入框内容错乱了，右边（id）的完全正常！<br />
            4. 同时观察下方的「当前数据」显示，左边数据没变但界面错乱，右边数据和界面完全一致。
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// ---------- 初始数据 ----------
const INIT_DATA = [
    { id: 1, label: 'A', value: '' },
    { id: 2, label: 'B', value: '' },
    { id: 3, label: 'C', value: '' },
]

// 自增 ID 生成器
let nextId = 4

function createItem(label) {
    return { id: nextId++, label, value: '' }
}

// ---------- 响应式数据 ----------
const listIndex = ref([...INIT_DATA.map(item => ({ ...item }))])
const listId = ref([...INIT_DATA.map(item => ({ ...item }))])

// ---------- 方法 ----------
// 重置
function reset() {
    nextId = 4
    listIndex.value = INIT_DATA.map(item => ({ ...item }))
    listId.value = INIT_DATA.map(item => ({ ...item }))
}

// 在头部插入 X
function insertHead(type) {
    const newItem = createItem('X')
    if (type === 'index') {
        listIndex.value = [newItem, ...listIndex.value]
    } else {
        listId.value = [newItem, ...listId.value]
    }
}

// 随机打乱
function shuffle(type) {
    const arr = type === 'index' ? listIndex.value : listId.value
    const shuffled = [...arr]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    if (type === 'index') {
        listIndex.value = shuffled
    } else {
        listId.value = shuffled
    }
}
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.app {
    font-family: Arial, sans-serif;
    padding: 20px;
    background: #f5f5f5;
    min-height: 100vh;
}

h1 {
    margin-bottom: 8px;
}

.subtitle {
    color: #666;
    margin-bottom: 24px;
}

.container {
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
}

.box {
    flex: 1;
    min-width: 350px;
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.box h2 {
    margin-top: 0;
    font-size: 18px;
}

.box h2 span {
    font-size: 14px;
    font-weight: normal;
    color: #999;
}

.danger {
    border-left: 4px solid #f56c6c;
}

.success {
    border-left: 4px solid #67c23a;
}

.btn-group {
    margin-bottom: 16px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.btn {
    padding: 8px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: 0.2s;
    color: white;
}

.btn-primary {
    background: #409eff;
}

.btn-primary:hover {
    background: #66b1ff;
}

.btn-danger {
    background: #f56c6c;
}

.btn-danger:hover {
    background: #f78989;
}

.btn-warning {
    background: #e6a23c;
}

.btn-warning:hover {
    background: #ebb563;
}

.item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    margin-bottom: 8px;
    background: #fafafa;
    border-radius: 6px;
    border: 1px solid #e8e8e8;
    transition: all 0.2s;
}

.item .badge {
    display: inline-block;
    min-width: 60px;
    font-size: 12px;
    color: #409eff;
    background: #ecf5ff;
    padding: 2px 8px;
    border-radius: 4px;
    text-align: center;
}

.item .label {
    font-weight: bold;
    min-width: 20px;
}

.item input {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 14px;
    outline: none;
}

.item input:focus {
    border-color: #409eff;
}

.tip {
    margin-top: 16px;
    padding: 12px;
    border-radius: 6px;
    font-size: 14px;
    border: 1px solid #fde2e2;
}

.tip.error {
    background: #fef0f0;
    color: #f56c6c;
}

.tip.success {
    background: #f0f9eb;
    color: #67c23a;
    border-color: #e1f3d8;
}

.debug-info {
    margin-top: 12px;
    padding: 10px;
    background: #f8f8f8;
    border-radius: 6px;
    font-size: 13px;
    border: 1px solid #e8e8e8;
}

.debug-info pre {
    margin: 6px 0 0 0;
    font-family: 'Courier New', monospace;
    color: #2c3e50;
    white-space: pre-wrap;
    word-break: break-all;
}

.guide {
    margin-top: 30px;
    padding: 16px;
    background: #e8f4fd;
    border-radius: 8px;
    font-size: 14px;
    color: #2c3e50;
    line-height: 1.8;
}

.guide code {
    background: #d4e8f7;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: bold;
}
</style>