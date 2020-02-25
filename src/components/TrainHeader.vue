<template>
    <div class="header">
        <div class="left">
            <p class="section">SECTION {{description}}</p>
            <p class="name">{{name}}</p>
        </div>
        <p class="right">
            <span class="curQNo">{{curQNo + 1}}</span>/
            <span class="totalQ">{{totalQ.length}}</span>
        </p>
    </div>
</template>

<script>
export default {
    props: ['description', 'name', 'curQNo', 'totalQ']
}
</script>

<style lang="scss" scoped>
.header {
    display: grid;
    grid-template-columns: 60% 40%;
    align-items: end;
    .left {
        .section {
            font-size: 6.2vw;
        }
        .name {
            margin-top: 4vw;
            font-size: 4vw;
            color: #565656;
        }
    }
    .right {
        justify-self: end;
        .curQNo {
            font-size: 17.5vw;
            color: var(--cyan);
        }
    }
}
</style>