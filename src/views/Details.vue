<template>
    <div class="details">
        <tip v-show="showTip" title="404！" content="很抱歉，这已经是最后一篇了。"></tip>
        <div class="header">
            <div class="header-arrow">
                <img src="../assets/img/details/back.png" @click="back" alt />
                <h4 v-if="!from">SECTION{{id}}</h4>
                <h4 v-else class="small">欧唐静产品介绍应用习题</h4>
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
                @page-loaded="pageLoaded($event)"
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
import CMapReaderFactory from 'vue-pdf/src/CMapReaderFactory.js'
import Tip from '../components/Tip'
export default {
    components: { pdf, Tip },
    data() {
        return {
            id: this.$route.query.id,
            categoryId: this.$route.query.categoryId,
            from: this.$route.query.from || '',
            name: '',
            pdf: '',
            sectionNo: '',
            summary: '',
            currentPage: 0,
            pageCount: 0,
            ableClick: false,
            uuid: '',
            showTip: false,
            nextArticleId: null,
            trainStatus: null
        }
    },
    created() {
        this.$axios.all([this.startReadArticle(), this.getArticleByArticleId()]).then(
            this.$axios.spread((read, articleList) => {
                // console.log(articleList.data[0][0])
                this.uuid = read.data.uuid
                this.name = articleList.data[0][0].name
                this.nextArticleId = articleList.data[0][0].nextArticleId
                this.trainStatus = articleList.data[0][0].trainStatus
                this.pdf = pdf.createLoadingTask({ url: articleList.data[0][0].pdf, CMapReaderFactory })
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
        getArticleByArticleId() {
            return this.$axios.get(this.$baseUrl.getArticleByArticleId, {
                params: {
                    articleId: this.id,
                    categoryId: this.categoryId
                }
            })
        },
        next() {
            if (this.nextArticleId == -1) {
                this.showTip = true
                setTimeout(() => {
                    this.showTip = false
                }, 2000)
                return
            } else {
                this.$axios.get(this.$baseUrl.getArticleByArticleId, {
                params: {
                    articleId: this.nextArticleId,
                    categoryId: this.categoryId
                }
                }).then(res => {
                    console.log(res.data[0][0])
                    this.id = res.data[0][0].id
                    this.name = res.data[0][0].name
                    this.nextArticleId = res.data[0][0].nextArticleId
                    this.trainStatus = res.data[0][0].trainStatus
                    this.pdf = pdf.createLoadingTask({ url: res.data[0][0].pdf, CMapReaderFactory })
                })
            }
        },
        pageLoaded($event) {
            this.currentPage = $event
            this.ableClick = true
        },
        changePdfPage(val) {
            if (!this.ableClick) return
            if (val === 0 && this.currentPage > 1) {
                this.currentPage--
            } else if (val === 1) {
                if (process.env.NODE_ENV == "development") {
                        this.changeRoute()
                    return
                }
                if (this.currentPage < this.pageCount) {
                    this.currentPage++
            console.log(this.currentPage)
                } else {
                    this.changeRoute()
                }
            }
        },
        changeRoute() {
            this.$router.replace({
                name: 'completeStudy',
                query: {
                    id: this.id,
                    name: this.name,
                    status: this.trainStatus
                }
            })    
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
                &.small {
                    font-size: 4vw;
                }
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