<template>
    <div class="analyze">
        <train-header :description="description" :name="name" :curQNo="totalQ.length - 1" :totalQ="totalQ"></train-header>
        <div class="processDiv">
            <div class="process-bar" ref="process_bar">
                <div v-for="i in totalQ.length" :key="i"></div>
            </div>
        </div>
        <ul class="question">
            <template v-for="(item, key) in totalQ">
                <li :key="key" v-if="item.is_correct == 2">
                    <p>题目{{key + 1}} {{item.question}}</p>
                    <div>正确答案</div>
                    <p>{{item.correntAnwser}}</p>
                </li>
            </template>
        </ul>
        <div class="btn" :class="{half: status == 2}">
            <button @click="back">返回目录</button>
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
            totalQ: this.$route.params.errorQuestion,
            categoryId: this.$route.params.categoryId,
            description: this.$route.params.description || this.$route.params.errorQuestion[0].description,
            topic: '',
            qCorrect: '',
            options: [],
            refuse: false,
            time: '',
            obj: {
                A: 0,
                B: 1,
                C: 2,
                D: 3
            }
        }
    },
    created() {
        this.init()
    },
    mounted() {
        this.$refs.process_bar.style.gridTemplateColumns = `repeat(${this.totalQ.length}, 1fr)`
        this.totalQ.forEach((item, key) => {
            if (item.is_correct == 1) {
                this.$refs.process_bar.children[key].style.backgroundColor = '#009b96'
            } else {
                this.$refs.process_bar.children[key].style.backgroundColor = '#fd7572'
            }
        })
    },
    methods: {
        init() {
            this.totalQ.forEach(item => {
                let correntQ = this.obj[item.anwser_correct.trim()]
                let options = []
                for (let key in item) {
                    if (item[key] && key == 'anwser_a' || key == 'anwser_b' || key == 'anwser_c' || key == 'anwser_d') {
                        options.push(item[key])
                    }
                }
                item.correntAnwser = options[correntQ]
            })
        },
        restart() {
            this.$axios
                .post(this.$baseUrl.getSubmitTime, {
                    articleId: this.id
                })
                .then(res => {
                    if (res.data.status == 200) {
                        this.$router.replace({
                            name: 'details',
                            query: {
                                id: this.id,
                                categoryId: this.categoryId
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
            if (window.history.length  == 1) {
                this.$router.replace({name: 'index'})
            } else {
                this.$router.back()
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.analyze {
    .header {
        padding: 6.5vw 6.5vw 0;
    }
    .processDiv {
        padding: 0 6.5vw;
        margin-top: 8.5vw;
        .process-bar {
            width: 100%;
            height: 1.4vw;
            background-color: #f1f1f1;
            border-radius: 4vw;
            display: grid;
            overflow: hidden;
            gap: 1px;
        }
    }
    .question {
        height: 56vh;
        margin-top: 3vw;
        margin-bottom: 4vw;
        padding: 2vw 6.5vw;
        overflow-y: scroll;
        li {
            padding: 3vw 7vw;
            border-left: 1vw solid #fe7575;
            border-radius: 1vw;
            box-shadow: 0 0 2vw #ccc;
            margin-bottom: 4vw;
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
        padding: 0 6.5vw;
        position: absolute;
        width: 100%;
        box-sizing: border-box;
        bottom: 4vw;
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