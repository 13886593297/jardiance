<template>
    <div class="tip">
        <div>
            <p class="title">{{title}}</p>
            <p class="content">{{content}}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: ['title', 'content']
}
</script>

<style lang="scss" scoped>
.tip {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.6);
    display: grid;
    align-items: center;
    justify-content: center;
    z-index: 1;
    > div {
        width: 44.8vw;
        height: 17.3vw;
        background-color: rgba(0, 0, 0, 0.6);
        color: #fff;
        text-align: center;
        border-radius: 1vw;
        padding-top: 2vw;
        box-sizing: border-box;
        .title {
            font-size: 5.6vw;
        }
        .content {
            font-size: 3vw;
            margin-top: 1vw;
        }
    }
}
</style>