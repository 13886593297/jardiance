<template>
    <div class="details">
        <tip v-show="showTip" title="404！" content="很抱歉，这已经是最后一篇了。"></tip>
        <div class="header">
            <div class="header-arrow">
                <img src="../assets/img/details/back.png" @click="back" alt />
                <h4 v-if="categoryId < 3">SECTION{{sort}}</h4>
                <h4 v-else class="small">欧唐静产品介绍应用习题</h4>
                <img src="../assets/img/details/next.png" @click="next" alt />
            </div>
            <p class="header-title">{{name}}</p>
            <img class="ball" src="../assets/img/details/ball.png" alt />
        </div>
        <div class="content" >
            <div ref="pdf">
                <pdf
                    :src="pdf"
                    :page="currentPage"
                    @num-pages="pageCount = $event"
                    @page-loaded="pageLoaded($event)"
                    @loaded="loadPdfHandler"
                ></pdf>
            </div>
            <div class="slip">
                <button @click="changePdfPage(0)">上一页</button>
                <button @click="changePdfPage(1)">下一页</button>
            </div>
        </div>
    </div>
</template>

<script>
import pdf from 'vue-pdf'
import Panzoom from '@panzoom/panzoom'
import CMapReaderFactory from 'vue-pdf/src/CMapReaderFactory.js'
import Tip from '../components/Tip'
export default {
    components: { pdf, Tip },
    data() {
        return {
            id: this.$route.query.id,
            categoryId: this.$route.query.categoryId,
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
            trainStatus: null,
            sort: null,
        }
    },
    created() {
        if (this.categoryId > 2) {
            document.title = '医讯速递'
        }
        this.$axios.all([this.startReadArticle(), this.getArticleByArticleId()]).then(
            this.$axios.spread((read, articleList) => {
                // console.log(articleList.data[0][0])
                this.uuid = read.data.uuid
                this.name = articleList.data[0][0].name
                this.sort = articleList.data[0][0].sort
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
            if (window.history.length  == 1) {
                this.$router.replace({name: 'index'})
            } else {
                this.$router.back()
            }
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
                    this.sort = res.data[0][0].sort
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
                    sort: this.sort,
                    name: this.name,
                    status: this.trainStatus,
                    categoryId: this.categoryId
                }
            })    
        },
        // pdf加载时
        loadPdfHandler(e) {
            Panzoom(this.$refs.pdf, {minScale: 1})
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
            bottom: 4vw;
            width: 100%;
            display: grid;
            grid-template-columns: repeat(2, 50%);
            justify-items: center;
            button {
                width: 26vw;
                height: 8vw;
                border-radius: 10vw;
                background-color: var(--cyan);
                opacity: .5;
                color: #fff;
            }
        }
    }
}
</style>