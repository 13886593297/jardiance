<template>
    <div class="header">
        <div class="left">
            <div class="top">
                <p>第{{id}}章</p>
                <p v-if="sectionEn">
                    Chapter
                    <span>{{sectionArr[id - 1]}}</span>
                </p>
            </div>
            <p class="section">{{name}}</p>
        </div>
        <p class="right">
            <span class="curQNo">{{curQNo + 1}}</span>/
            <span class="totalQ">{{totalQ.length}}</span>
        </p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            sectionArr: [
                'One',
                'Two',
                'Three',
                'Four',
                'Five',
                'Six',
                'Seven',
                'Eight',
                'Nine'
            ]
        }
    },
    props: ['id', 'name', 'sectionEn', 'curQNo', 'totalQ']
}
</script>

<style lang="scss" scoped>
.header {
    display: grid;
    grid-template-columns: 60% 40%;
    align-items: end;
    .left {
        .top {
            p:nth-child(1) {
                font-size: 6.2vw;
            }
            p:nth-child(2) {
                color: #838383;
                font-size: 4vw;
            }
        }
        .section {
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