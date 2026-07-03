<template>
    <div>
        <h1>Grid布局</h1>
        <div class="grid-box">
            <div class="box-item-1"></div>
            <div class="box-item-2"></div>
            <div class="box-item-3"></div>
            <div class="box-item-4"></div>
        </div>
    </div>



    <div class="outmar">
        <h1>外边距折叠实例</h1>
        <div class="outmar-1">

        </div>
        <div class="outmar-2">

        </div>
        验证得出，确实存在两个块级元素的外边距出现了折叠
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.grid-box {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: [start] 1fr 1fr [mid] 1fr 1fr [end];
    gap: 20px;
    width: 1000px;
    height: 300px;
    background-color: rgb(239, 176, 99);

    .box-item-1,
    .box-item-2,
    .box-item-3,
    .box-item-4 {
        background-color: rgb(133, 63, 180);
    }

    .box-item-1 {
        grid-column: 1 / 2;
        grid-row: 1 / 2;
    }

    .box-item-2 {
        grid-column: 2 / 3;
        grid-row: 1 / 3;
    }

    .box-item-3 {
        grid-column: 3 / 4;
        grid-row: 2 / 4;
    }

    .box-item-4 {
        grid-column: span 1;
        grid-row: mid / end;
    }

}

.outmar {
    margin-top: 100px;
    width: 500px;
    height: 500px;
    background-color: aqua;

    .outmar-1 {
        width: 10%;
        height: 10%;
        margin-bottom: 100px;
        background-color: black;
    }

    .outmar-2 {
        width: 10%;
        height: 10%;
        margin-top: 50px;
        background-color: black;
    }

}
</style>