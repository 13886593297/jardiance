<template>
    <div class="monthExamIndex">
        <template v-if="examInfo.status == 0 || examInfo.status == 4">
            <div class="pic">
                <img src="../assets/img/error/4.png" alt />
            </div>
            <div class="text monthExam">
                <h5>全员月考</h5>
                <p>1. 本套试卷共{{examInfo.totalScore}}道题，总分{{examInfo.totalScore}}分，答对{{examInfo.infoScore}}道题及以上则为通过，否则失败。答对一题获得1分，答错获得0分。</p>
                <p>2. 答对显示绿色，答错显示红色。</p>
                <p>3. 考试未通过需在三天后参加补考。</p>
                <p>4. 每套题只有一次补考机会。</p>
            </div>
        </template>
        <template v-else>
            <div class="pic">
                <img src="../assets/img/error/5.png" alt />
            </div>
            <div class="text">
                <h5>补 考</h5>
                <p>本次补考不做计分，答对{{examInfo.infoScore}}题及以上，</p>
                <p>则为通过，否则补考失败。</p>
            </div>
        </template>
        <div class="btn">
            <button @click="startAnswer">开始答题</button>
        </div>
        <div class="tip" v-show="show">
            <div>
                <img class="tipImg" :src="tipImg" alt />
                <div class="tipText">
                    <p v-html="tipTextP"></p>
                    <span v-html="tipTextSpan"></span>
                </div>
                <img class="colse" src="../assets/img/details/close.png" @click="show = false" alt />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            examInfo: {},
            examTime: null,
            show: false,
            time: '',
            tipTextP: '',
            tipTextSpan: '',
            tipImg: require('../assets/img/error/3.jpg'),
            examId: this.$route.query.examId
        }
    },
    created() {
        this.$axios.get(this.$baseUrl.getMonthExamStatus, {params: {examId: this.examId}})
            .then(res => {
                // console.log(res.data)
                this.examInfo = res.data
            })
    },
    methods: {
        startAnswer() {
            if (this.examInfo.status == 0) {
                this.toExam()
            } else if (this.examInfo.status == 3) {
                this.$axios.get(this.$baseUrl.getExamTime, {params: {examId: this.examId}})
                    .then(res => {
                        // console.log(res)
                        this.examTime = res.data.time || null
                        if (this.examTime) {
                            let date = new Date(this.examTime)
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
                            this.show = true
                            this.tipTextP = `您还不能作答，您可在`
                            this.tipTextSpan = `${this.time}后<br/>开始答题`
                        } else {
                            this.toExam()
                        }
                    })
            } else if (this.examInfo.status == 4) {
                this.show = true
                this.tipImg = require('../assets/img/error/2.jpg')
                this.$nextTick(() => {
                    this.tipTextP = `月考已合格`
                    this.tipTextSpan = `您本次月考已合格<br/>无需再考`
                })
            } else if (this.examInfo.status == 6) {
                this.show = true
                this.tipImg = require('../assets/img/error/2.jpg')
                this.$nextTick(() => {
                    this.tipTextP = `补考已合格`
                    this.tipTextSpan = `您本次补考已合格<br/>无需再考`
                })
            } else {
                this.show = true
                this.tipTextP = `月考结束`
                this.tipTextSpan = `很遗憾本次月考已结束`
            }
        },
        toExam() {
            this.$axios.get(this.$baseUrl.startMonthExam, {params: {examId: this.examId}})
                .then(res => {
                    if (res.data[0].code == 203 || res.data[0].code == 204) {
                        this.show = true
                        this.tipTextP = `月考结束`
                        this.tipTextSpan = `${res.data[0].info}`
                    } else {
                        this.$router.push({
                            name: 'monthExam',
                            params: {
                                status: this.examInfo.status,
                                examId: this.examId
                            }
                        })
                    }
                })
        }
    }
}
</script>

<style lang='scss' scoped>
.monthExamIndex {
    .pic {
        padding: 12vw 0 6vw;
        text-align: center;
        img {
            width: 73.33vw;
        }
    }
    .text {
        h5 {
            font-size: 5.4vw;
            text-align: center;
            margin-bottom: 4vw;
        }
        p {
            width: 60vw;
            margin: 0 auto;
            background: #f0f0f0;
            font-size: 3.5vw;
            margin-bottom: 1vw;
        }
    }
    .btn {
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 8vw;
        text-align: center;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        button {
            height: 11vw;
            line-height: 9vw;
            width: 60vw;
            border-radius: 5vw;
            background-color: #009b96;
            color: #fff;
            font-size: 5vw;
            box-shadow: 3px 3px 4px 3px #b6e2e4;
        }
    }
    .tip {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        > div {
            width: 69.6vw;
            height: 69.6vw;
            background-color: #fff;
            border-radius: 50%;
            margin: 30vw auto 0;
            text-align: center;
            position: relative;
            .tipImg {
                width: 28.8vw;
                margin-top: 5vw;
            }
            .tipText {
                color: #3b3b3b;
                font-size: 4.5vw;
                letter-spacing: 2px;
                margin-top: 4vw;
                p {
                    font-size: 6vw;
                    font-weight: bold;
                    margin-bottom: 2vw;
                }
            }
            .colse {
                position: absolute;
                bottom: -13.3vw;
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