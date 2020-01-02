<template>
    <div class="Section">
        <search-header name="back" :id="id" @getChildData="getChildData"></search-header>
        <tip v-show="showTip" title="404！" content="很抱歉，没有您搜索的内容"></tip>
        <div class="container" ref="container">
            <section-component
                v-for="(section, key) in sections"
                :key="key"
                :index="key"
                :section="section"
                :ani="ani"
            ></section-component>
        </div>
    </div>
</template>
<script>
import SearchHeader from '../components/SearchHeader'
import SectionComponent from '../components/SectionComponent'
import Tip from '../components/Tip'
export default {
    data() {
        return {
            id: this.$route.query.id,
            sections: [],
            ani: false,
            showTip: false
        }
    },
    components: {
        SearchHeader,
        SectionComponent,
        Tip
    },
    created() {
        this.$axios
            .get(this.$baseUrl.getArticleList, {
                params: {
                    categoryId: this.id,
                    pageNow: 1,
                    pageSize: 10
                }
            })
            .then(res => {
                console.log(res)
                this.sections = res.data
                this.$refs.container.style.gridTemplateRows = `repeat(${this.sections.length}, 42vw)`
            })
    },
    methods: {
        getChildData(val) {
            this.sections = []
            this.ani = true
            if (val.data.length == 0) {
                this.showTip = true
                setTimeout(() => {
                    this.showTip = false
                }, 2000)
            }
            setTimeout(() => {
                this.sections = val.data
                this.$refs.container.style.gridTemplateRows = `repeat(${this.sections.length}, 42vw)`
            }, 500)
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    background-color: #009b96;
    height: calc(100vh - 22.3vw);
    text-align: center;
    display: grid;
    grid-template-rows: repeat(3, 42vw);
    overflow-y: scroll;
}
</style>