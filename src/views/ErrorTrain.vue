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
                <div class="answerArea" v-show="!isEnd">
                    <div class="topic">
                        <span></span>
                        <span>{{topic}}</span>
                    </div>
                    <ul>
                        <li
                            v-for="(option, index) in options"
                            :class="{ cur: answer === index }"
                            @click="multipleType == 1 ? answer = index : multiple(index)"
                            :key="index"
                            ref="li"
                        >{{option}}</li>
                    </ul>
                </div>
                <div class="complete" v-show="isEnd">
                    <div class="success" v-show="!errorNum">
                        <img src="../assets/img/train/success.png" alt />
                        <p>
                            恭喜您全部答对获得
                            <br />
                            <span class="score">{{score}}</span>积分
                        </p>
                    </div>
                    <div class="fail" v-show="errorNum">
                        <img src="../assets/img/train/fail.png" alt />
                        <p>
                            正确{{correctNum}}道，获得{{score}}积分，错误题数
                            <span class="score">{{errorNum}}</span>题，
                        </p>
                        <p>您可在下个月月考中重新答题。</p>
                    </div>
                </div>
            </div>
            <div class="btn">
                <button class="submit" @click="submit" v-if="show">{{subText}}</button>
                <button class="submit" @click="back" v-if="isEnd">返回</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
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
            errorNum: 0,
            show: true,
            score: 0,
            correctNum: 0, // 正确题数
            len: 0,
            multipleType: 1, // 题目类型，1单选，2多选
            multipleAnswer: ['', '', '', '', '', ''], // 多选题回答
            obj: {
                A: 0,
                B: 1,
                C: 2,
                D: 3,
                E: 4,
                F: 5
            }
        }
    },
    created() {
        this.$axios.post(this.$baseUrl.getLastMonthFailQuestionList, {
                year: this.$route.query.year,
                month: this.$route.query.month
            }).then(res => {
                this.getData(res.data.data)
            })
    },
    methods: {
        getData(data) {
            this.totalQ = data
            this.curQNo = this.totalQ.findIndex(
                item => item.reply == 'null'
            )
            this.$refs.process_bar.style.gridTemplateColumns = `repeat(${this.totalQ.length}, 1fr)`
            this.$nextTick(() => {
                this.totalQ.forEach((item, i) => {
                    if (item.reply != 'null') {
                        this.$refs.process_bar.children[i].style.backgroundColor = item.is_correct ? '#009b96' : '#fd7572'
                    } else {
                        this.len++
                    }
                })
                this.subText = this.len > 1 ? '下一题' : '提交'
            })
            this.init()
        },
        init() {
            this.multipleType = this.totalQ[this.curQNo].type
            this.topic = this.totalQ[this.curQNo].question + (this.multipleType == 1 ? '' : '(多选题)')
            this.qCorrect = this.totalQ[this.curQNo].anwser_correct.trim()
            console.log('正确答案为', this.qCorrect)
            // 重置选项和玩家选择的答案
            this.options = []
            this.answer = ''
            this.multipleAnswer = ['', '', '', '', '', '']

            // 添加每一题的选项
            for (let key in this.totalQ[this.curQNo]) {
                if (this.totalQ[this.curQNo][key] != '' && this.totalQ[this.curQNo][key] != null) {
                    if (
                        key == 'anwser_a' ||
                        key == 'anwser_b' ||
                        key == 'anwser_c' ||
                        key == 'anwser_d' ||
                        key == 'anwser_e' ||
                        key == 'anwser_f'
                    ) {
                        this.options.push(this.totalQ[this.curQNo][key])
                    }
                }
            }
        },
        multiple(index) {
            if (this.$refs.li[index].classList.contains('cur')) {
                this.$refs.li[index].classList.remove('cur')
                this.multipleAnswer.splice(index, 1, '')
            } else {
                this.$refs.li[index].classList.add('cur')
                this.multipleAnswer.splice(index, 1, index)
            }
        },
        submit() {
            if (this.multipleType == 2) {
                this.answer = []
                this.multipleAnswer.map(item => {
                    if (item !== '') {
                        this.answer.push(item)
                    }
                })
            }

            let isEmpty = this.multipleAnswer.find((item) => item !== '')
            if ((this.multipleType == 1 && this.answer === '') || (this.multipleType == 2 && isEmpty === undefined)) {
                this.showTip = true
                setTimeout(() => {
                    this.showTip = false
                }, 2000)
                return
            } 

            if (this.subText == '提交') {
                this.show = false
            }
            this.$refs.question.classList.add('disabled')
            setTimeout(() => {
                if (this.curQNo < this.totalQ.length - 1) {
                    this.curQNo += 1
                    this.init()
                    this.$refs.li.map(item => {
                        item.classList = ''
                    })

                    if (this.curQNo == this.totalQ.length - 1) {
                        this.subText = '提交'
                    }
                } else {
                    this.isEnd = true
                }
                this.$refs.question.classList.remove('disabled')
            }, 2000)

            // 把玩家选择的0，1，2，3转化成A，B，C，D
            let reply = ''
            if (this.multipleType == 2) {
                this.answer.map(item => {
                    reply += String.fromCharCode(65 + parseInt(item))
                })
                reply = reply.split('').join(',')
            } else {
                reply = String.fromCharCode(65 + parseInt(this.answer))
            }

            let isCorrect = reply == this.qCorrect ? 1 : 0

            this.$axios.post(this.$baseUrl.submitErrorQuestion, {
                reply,
                isCorrect,
                questionNum: this.totalQ.length,
                qid: this.totalQ[this.curQNo].id,
                isEnd: this.curQNo == this.totalQ.length - 1
            }).then(res => {
                console.log(res)
                this.score = res.data.successScore
                this.correctNum = res.data.successNum
                this.errorNum = res.data.errorNum || 0
            })

            if (this.multipleType == 1) {
                if (isCorrect == 1) {
                    this.$refs.li[this.answer].classList.add('cur')
                    this.$refs.process_bar.children[this.curQNo].style.backgroundColor = '#009b96'
                } else {
                    this.$refs.li[this.answer].classList.add('err')
                    this.$refs.process_bar.children[this.curQNo].style.backgroundColor = '#fd7572'
                }
            } else {
                if (isCorrect == 1) {
                    this.$refs.process_bar.children[this.curQNo].style.backgroundColor = '#009b96'
                } else {
                    let qCArr = this.qCorrect.split(',')
                    for (let i = 0; i < qCArr.length; i++) {
                        let answer_item = String.fromCharCode(65 + parseInt(this.answer[i]))
                        if (answer_item != qCArr[i]) {
                            this.$refs.li[qCArr[i].charCodeAt() - 65].classList.add('cur1')
                            this.answer[i] && this.$refs.li[this.answer[i]].classList.add('err')
                        }
                    }

                    if (qCArr.length < this.answer.length) {
                        for (let j = 0; j < this.answer.length; j++) {
                            let answer_item = String.fromCharCode(65 + parseInt(this.answer[j]))
                            if (qCArr[j] !== answer_item) {
                                this.$refs.li[this.obj[answer_item]].classList.add('err')
                            }
                        }
                    }

                    this.$refs.process_bar.children[this.curQNo].style.backgroundColor = '#fd7572'
                }
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
            height: 58vh;
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
                    &.cur1 {
                        border-color: var(--cyan);
                        color: var(--cyan);
                    }
                    &.err {
                        border-color: #ff7575;
                        background-color: #ff7575;
                        color: #fff;
                    }
                }
            }
        }
        .btn {
            position: absolute;
            text-align: center;
            width: 100%;
            bottom: 4vw;
            left: 0;
            button {
                width: 87vw;
                height: 10vw;
                line-height: 10vw;
                border-radius: 10vw;
                font-size: 4.8vw;
                background-color: #f6c939;
                font-weight: 600;
                color: #fff;
            }
        }
        .complete {
            text-align: center;
            .success {
                img {
                    width: 72vw;
                }
            }
            .fail {
                img {
                    width: 53.3vw;
                }
            }
            .score {
                font-size: 10vw;
                color: var(--yellow);
                margin-right: 2vw;
            }
        }
    }
}
</style>