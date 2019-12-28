<template>
    <div class="item">
        <div
            :style="{animationDelay: `${index * .5}s`}"
            :class="[ani ? 'fadeInLeft': '', section.trainStatus == 1 ? 'pass' : section.trainStatus == 2 ? 'fail' : 'continuing']"
            @click="toDetails(section.id, section.trainStatus)"
        >
            <img :src="require(`../assets/img/section/${section.trainStatus}.png`)" alt />
            <p class="text" v-if="section.trainStatus == '2'">很遗憾，未通过测试，请继续努力！</p>
            <p class="text" v-if="section.trainStatus == '1'">恭喜您已通过本章测试！</p>
            <p class="text" v-if="section.trainStatus == '0'">快来学习本章内容吧！</p>
            <p class="no">SECTION{{section.id}}</p>
            <p class="name">{{section.name}}</p>
            <div class="go">
                <span></span>
                <span>GO</span>
                <span>→</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['section', 'idArr', 'index', 'ani'],
    methods: {
        toDetails(id, status) {
            this.$router.push({
                name: 'details',
                query: {
                    id,
                    status, // 0 continue 1 pass 2 fail
                    idArr: this.idArr
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@keyframes fadeInLeft {
    from {
        opacity: 0;
        -webkit-transform: translate3d(-100%, 0, 0);
        transform: translate3d(-100%, 0, 0);
    }

    to {
        opacity: 1;
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
}

.fadeInLeft {
    animation: fadeInLeft 0.8s forwards;
    transform: translate3d(-100%, 0, 0);
}

.item {
    > div {
        box-sizing: border-box;
        position: relative;
        padding: 4vw 0;
        border-bottom: 1px solid #fff;
        height: 100%;

        img {
            width: 17.3vw;
        }
        &.fail {
            background-color: var(--yellow);
            .text {
                color: #4f5252;
            }
            .go {
                color: var(--yellow);
            }
        }
        &.pass {
            .go {
                color: var(--cyan);
            }
        }
        &.continuing {
            background-color: var(--brown);
            .go {
                color: var(--brown);
            }
        }
        .text {
            font-size: 2.8vw;
            color: var(--yellow);
        }
        .no {
            color: #fff;
            font-size: 7vw;
        }
        .name {
            color: #fff;
            font-size: 4vw;
        }
        .go {
            background-color: #fff;
            position: absolute;
            border-radius: 50%;
            height: 10vw;
            width: 10vw;
            right: 4vw;
            top: 6.5vw;
            display: grid;
            font-weight: bold;
            grid-template-rows: repeat(4, 25%);
            span:nth-child(2) {
                align-self: center;
            }
        }
    }
    &:nth-child(1) {
        border-top: 1px solid #fff;
    }
}
</style>