<template>
    <div class="error_train">
        <div class="header">
            <p class="right">
                <span class="curQNo">{{curQNo + 1}}</span>/
                <span class="totalQ">{{totalQ.length}}</span>
            </p>
        </div>
        <div class="process-bar" ref="process_bar">
            <div v-for="i in totalQ.length" :key="i"></div>
        </div>
        <div class="question" ref="question">
            <div class="qContent">
                <div class="answerArea">
                    <div class="topic">
                        <span></span>
                        <span>{{topic}}</span>
                    </div>
                    <ul>
                        <li
                            v-for="(option, index) in options"
                            :class="{ cur: answer === index }"
                            @click="answer = index"
                            :key="index"
                            ref="li"
                        >{{option}}</li>
                    </ul>
                </div>
                <div class="complete" v-show="isEnd">
                    <div>
                        <img src="../assets/img/error/complete.png" alt />
                        <p>
                            恭喜！答对{{correctNum}}道题！
                            <br />获得
                            <span class="score">{{correctNum}}</span>积分
                        </p>
                        <button @click="back">返回</button>
                    </div>
                </div>
            </div>
            <button class="submit" @click="submit" v-if="show">{{subText}}</button>
        </div>
    </div>
</template>

<script>
import store from '../store'
import { mapMutations } from 'vuex'
export default {
    store,
    data() {
        return {
            curQNo: 0,
            totalQ: [],
            topic: '', // 题目
            options: [], // 题目选项
            answer: '', // 玩家选择的答案
            qCorrect: '', // 正确答案
            subText: '',
            isEnd: false,
            show: true,
            correctNum: 0 // 正确题数
        }
    },
    mounted() {
        this.setInterceptor(false)
        this.$axios
            .post(this.$baseUrl.getLastMonthFailQuestionList, {
                year: this.$route.query.year,
                month: this.$route.query.month
            })
            .then(res => {
                this.totalQ = res.data.data
                this.subText = this.totalQ.length > 1 ? '下一题' : '提交'
                this.curQNo = this.totalQ.findIndex(
                    item => item.reply == 'null'
                )
                this.$refs.process_bar.style.gridTemplateColumns = `repeat(${this.totalQ.length}, 1fr)`
                this.$nextTick(() => {
                    this.totalQ.forEach((item, i) => {
                        if (item.reply != 'null') {
                            this.$refs.process_bar.children[i].style.backgroundColor = item.is_correct ? '#009b96' : '#fd7572'
                        }
                    })
                })
                this.init()
            })
    },
    beforeDestroy() {
        this.setInterceptor(true)
    },
    methods: {
        ...mapMutations(['setInterceptor']),
        init() {
            this.topic = this.totalQ[this.curQNo].question
            this.qCorrect = this.totalQ[this.curQNo].anwser_correct.trim()
            console.log('正确答案为', this.qCorrect)
            // 重置选项和玩家选择的答案
            this.options = []
            this.answer = ''
            // 添加每一题的选项
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
        },
        submit() {
            if (this.answer === '') return
            if (this.subText == '提交') {
                this.show = false
            }
            this.$refs.question.classList.add('disabled')
            setTimeout(() => {
                if (this.curQNo < this.totalQ.length - 1) {
                    this.curQNo += 1
                    this.init()
                    if (this.curQNo == this.totalQ.length - 1) {
                        this.subText = '提交'
                    }
                } else {
                    this.isEnd = true
                }
                this.$refs.question.classList.remove('disabled')
            }, 2000)

            // 把玩家选择的0，1，2，3转化成A，B，C，D
            let reply = String.fromCharCode(65 + parseInt(this.answer))
            let isCorrect = reply == this.qCorrect ? 1 : 0

            this.$axios.post(this.$baseUrl.submitErrorQuestion, {
                reply,
                isCorrect,
                questionNum: this.totalQ.length,
                qid: this.totalQ[this.curQNo].id,
                isEnd: this.curQNo == this.totalQ.length - 1
            }).then(res => {
                console.log(res)
                this.correctNum = res.data.successScore
            })

            if (isCorrect) {
                this.$refs.li[this.answer].classList = 'cur'
                this.$refs.process_bar.children[this.curQNo].style.backgroundColor = '#009b96'
                
            } else {
                this.$refs.li[this.answer].classList = 'err'
                this.$refs.process_bar.children[this.curQNo].style.backgroundColor = '#fd7572'
            }
        },
        back() {
            this.$router.back()
        }
    }
}
</script>

<style lang="scss" scoped>
.error_train {
    box-sizing: border-box;
    padding: 6.5vw;
    height: 100vh;
    .header {
        display: grid;
        justify-items: center;
        .right {
            .curQNo {
                font-size: 17.5vw;
                color: #009b96;
            }
        }
    }
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
        margin-top: 7vw;
        &.disabled {
            pointer-events: none;
        }
        .qContent {
            height: 92vw;
            overflow-x: scroll;
            margin-bottom: 4vw;
            .topic {
                display: grid;
                grid-template-columns: 3vw auto;
                align-items: baseline;
                margin-bottom: 7vw;
                span:nth-child(1) {
                    display: inline-block;
                    width: 1vw;
                    height: 3vw;
                    background-color: #f6c939;
                }
                span:nth-child(2) {
                    display: inline-block;
                    font-size: 4.2vw;
                }
            }
            ul {
                li {
                    border: 2px solid #747474;
                    color: #393939;
                    border-radius: 10vw;
                    margin-bottom: 6vw;
                    padding: 2vw 6vw;
                    text-align: center;
                    &.cur {
                        border-color: #009b96;
                        background-color: #009b96;
                        color: #fff;
                    }
                    &.err {
                        border-color: #ff7575;
                        background-color: #ff7575;
                        color: #fff;
                    }
                }
            }
        }
        .submit {
            width: 100%;
            height: 10vw;
            line-height: 10vw;
            border-radius: 10vw;
            font-size: 4.8vw;
            background-color: #f6c939;
            font-weight: 600;
            color: #fff;
        }
        .complete {
            text-align: center;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            > div {
                padding-top: 10vw;
                position: relative;
                img {
                    width: 66.6vw;
                }
                p {
                    color: #fff;
                    font-size: 5.3vw;
                    position: absolute;
                    width: 100%;
                    bottom: 21vw;
                }
                button {
                    width: 55vw;
                    height: 11vw;
                    line-height: 11vw;
                    color: #fff;
                    background-color: #f6c939;
                    font-size: 6vw;
                    letter-spacing: 6vw;
                    border-radius: 6vw;
                    text-indent: 6vw;
                    margin-top: 2vw;
                }
                .score {
                    font-size: 10vw;
                    color: #f6c939;
                    margin-right: 2vw;
                }
            }
        }
    }
}
</style>