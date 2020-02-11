<template>
    <div class="details">
        <tip v-show="showTip" title="404！" content="很抱歉，这已经是最后一篇了。"></tip>
        <div class="header">
            <div class="header-arrow">
                <img src="../assets/img/details/back.png" @click="back" alt />
                <h4 v-if="type == '基础训练'">SECTION{{sort}}</h4>
                <h4 v-else class="small">欧唐静产品介绍应用习题</h4>
                <img src="../assets/img/details/next.png" @click="next" alt />
            </div>
            <p class="header-title">{{name}}</p>
            <img class="ball" src="../assets/img/details/ball.png" alt />
            <div class="btn">
                <div></div>
                <div @click="changePdfPage(0)"></div>
                <div></div>
                <div @click="changePdfPage(1)"></div>
                <div></div>
            </div>
        </div>
        <div class="content">
            <div ref="pdf">
                <pdf
                    :src="pdf"
                    :page="currentPage"
                    @num-pages="pageCount = $event"
                    @page-loaded="pageLoaded($event)"
                    @loaded="loadPdfHandler"
                ></pdf>
            </div>
        </div>
        <!-- <div class="zoomTip">
            <img src="../assets/img/details/hand.png" alt="">
            <p>阅读内容可点击放大</p>
        </div> -->
    </div>
</template>

<script>
import pdf from 'vue-pdf'
// import Panzoom from '@panzoom/panzoom'
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
            type: '',
        }
    },
    created() {
        this.$axios.all([this.startReadArticle(), this.getArticleByArticleId()]).then(
            this.$axios.spread((read, articleList) => {
                this.uuid = read.data.uuid
                this.name = articleList.data[0][0].name
                this.sort = articleList.data[0][0].sort
                this.type = articleList.data[0][0].type
                this.nextArticleId = articleList.data[0][0].nextArticleId
                this.trainStatus = articleList.data[0][0].trainStatus
                this.pdf = pdf.createLoadingTask({ url: articleList.data[0][0].pdf, CMapReaderFactory })
                document.title = this.type
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
                    categoryId: this.categoryId,
                    url: window.location.href
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
                    type: this.type
                }
            })    
        },
        // pdf加载时
        loadPdfHandler(e) {
            // Panzoom(this.$refs.pdf, {minScale: 1})
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
        position: relative;
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
            width: 47vw;
            left: 50%;
            transform: translateX(-50%);
            top: 23vw;
            z-index: 1;
        }
        .btn {
            position: absolute;
            bottom: -5vw;
            width: 100%;
            height: 9vw;
            display: grid;
            grid-template-columns: 26% 17% 14% 17% 26%;
            justify-items: center;
            z-index: 1;
            div {
                width: 100%;
                height: 100%;
            }
        }
    }
    .content {
        background-color: var(--cyan);
        height: calc(100vh - 30vw);
        overflow-y: scroll;
        position: relative;
        padding-top: 10vw;
        box-sizing: border-box;
    }
    .zoomTip {
        position: absolute;
        width: 44.6vw;
        height: 20.4vw;
        background-color: rgba($color: #000000, $alpha: .7);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: #fff;
        border-radius: 3vw;
        font-size: 3.5vw;
        animation: fadeOut 3s .5s forwards;
        img {
            width: 11.3vw;
            margin-top: 1vw;
        }
    }
}

@keyframes fadeOut {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
</style>