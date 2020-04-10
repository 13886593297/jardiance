<template>
    <div class="monthExamIndex">
        <div class="pic">
            <img src="../assets/img/error/4.png" alt />
        </div>
        <div class="text monthExam">
            <h5>全员月考</h5>
            <p>1. 本套试卷共{{examStatus.totalScore}}道题，总分{{examStatus.totalScore}}分，答对{{examStatus.infoScore}}道题及以上则为通过，否则失败。答对一题获得1分，答错获得0分。</p>
            <p>2. 答对显示绿色，答错显示红色。</p>
            <p>3. 考试未通过需在{{formatTime(examStatus.redate)}}后参加补考。</p>
            <p>4. 每套题只有一次补考机会。</p>
        </div>
        <div class="btn">
            <button @click="toExam">开始答题</button>
        </div>
        <div class="tip" v-show="show">
            <div>
                <img class="tipImg" src="../assets/img/error/3.jpg" alt />
                <div class="tipText">
                    <p>{{tipTextP}}</p>
                    <span>{{tipTextSpan}}</span>
                </div>
                <img class="colse" src="../assets/img/details/close.png" @click="closeBtn" alt />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            examStatus: {},
            examTime: {},
            show: false,
            tipTextP: '月考结束',
            tipTextSpan: `很遗憾本次月考已结束`,
            examId: this.$route.query.examId
        }
    },
    created() {
        this.$axios.get(this.$baseUrl.getMonthExamStatus, {
            params: {
                type: 1,
                examId: this.examId
            }
        }).then(res => {
            console.log(res.data)
            this.examStatus = res.data
            // status = 0 未开始测试
            // status = 3 未通过月考，显示月考失败页面
            // status = 4 通过月考，显示月考通过页面
            // status = 8 月考已结束
            // status = 9 未到答题时间
            if (this.examStatus.status == 3 || this.examStatus.status == 4) {
                this.$router.push({
                    name: 'monthExam',
                    params: {
                        type: 1,
                        status: this.examStatus.status,
                        time: this.formatTime(this.examStatus.redate),
                        question: this.examStatus.question,
                        passScore: this.examStatus.infoScore
                    }
                })
            } else if (this.examStatus.status == 8) {
                this.show = true
            } else if (this.examStatus.status == 9) {
                this.tipTextP = '月考未开始'
                this.tipTextSpan = ''
                this.show = true
            }
        })
    },
    methods: {
        closeBtn() {
            this.show = false
            this.$router.push('/')
        },
        /**开始答题 */
        toExam() {
            this.$router.push({
                name: 'monthExam',
                params: {
                    type: 1,
                    status: this.examStatus.status,
                    examId: this.examId,
                    time: this.formatTime(this.examStatus.redate)
                }
            })
        },
        /**格式化时间 */
        formatTime(date) {
            if (date == 0) {
                return '答题'
            }
            let d = date / 86400000 >= 1 ? Math.floor(date / 86400000) + '天' : ''
            let h = (date % 86400000) / 3600000 >= 1 ? Math.floor((date % 86400000) / 3600000) + '小时' : ''
            return d + h
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
                font-size: 4vw;
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