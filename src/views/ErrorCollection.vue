<template>
    <div class="collection">
        <p class="title">错题月考</p>
        <div @click="toErrorTrain" :class="['section', {pass: failQuestionInfo.status > 1}]">
            <p class="month">Month {{failQuestionInfo.month}}</p>
            <p class="section_name">
                {{failQuestionInfo.name}}
                <span>{{failQuestionInfo.status > 1 ? '已测试' : '未测试'}}</span>
            </p>
        </div>
        <div class="allErrQ">
            <p class="title">所有错题</p>
            <ul v-if="!noQues">
                <template v-for="(item, key) in allErrQ">
                    <li
                        v-if="item.trainStatus != 0"
                        :key="key"
                        :class="{fail: item.trainStatus == 2 && item.arttcleTime.status == 200, continue: item.trainStatus == 2 && item.arttcleTime.status == 201}"
                        @click="getArticleErrorQuestion(item.name, item.id, item.trainStatus, item.category_id)"
                    >
                        <div class="circle"></div>
                        <div class="time">{{item.submit_time | timeformat}}</div>
                        <div class="name">{{item.name}}</div>
                        <div class="status" v-if="item.trainStatus == 1">PASS</div>
                        <div
                            class="status"
                            v-if="item.trainStatus == 2 && item.arttcleTime.status == 200"
                        >FAIL</div>
                        <div
                            class="status"
                            v-if="item.trainStatus == 2 && item.arttcleTime.status == 201"
                        >{{item.arttcleTime.formatTime}}</div>
                    </li>
                </template>
            </ul>
            <div class="noQues" v-else>
                <img src="../assets/img/error/1.jpg" alt />
            </div>
            <div class="btn">
                <button @click="goHome">返回首页</button>
            </div>
        </div>
        <div class="tip" v-show="showTip">
            <div>
                <img class="pic" src="../assets/img/error/2.jpg" alt />
                <div>
                    <p>您已提交过答案</p>
                    正确 {{testInfo.successNum}}道
                    <i>错误 {{testInfo.errorNum}}道</i>
                    <br />
                    <span>
                        获得
                        <strong>{{testInfo.successScore}}</strong> 积分
                    </span>
                    <br />加油！
                </div>
                <img
                    class="colse"
                    src="../assets/img/details/close.png"
                    @click="showTip = false"
                    alt
                />
            </div>
        </div>
        <div class="tip emptyQ" v-show="emptyQ">
            <div>
                <img class="pic" src="../assets/img/error/3.jpg" alt />
                <div>
                    <p>哦！题库空空！</p>您还没有答错的题目哦！
                    <br />
                    <span>快去答题吧</span>
                    <br />加油！
                </div>
                <img
                    class="colse"
                    src="../assets/img/details/close.png"
                    @click="emptyQ = false"
                    alt
                />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            month: new Date().getMonth() == 0 ? 12 : new Date().getMonth(),
            section_name: '超声医学应用习题',
            failQuestionInfo: {},
            testInfo: {},
            allErrQ: [],
            noQues: false,
            showTip: false,
            emptyQ: false
        }
    },
    created() {
        this.$axios
            .all([
                this.$axios.get(this.$baseUrl.getLastMonthFailQuestionStatus),
                this.$axios.get(this.$baseUrl.getErrorArticleList, {
                    params: {
                        pageNow: 1,
                        pageSize: 10
                    }
                })
            ])
            .then(
                this.$axios.spread((qStatus, article) => {
                    // console.log(qStatus)
                    // console.log(article)
                    this.failQuestionInfo = qStatus.data
                    if (article.data.length == 0) {
                        this.noQues = true
                    } else {
                        this.formatArticle(article)
                    }
                })
            )
    },
    methods: {
        formatArticle(article) {
            article.data.forEach(item => {
                if (item.trainStatus == 2 && item.arttcleTime.status == 200) {
                    item._status = 3
                } else if (
                    item.trainStatus == 2 &&
                    item.arttcleTime.status == 201
                ) {
                    item._status = 2
                } else if (item.trainStatus == 1) {
                    item._status = 1
                } else if (item.trainStatus == 0) {
                    item._status = 0
                }
            })
            article.data.sort((a, b) => {
                return b._status - a._status
            })
            this.formatTime(article)
        },
        formatTime(article) {
            this.allErrQ = []
            article.data.forEach(item => {
                if (item.arttcleTime.status != 200) {
                    let diff = parseInt(item.arttcleTime.time)
                    let h = Math.floor(diff / 3600)
                    let m = Math.floor((diff / 60) % 60)
                    let s = Math.floor(diff % 60)
                    item.arttcleTime.formatTime = `还剩 ${h}h ${m}min ${s}s`
                    setInterval(() => {
                        diff--
                        if (diff > 0) {
                            h = Math.floor(diff / 3600)
                            m = Math.floor((diff / 60) % 60)
                            s = Math.floor(diff % 60)
                            item.arttcleTime.formatTime = `还剩 ${h}h ${m}min ${s}s`
                        } else {
                            item.arttcleTime.status = 200
                        }
                    }, 1000)
                }
                this.allErrQ.push(item)
            })
        },
        toErrorTrain() {
            // 0 没有题目  1 未答题  2 已答题
            if (this.failQuestionInfo.status == 0) {
                this.emptyQ = true
            } else if (this.failQuestionInfo.status == 1) {
                this.$router.push({
                    name: 'errorTrain',
                    query: {
                        year: this.failQuestionInfo.year,
                        month: this.failQuestionInfo.month
                    }
                })
            } else {
                this.$axios.post(this.$baseUrl.getTestTime).then(res => {
                    this.testInfo = res.data
                    this.showTip = true
                })
            }
        },
        getArticleErrorQuestion(name, id, status, categoryId) {
            this.$axios
                .post(this.$baseUrl.getArticleErrorQuestion, {
                    articleId: id,
                    status
                })
                .then(res => {
                    this.$router.push({
                        name: 'analyze',
                        params: {
                            id,
                            name,
                            status,
                            errorQuestion: res.data,
                            categoryId
                        }
                    })
                })
        },
        goHome() {
            this.$router.push('/')
        }
    },
    filters: {
        timeformat(time) {
            let date = new Date(time)
            return date.getMonth() + 1 + '/' + date.getDate()
        }
    }
}
</script>

<style lang="scss" scoped>
.collection {
    padding-top: 6.5vw;
    .title {
        color: #7f7f7f;
        font-size: 4vw;
        margin-left: 6.5vw;
    }
    .section {
        margin: 4vw 6.5vw 0;
        width: 60vw;
        height: 20vw;
        background-color: #f6c939;
        color: #fff;
        border-radius: 2vw;
        box-sizing: border-box;
        padding: 3vw;
        .month {
            font-size: 5vw;
        }
        .time {
            font-size: 4vw;
        }
        .section_name {
            font-size: 3vw;
            margin-top: 3vw;
            span {
                float: right;
            }
        }
        &.pass {
            background-color: #009b96;
        }
    }
    .allErrQ {
        margin-top: 8vw;
        ul {
            margin-top: 2vw;
            padding-top: 2vw;
            height: 54vh;
            overflow-y: scroll;
            box-sizing: border-box;
            li {
                height: 14.4vw;
                border-radius: 1vw;
                box-shadow: 0 0 2vw #ccc;
                margin: 0 6.5vw 4vw;
                display: grid;
                grid-template-columns: 10% 13% 45% 32%;
                align-items: center;
                padding: 0 2vw;
                .circle {
                    border: 4px solid #009d92;
                    border-radius: 50%;
                    width: 5vw;
                    height: 5vw;
                    justify-self: end;
                }
                .time {
                    justify-self: center;
                    color: #4c443f;
                    font-weight: bold;
                    font-size: 3.6vw;
                }
                .name {
                    color: #909090;
                    font-size: 3.6vw;
                }
                .status {
                    font-size: 2.8vw;
                    justify-self: end;
                    color: #009d92;
                }
                &.fail {
                    .circle {
                        border-color: #f6c939;
                    }
                    .status {
                        color: #f6c939;
                    }
                }
                &.continue {
                    .circle {
                        border-color: #4b3230;
                    }
                    .status {
                        color: #fe7872;
                    }
                }
            }
        }
        .btn {
            position: absolute;
            width: 100%;
            bottom: 4vw;
            text-align: center;
            button {
                height: 9vw;
                line-height: 9vw;
                width: 53vw;
                border-radius: 5vw;
                background-color: #009b96;
                color: #fff;
                font-size: 5vw;
            }
        }
        .noQues {
            height: 72vw;
            display: grid;
            align-items: center;
            justify-items: center;
            img {
                width: 41.3vw;
            }
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
            .pic {
                width: 24vw;
                margin-top: 5vw;
            }
            > div {
                color: #3b3b3b;
                font-size: 4.5vw;
                line-height: 7vw;
                letter-spacing: 2px;
                margin-top: 2vw;
                i {
                    font-style: normal;
                    margin-left: 3vw;
                }
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
                    strong {
                        font-size: 6vw;
                    }
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
        &.emptyQ {
            > div {
                .pic {
                    width: 28.8vw;
                }
            }
        }
    }
}
</style>