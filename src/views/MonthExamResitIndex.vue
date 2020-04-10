<template>
    <div class="monthExamResitIndex">
        <div class="pic">
            <img src="../assets/img/error/5.png" alt />
        </div>
        <div class="text">
            <h5>补 考</h5>
            <p>本次补考不做计分，答对{{examStatus.infoScore}}题及以上，</p>
            <p>则为通过，否则补考失败。</p>
        </div>
        <div class="btn">
            <button @click="toExam">开始答题</button>
        </div>
        <div class="tip" v-show="show">
            <div>
                <img class="tipImg" :src="tipImg" alt />
                <div class="tipText">
                    <p>{{tipTextP}}</p>
                    <span v-html="tipTextSpan"></span>
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
            tipImg: require('../assets/img/error/2.jpg'),
            tipTextP: '月考已合格',
            tipTextSpan: `您本次月考已合格<br>无需再考`,
            examId: this.$route.query.examId
        }
    },
    created() {
        this.$axios.get(this.$baseUrl.getMonthExamStatus, {
            params: {
                type: 2,
                examId: this.examId
            }
        }).then(res => {
            console.log(res.data)
            this.examStatus = res.data
            // status = 0 未开始测试
            // status = 5 通过补考，显示补考通过页面
            // status = 6 未通过补考，显示补考失败页面
            // status = 7 已通过月考用户点击，弹出提示
            // status = 8 补考已结束
            // status = 9 未到答题时间
            if (this.examStatus.status == 5 || this.examStatus.status == 6) {
                this.$router.push({
                    name: 'monthExam',
                    params: {
                        type: 2,
                        status: this.examStatus.status,
                        question: this.examStatus.question,
                        passScore: this.examStatus.infoScore
                    }
                })
            } else if (this.examStatus.status == 7) {
                this.show = true
            } else if (this.examStatus.status == 8) {
                this.tipImg = require('../assets/img/error/3.jpg')
                this.tipTextP = '补考结束'
                this.tipTextSpan = '很遗憾本次补考已结束'
                this.show = true
            } else if (this.examStatus.status == 9) {
                this.tipImg = require('../assets/img/error/3.jpg')
                this.tipTextP = '补考未开始'
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
                    type: 2,
                    status: this.examStatus.status,
                    examId: this.examId,
                }
            })
        }
    }
}
</script>

<style lang='scss' scoped>
.monthExamResitIndex {
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