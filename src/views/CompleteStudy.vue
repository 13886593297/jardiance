<template>
    <div class="complete">
        <img class="pic" src="../assets/img/details/complete.png" alt />
        <p class="num">恭喜您完成第{{id}}章节的学习</p>
        <button class="testStart" @click="trainStart">开始测试</button>
        <p class="tip">请点击按钮进行测试</p>
        <div class="refuse" v-show="refuse">
            <div>
                <img class="refuse_img" src="../assets/img/details/refuse.jpg" v-if="status != 1" alt />
                <img class="refuse_img" src="../assets/img/error/2.jpg" v-else alt />
                <div v-if="status != 1">
                    <p class="type">测试失败</p>
                    <p>您还不能作答，您可在</p>
                    <span>{{time}}后</span>
                    <br />开始测试
                </div>
                <div v-else>
                    <p class="type">测试已通过</p>
                    <p>您已经通过该测试了哦！</p>
                    <span class="pass">请开始其他的学习吧~</span>
                    <br />加油!
                </div>
                <img class="colse" src="../assets/img/details/close.png" @click="back" alt />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            id: this.$route.query.id,
            name: this.$route.query.name,
            status: this.$route.query.status,
            refuse: false,
            time: ''
        }
    },
    methods: {
        trainStart() {
            if (this.status == 1) {
                this.refuse = true
                return false
            }
            this.$axios
                .post(this.$baseUrl.getSubmitTime, {
                    articleId: this.id
                })
                .then(res => {
                    if (res.data.status == 200 || !res.data.status) {
                        this.$router.replace({
                            name: 'train',
                            params: {
                                id: this.id,
                                name: this.name
                            }
                        })
                    } else {
                        this.refuse = true
                        let date = new Date(res.data.time)
                        let M =
                            date.getMonth() + 1 > 9
                                ? date.getMonth() + 1
                                : '0' + (date.getMonth() + 1)
                        let d =
                            date.getDate() > 9
                                ? date.getDate()
                                : '0' + date.getDate()
                        let h =
                            date.getHours() > 9
                                ? date.getHours()
                                : '0' + date.getHours()
                        let m =
                            date.getMinutes() > 9
                                ? date.getMinutes()
                                : '0' + date.getMinutes()
                        this.time = M + '月' + d + '日 ' + h + ':' + m
                    }
                })
        },
        back() {
            this.$router.back()
        }
    }
}
</script>

<style lang="scss" scoped>
.complete {
    text-align: center;
    padding-top: 15vw;
    .pic {
        width: 68vw;
        height: 78.6vw;
    }
    .num {
        color: #494949;
        font-size: 4vw;
    }
    .testStart {
        background-color: var(--cyan);
        border-radius: 4vw;
        letter-spacing: 2vw;
        width: 77.33vw;
        height: 10vw;
        line-height: 10vw;
        font-size: 5vw;
        color: #fff;
        margin-top: 18vw;
    }
    .tip {
        margin-top: 2vw;
        font-size: 4vw;
        color: #494949;
    }
    .refuse {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.6);
        > div {
            border-radius: 50%;
            width: 70vw;
            height: 70vw;
            background-color: #fff;
            margin: 30vw auto;
            position: relative;
            .refuse_img {
                width: 28.8vw;
                margin-top: 5vw;
            }
            > div {
                color: #3b3b3b;
                font-size: 4.5vw;
                line-height: 7vw;
                letter-spacing: 2px;
                .type {
                    font-size: 7.2vw;
                    font-weight: bold;
                    margin-bottom: 4vw;
                    font-family: '黑体';
                }
                span {
                    font-size: 5vw;
                    color: var(--cyan);
                    font-weight: bold;
                    &.pass {
                        font-size: 4.4vw;
                    }
                }
            }
            .colse {
                position: absolute;
                bottom: -13.2vw;
                left: 50%;
                transform: translateX(-50%);
                width: 6.6vw;
            }
            &:after {
                content: '';
                width: 2px;
                height: 7vw;
                background-color: #fff;
                position: absolute;
                bottom: -7vw;
            }
        }
    }
}
</style>