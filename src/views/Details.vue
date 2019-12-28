<template>
    <div class="details">
        <tip v-show="showTip" title="404！" content="很抱歉，这已经是最后一篇了。"></tip>
        <div class="header">
            <div class="header-arrow">
                <img src="../assets/img/details/back.png" @click="back" alt />
                <h4>SECTION{{id}}</h4>
                <img src="../assets/img/details/next.png" @click="next" alt />
            </div>
            <p class="header-title">{{name}}</p>
            <img class="ball" src="../assets/img/details/ball.png" alt />
        </div>
        <div class="content">
            <pdf
                :src="pdf"
                :page="currentPage"
                @num-pages="pageCount = $event"
                @page-loaded="currentPage = $event"
                @loaded="loadPdfHandler"
            ></pdf>
            <div class="slip">
                <div @click="changePdfPage(0)"></div>
                <div @click="changePdfPage(1)"></div>
            </div>
        </div>
    </div>
</template>

<script>
import pdf from 'vue-pdf'
import Tip from '../components/Tip'
export default {
    components: { pdf, Tip },
    data() {
        return {
            id: this.$route.query.id,
            status: this.$route.query.status,
            idArr: this.$route.query.idArr || [],
            name: '',
            pdf: '',
            sectionNo: '',
            summary: '',
            currentPage: 0,
            pageCount: 0,
            uuid: '',
            index: 0,
            showTip: false
        }
    },
    created() {
        // this.pdf = pdf.createLoadingTask(this.pdf)
        this.index = this.idArr.indexOf(this.id)
        this.$axios.all([this.startReadArticle(), this.getNextArticle()]).then(
            this.$axios.spread((read, next) => {
                this.uuid = read.data.uuid
                this.id = next.data[0].id
                this.name = next.data[0].name
                this.pdf = next.data[0].pdf
            })
        )
    },
    beforeDestroy() {
        this.$axios.post(this.$baseUrl.endReadArticle, {
            endTime: new Date(),
            uuid: this.uuid
        })
    },
    methods: {
        back() {
            this.$router.back()
        },
        startReadArticle() {
            return this.$axios.post(this.$baseUrl.startReadArticle, {
                startTime: new Date(),
                articleId: this.id
            })
        },
        getNextArticle() {
            return this.$axios.post(this.$baseUrl.getNextArticle, {
                articleId: this.idArr[this.index] || this.id
            })
        },
        next() {
            this.index++
            if (this.index >= this.idArr.length) {
                this.showTip = true
                setTimeout(() => {
                    this.showTip = false
                }, 2000)
                return
            } else {
                this.getNextArticle().then(res => {
                    this.id = res.data[0].id
                    this.name = res.data[0].name
                    this.pdf = res.data[0].pdf
                })
            }
        },
        changePdfPage(val) {
            if (val === 0 && this.currentPage > 1) {
                this.currentPage--
            }
            if (val === 1 && this.currentPage < this.pageCount) {
                this.currentPage++
                if (process.env.NODE_ENV == 'development') {
                    if (this.currentPage == 2) {
                        this.$router.replace({
                            name: 'completeStudy',
                            query: {
                                id: this.id,
                                name: this.name,
                                status: this.status
                            }
                        })
                    }
                } else {
                    if (this.currentPage == this.pageCount) {
                        this.$router.replace({
                            name: 'completeStudy',
                            query: {
                                id: this.id,
                                name: this.name,
                                status: this.status
                            }
                        })
                    }
                }
            }
        },
        // pdf加载时
        loadPdfHandler(e) {
            this.currentPage = 1 // 加载的时候先加载第一页
        }
    }
}
</script>

<style lang="scss" scoped>
.details {
    .header {
        height: 30vw;
        display: grid;
        grid-template-rows: 12vw auto;
        .header-arrow {
            display: grid;
            grid-template-columns: 15% auto 15%;
            justify-items: center;
            align-items: center;
            img {
                width: 6.6vw;
            }
            h4 {
                color: #4d3433;
                font-size: 5vw;
                font-weight: 400;
            }
        }
        .header-title {
            text-align: center;
            color: #4d3433;
            font-size: 4.2vw;
            font-weight: 600;
            padding-top: 2vw;
        }
        .ball {
            position: absolute;
            width: 14.6vw;
            left: 50%;
            transform: translateX(-50%);
            top: 23vw;
            z-index: 1;
        }
    }
    .content {
        background-color: var(--cyan);
        height: calc(100vh - 30vw);
        overflow-y: scroll;
        position: relative;
        padding-top: 10vw;
        box-sizing: border-box;
        .slip {
            position: absolute;
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            display: grid;
            grid-template-columns: repeat(2, 50%);
        }
    }
}
</style>