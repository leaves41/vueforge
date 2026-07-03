<template>
    <h1 class="">
        事件处理
    </h1>

    <div>
        <h2>事件修饰符:</h2>
        <div class="content">
            <h3>.stop</h3>
            单击事件将停止向上级传递
            <div class="futher" @click="clickFuther">
                我是父级
                <div class="sun" @click.stop="clickSun">我是子级</div>
            </div>
        </div>

        <div class="content">
            <h3>.prevent</h3>
            单击事件将停止向上级传递
            <form @submit.prevent="submit">
                <input type="text" placeholder="输入内容">
                <button type="submit">提交</button>
            </form>
        </div>

        <div class="content">
            <h3>.self</h3>
            仅当 event.target 是元素本身时才会触发事件处理器<br>
            简单来说，.self是只有点击的内容是自身元素才会触发，.stop是阻止向上冒泡，在父子级的场景中，.stop是为了触发子级不触发父级，.self是为了触发父级不触发子集
            <div class="futher" @click.self="clickFuther">
                我是父级
                <div class="sun" @click="clickSun">我是子级</div>
            </div>
        </div>

        <div class="content">
            <h3>.capture</h3>
            添加事件监听器时，使用 `capture` 捕获模式
            要理解 .capture，首先需要了解 DOM 事件流的三个阶段：

            捕获阶段（Capture）：事件从 window → document → 祖先元素 → 目标元素的父级，从上往下传递

            目标阶段（Target）：事件到达目标元素

            冒泡阶段（Bubble）：事件从目标元素 → 父级 → 祖先元素 → document → window，从下往上传递

            默认情况下，Vue 的事件监听是在冒泡阶段执行的。

            使用capture，点击子级，但是父级会先执行
            应用场景
            1. 全局统计/埋点
            2. 输入框失焦验证
            <div class="futher" @click.capture="clickFuther">
                我是父级
                <div class="sun" @click="clickSun">我是子级</div>
            </div>
        </div>

        <div class="content">
            <h3>.once</h3>
            只触发一次<br>
            这里有一个有趣的现象，当你使用click.self.once在父级，点击子级后,点击子级会触发父级的事件，<br>
            但是因为.self修饰符仅当点击父级时才会执行函数，所以会导致父级的函数执行了一个空函数，once已经生效，无法再次点击
            <div class="futher" @click.self.once="clickFuther">
                我是父级
                <div class="sun" @click="clickSun">我是子级</div>
            </div>
        </div>

        <div class="content">
            <h3>.passive</h3>
            滚动事件的默认行为 (scrolling) 将立即发生而非等待 `onScroll` 完成<br>
            在移动端或滚动场景中，浏览器需要等待事件处理函数执行完毕，才能确定是否要阻止默认行为（如滚动）。<br>
            如果事件处理函数执行时间较长，就会造成页面卡顿。<br>

            .prevent：主动阻止默认行为<br>

            .passive：主动不阻止默认行为（提升性能）<br>
        </div>

    </div>

    <div class="content">
        <h2>键盘事件修饰符:</h2>
        只有在键盘按下指定按键的时候执行<br>
        键盘事件需要绑定在可聚焦的原生元素上（如 input、button 等）
        <div>
            点击按钮后按下按键
            <button @keyup.enter="clickButton">enter</button>
        </div>
        <div>
            聚焦后按下按键
            <el-input v-model="text" placeholder="" @keyup.enter="clickButton"></el-input>
        </div>

    </div>

</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'

defineOptions({
    name: 'onHandler'
})

onMounted(() => {
    console.log("界面初始化加载");
})


onActivated(() => {
    console.log("界面显示");
})

const clickFuther = () => {
    alert("父级被点击了");
}

const clickSun = () => {
    alert("子级被点击了");
}
const submit = () => {
    alert("点击界面刷新事件");
}

const text = ref("")
const clickButton = () => {
    alert("您按下了enter按钮");
}


</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';


.content {
    width: 80%;
    border: solid 1px var(--color-border);
    border-radius: $spacing-md;
    padding: $spacing-md;

}

.futher {
    color: azure;
    width: 300px;
    height: 200px;
    background-color: rgb(14, 203, 216);

    .sun {
        width: 100px;
        height: 100px;
        background-color: rgb(80, 43, 165);
    }

}
</style>