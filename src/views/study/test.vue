<template>
    <div>
        <h1>自定义指令</h1>

        <h2>防抖：v-debounce</h2>
        <el-input v-model="content" v-debounce="inputHandle"></el-input>

    </div>
</template>

<script setup>
import { ref } from "vue";

const content = ref('')

const inputHandle = () => {
    console.log("输入内容")
}

</script>

<style lang="scss" scoped></style>