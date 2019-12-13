<template>
    <div class="trainIndex">
        <search-header name="home" @getChildData="getChildData"></search-header>
        <div class="content" v-if="!search">
            <ul>
                <router-link
                    v-for="(data, key) in dataArr"
                    :key="key"
                    :to="{name: 'section', query: {id: data.id}}"
                    tag="li"
                >
                    <img :src="require(`../assets/img/trainIndex/${data.id}.png`)" alt />
                    <p class="name">{{data.name}}</p>
                    <p class="nameEn" v-if="data.id == 1">Product Section</p>
                    <p class="nameEn" v-if="data.id == 2">Competition Section</p>
                </router-link>
            </ul>
            <div class="btn">
                <button>名字还没定</button>
                <button>名字还没定</button>
            </div>
        </div>
        <div class="container" ref="container" v-else>
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
            dataArr: [],
            isLoading: false,
            sections: [],
            idArr: [],
            ani: false,
            search: false
        }
    },
    components: {
        SearchHeader,
        SectionComponent
    },
    created() {
        this.$axios
            .post(this.$baseUrl.trainIndex, {
                type: '基础训练'
            })
            .then(res => {
                this.dataArr = res.data
            })
    },
    methods: {
        getChildData(val) {
            this.search = true
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
.content {
    height: calc(100vh - 22.3vw);
    overflow: scroll;
    ul {
        display: grid;
        grid-template-rows: repeat(2, 50vw);
        align-items: center;
        justify-items: center;
        text-align: center;
        li {
            img {
                width: 18.6vw;
            }
            .name {
                font-size: 6vw;
                color: #5a5a5a;
            }
            .nameEn {
                font-size: 3vw;
                color: #a5a5a5;
            }
        }
    }
    .btn {
        text-align: center;
        button {
            width: 74vw;
            height: 9vw;
            margin-bottom: 3.5vw;
            border-radius: 5vw;
            color: #696969;
            font-size: 4.2vw;
            font-weight: 600;
            background-color: #e0e0e0;
        }
    }
}

.container {
    background-color: #009b96;
    height: calc(100vh - 22.3vw);
    text-align: center;
    display: grid;
    grid-template-rows: repeat(3, 42vw);
    overflow-y: scroll;
}
</style>