<template>
    <div class="analyze">
        <train-header :id="id" :name="name" :sectionEn="true" :curQNo="curQNo" :totalQ="totalQ"></train-header>
        <div class="process-bar" ref="process_bar">
            <div ref="process" v-for="i in totalQ.length" :key="i"></div>
        </div>
        <div class="question">
            <div>
                <p>题目{{totalQ[curQNo].id}} {{totalQ[curQNo].question}}</p>
                <div>正确答案</div>
                <p>{{qCorrect}}</p>
            </div>
        </div>
        <div class="btn" :class="{half: status == 2}">
            <button @click="next" v-if="!isEnd">下一题</button>
            <button @click="back" v-else>返回目录</button>
            <button @click="restart" v-if="status == 2">重新答题</button>
        </div>
        <div class="refuse" v-show="refuse">
            <div>
                <img class="refuse_img" src="../assets/img/details/refuse.jpg" alt />
                <div>
                    <p>答题失败</p>您还不能作答，您可在
                    <br />
                    <span>{{time}}后</span>
                    <br />开始答题
                </div>
                <img class="colse" src="../assets/img/details/close.png" @click="back" alt />
            </div>
        </div>
    </div>
</template>

<script>
import TrainHeader from '../components/TrainHeader'
export default {
    components: { TrainHeader },
    data() {
        return {
            id: this.$route.params.id,
            name: this.$route.params.name,
            status: this.$route.params.status,
            curQNo: 0,
            totalQ: this.$route.params.errorQuestion,
            topic: '',
            qCorrect: '',
            options: [],
            isEnd: false,
            refuse: false,
            time: ''
        }
    },
    mounted() {
        this.$refs.process_bar.style.gridTemplateColumns = `repeat(${this.totalQ.length}, 1fr)`
        this.init()
    },
    methods: {
        init() {
            for (let key in this.totalQ[this.curQNo]) {
                if (this.totalQ[this.curQNo][key] != '') {
                    if (
                        key == 'anwser_a' ||
                        key == 'anwser_b' ||
                        key == 'anwser_c' ||
                        key == 'anwser_d'
                    ) {
                        this.options.push(this.totalQ[this.curQNo][key])
                    }
                }
            }

            let obj = {
                A: 0,
                B: 1,
                C: 2,
                D: 3
            }
            this.qCorrect = this.options[
                obj[this.totalQ[this.curQNo].anwser_correct.trim()]
            ]
            this.$refs.process_bar.children[this.curQNo].style.backgroundColor =
                '#fd7572'
            if (this.totalQ.length == 1) {
                this.isEnd = true
            }
        },
        next() {
            if (this.curQNo < this.totalQ.length - 1) {
                this.curQNo += 1
                this.init()
            }

            if (this.curQNo == this.totalQ.length - 1) {
                this.isEnd = true
            }
        },
        restart() {
            this.$axios
                .post(this.$baseUrl.getSubmitTime, {
                    articleId: this.id
                })
                .then(res => {
                    console.log(res)
                    if (res.data.status == 200) {
                        // this.$router.replace({
                        //     name: 'train',
                        //     params: {
                        //         id: this.id,
                        //         name: this.name
                        //     }
                        // })
                        this.$router.replace({
                            name: 'details',
                            query: {
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
.analyze {
    padding: 6.5vw;
    .process-bar {
        width: 100%;
        height: 1.4vw;
        margin-top: 8.5vw;
        background-color: #f1f1f1;
        border-radius: 4vw;
        display: grid;
        overflow: hidden;
        gap: 1px;
    }
    .question {
        height: 92vw;
        margin-top: 7vw;
        > div {
            padding: 3vw 7vw;
            border-left: 1vw solid #fe7575;
            border-radius: 1vw;
            box-shadow: 0 0 2vw #ccc;
            p {
                color: #777777;
                font-size: 4vw;
            }
            div {
                color: #009e92;
                font-size: 4.5vw;
                font-weight: 600;
                margin-top: 5vw;
                margin-bottom: 2vw;
                letter-spacing: 1vw;
            }
        }
    }
    .btn {
        button {
            width: 100%;
            height: 10vw;
            line-height: 10vw;
            border-radius: 10vw;
            font-size: 4.8vw;
            background-color: #f6c939;
            color: #fff;
        }
        &.half {
            display: grid;
            grid-template-columns: repeat(2, 40vw);
            justify-content: space-between;
        }
    }
    .refuse {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.6);
        text-align: center;
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
                p {
                    font-size: 7.2vw;
                    font-weight: bold;
                    margin-bottom: 4vw;
                    font-family: '黑体';
                }
                span {
                    font-size: 5vw;
                    color: #009b96;
                    font-weight: bold;
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