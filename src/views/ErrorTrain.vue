<template>
    <div class="error_train">
        <div class="header">
            <div class="left">
                <!-- <div class="title">{{month}}月错题月考</div> -->
                <!-- <p class="section">{{name}}</p> -->
            </div>
            <p class="right">
                <span class="curQNo">{{curQNo + 1}}</span>/
                <span class="totalQ">{{totalQ.length}}</span>
            </p>
        </div>
        <div class="process-bar" ref="process_bar">
            <div ref="process" v-for="i in totalQ.length" :key="i"></div>
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
            <button class="submit" @click="submit">{{subText}}</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            month: new Date().getMonth() == 0 ? 12 : new Date().getMonth(),
            name: '',
            curQNo: 0,
            totalQ: [],
            topic: '', // 题目
            options: [], // 题目选项
            answer: '', // 玩家选择的答案
            qCorrect: '', // 正确答案
            subText: '下一题',
            isEnd: false,
            correctNum: 0 // 正确题数
        }
    },
    created() {
        this.$axios.get(this.$baseUrl.getLastMQ).then(res => {
            this.totalQ = res.data
            this.$refs.process_bar.style.gridTemplateColumns = `repeat(${this.totalQ.length}, 1fr)`
            this.init()
            console.log(res)
        })
    },
    methods: {
        init() {
            this.topic = this.totalQ[this.curQNo].question
            this.qCorrect = this.totalQ[this.curQNo].anwser_correct.trim()
            this.name = this.totalQ[this.curQNo].name
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
                qid: this.totalQ[this.curQNo].id,
                reply,
                isCorrect,
                isEnd: this.curQNo == this.totalQ.length - 1,
                questionNum: this.totalQ.length
            })

            if (isCorrect) {
                this.$refs.li[this.answer].classList = 'cur'
                this.$refs.process_bar.children[
                    this.curQNo
                ].style.backgroundColor = '#009b96'
                this.correctNum += 1
            } else {
                this.$refs.li[this.answer].classList = 'err'
                this.$refs.process_bar.children[
                    this.curQNo
                ].style.backgroundColor = '#fd7572'
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
        grid-template-columns: 60% 40%;
        align-items: end;
        .left {
            .title {
                font-size: 6vw;
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