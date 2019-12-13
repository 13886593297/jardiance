<template>
    <div class="Section">
        <search-header name="back" :id="id" @getChildData="getChildData"></search-header>
        <div class="container" ref="container">
            <section-component
                v-for="(section, key) in sections"
                :key="key"
                :index="key"
                :section="section"
                :idArr="idArr"
                :ani="ani"
            ></section-component>
        </div>
    </div>
</template>
<script>
import SearchHeader from '../components/SearchHeader'
import SectionComponent from '../components/SectionComponent'
export default {
    data() {
        return {
            id: this.$route.query.id,
            sections: [],
            idArr: [],
            ani: false
        }
    },
    components: {
        SearchHeader,
        SectionComponent
    },
    created() {
        this.$axios
            .get(this.$baseUrl.article, {
                params: {
                    categoryId: this.id,
                    pageNow: 1,
                    pageSize: 10
                }
            })
            .then(res => {
                this.sections = res.data.reverse()
                this.$refs.container.style.gridTemplateRows = `repeat(${this.sections.length}, 42vw)`
                this.sections.forEach(item => {
                    this.idArr.push(item.id)
                })
            })
    },
    methods: {
        getChildData(val) {
            this.sections = []
            this.idArr = []
            this.ani = true
            setTimeout(() => {
                if (val.data.length == 0) {
                    alert('没有搜索到您输入的内容，请重新搜索！')
                }
                this.sections = val.data
                this.$refs.container.style.gridTemplateRows = `repeat(${this.sections.length}, 42vw)`
                this.sections.forEach(item => {
                    this.idArr.push(item.id)
                })
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