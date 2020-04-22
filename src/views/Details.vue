<template>
    <div class="details">
        <tip v-show="showTip" title="404！" content="很抱歉，这已经是最后一篇了。"></tip>
        <div class="header">
            <div class="header-arrow">
                <img src="../assets/img/details/back.png" @click="back" alt />
                <h4 v-if="type == '基础训练'">SECTION{{description}}</h4>
                <h4 v-else class="small">欧唐静产品介绍应用习题1</h4>
                <img src="../assets/img/details/next.png" @click="next" alt />
            </div>
            <p class="header-title">{{name}}</p>
        </div>
        <div class="content">
            <div class="main">
                <pdf
                    :src="url"
                    :page="currentPage"
                    @num-pages="pageCount = $event"
                    @page-loaded="pageLoaded($event)"
                    @loaded="loadPdfHandler"
                    v-if="urlType == 'pdf'"
                ></pdf>
                <img :src="url" alt v-if="urlType == 'img'" />
                <video :src="url" v-if="urlType == 'mp4'" width="100%" autoplay controls></video>
            </div>
            <div class="ball">
                <img src="../assets/img/details/ball.png" alt />
                <div class="btn">
                    <div></div>
                    <div @click="changePdfPage(0)"></div>
                    <div></div>
                    <div @click="changePdfPage(1)"></div>
                    <div></div>
                </div>
            </div>
        </div>
        <div class="zoomTip" v-if="tipShow">
            <img src="../assets/img/details/hand.png" alt />
            <p>阅读内容可点击放大</p>
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
            name: '',
            url: '',
            urlType: '',
            sectionNo: '',
            summary: '',
            currentPage: 0,
            pageCount: 0,
            ableClick: false,
            uuid: '',
            showTip: false,
            nextArticleId: null,
            trainStatus: null,
            type: '',
            description: '',
            tipShow: false
        }
    },
    created() {
        // test begin
        // this.urlType = 'pdf'
        // this.url = 'https://gamiwechat.lillyadmin.cn/uploads/jardiance/01.pdf'
        // this.urlType = 'img'
        // this.url = 'https://www.hanboshi.com/ueditor/php/upload/image/20190902/1567413203130003.png'
        // this.urlType = 'mp4'
        // this.url = 'http://df-emall.com/media/company.mp4'
        // test end

        this.$axios
            .all([this.startReadArticle(), this.getArticleByArticleId()])
            .then(
                this.$axios.spread((read, articleList) => {
                    this.uuid = read.data.uuid
                    this.name = articleList.data[0][0].name
                    this.type = articleList.data[0][0].type
                    this.nextArticleId = articleList.data[0][0].nextArticleId
                    this.trainStatus = articleList.data[0][0].trainStatus
                    this.description = articleList.data[0][0].description
                    this.urlHandler(articleList.data[0][0].pdf)
                    // test begin
                    // this.urlHandler(this.url)
                    // test end
                    document.title = this.type
                })
            )
    },
    beforeDestroy() {
        this.$axios.post(this.$baseUrl.endReadArticle, {
            endTime: new Date(),
            uuid: this.uuid
        })
        document
            .querySelectorAll('meta')[2]
            .setAttribute(
                'content',
                'width=device-width,initial-scale=1.0,maximum-scale=1.0'
            )
    },
    methods: {
        back() {
            if (window.history.length == 1) {
                this.$router.replace({ name: 'index' })
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
        urlHandler(src) {
            if (src.endsWith('pdf')) {
                this.tipShow = true
                this.urlType = 'pdf'
                this.url = pdf.createLoadingTask({
                    url: src,
                    CMapReaderFactory
                })
                document
                    .querySelectorAll('meta')[2]
                    .setAttribute(
                        'content',
                        'width=device-width,user-scalable=yes'
                    )
            } else if (src.endsWith('png' || 'jpg' || 'jpeg' || 'gif')) {
                this.tipShow = true
                this.ableClick = true
                this.urlType = 'img'
                this.url = src
                document
                    .querySelectorAll('meta')[2]
                    .setAttribute(
                        'content',
                        'width=device-width,user-scalable=yes'
                    )
            } else if (src.endsWith('mp4')) {
                this.ableClick = true
                this.tipShow = false
                this.urlType = 'mp4'
                this.url = src
            }
        },
        next() {
            if (this.nextArticleId == -1) {
                this.showTip = true
                setTimeout(() => {
                    this.showTip = false
                }, 2000)
                return
            } else {
                this.$axios
                    .get(this.$baseUrl.getArticleByArticleId, {
                        params: {
                            articleId: this.nextArticleId,
                            categoryId: this.categoryId
                        }
                    })
                    .then(res => {
                        this.id = res.data[0][0].id
                        this.name = res.data[0][0].name
                        this.nextArticleId = res.data[0][0].nextArticleId
                        this.trainStatus = res.data[0][0].trainStatus
                        this.description = res.data[0][0].description
                        this.urlHandler(res.data[0][0].pdf)
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
                console.log(this.currentPage, this.pageCount)
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
                    name: this.name,
                    status: this.trainStatus,
                    type: this.type,
                    description: this.description
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
        height: 24vw;
        display: grid;
        grid-template-rows: 12vw 12vw;
        position: relative;
        align-items: center;
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
        }
    }
    .content {
        background-color: var(--cyan);
        height: calc(100vh - 24vw);
        position: relative;
        box-sizing: border-box;
        .main {
            height: calc(100vh - 38.5vw);
            overflow-y: scroll;
        }
        .ball {
            position: absolute;
            width: 100%;
            height: 14.6vw;
            bottom: 0;
            text-align: center;
            font-size: 0;
            img {
                width: 47vw;
            }
            .btn {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                display: grid;
                grid-template-columns: 26% 17% 14% 17% 26%;
                div {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
    .zoomTip {
        position: absolute;
        width: 44.6vw;
        height: 20.4vw;
        background-color: rgba($color: #000000, $alpha: 0.7);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: #fff;
        border-radius: 3vw;
        font-size: 3.5vw;
        animation: fadeOut 5s 0.5s forwards;
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