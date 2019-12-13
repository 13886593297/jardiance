<template>
    <div class="search">
        <img :src="img" @click="click" alt />
        <h4 :class="{hide: ani}">{{title}}</h4>
        <div class="searchDiv" :class="{ani, backAni, whirl}" @click="ani = true">
            <img class="searchImg" src="../assets/img/trainIndex/search.png" alt />
            <input type="text" class="searchInput" v-model.trim="searchText" @blur="blur" />
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            img:
                this.name == 'home'
                    ? require('../assets/img/trainIndex/home.png')
                    : require('../assets/img/trainIndex/back.png'),
            title: 'SEARCH',
            searchText: '',
            ani: false, // 开始动画
            backAni: false, // 回来的动画
            whirl: false // 转圈动画
        }
    },
    props: ['name', 'id'],
    methods: {
        click() {
            if (this.name == 'home') {
                this.$router.push('/')
            } else {
                this.$router.push('trainIndex')
            }
        },
        search() {
            if (this.searchText) {
                let text = this.searchText
                this.backAni = true
                this.title = 'Seaching...'
                this.searchText = ''
                setTimeout(() => {
                    this.ani = false
                    this.whirl = true
                    let params
                    if (this.name == 'home') {
                        params = { name: text }
                    } else {
                        params = { name: text, categoryId: this.id }
                    }
                    this.$axios
                        .post(this.$baseUrl.getArticleCategory, params)
                        .then(res => {
                            this.$emit('getChildData', res)
                            this.title = text
                            this.backAni = false
                            this.whirl = false
                        })
                }, 1300)
            }
        },
        blur() {
            this.title = 'SEARCH'
            if (!this.searchText) {
                this.backAni = true
                this.searchText = ''
                setTimeout(() => {
                    this.backAni = false
                    this.ani = false
                }, 1300)
            } else {
                this.search()
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@keyframes ani1 {
    0%,
    99% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

@keyframes ani2 {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

@keyframes toLeft {
    0% {
        width: 5vw;
    }
    99% {
        width: 60vw;
    }
    100% {
        right: 8vw;
        width: 60vw;
    }
}

@keyframes toRight {
    0% {
        width: 60vw;
    }
    99% {
        width: 3vw;
    }
    100% {
        right: 0;
        width: 3vw;
    }
}

@keyframes whirl {
    0% {
        right: 0;
        width: 3vw;
        border-left-color: transparent;
        transform: rotate(0deg);
    }
    100% {
        right: 0;
        width: 3vw;
        border-left-color: transparent;
        transform: rotate(360deg);
    }
}

.search {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    background-color: var(--cyan);
    height: 22.3vw;
    align-items: center;
    justify-items: center;
    img {
        width: 7.3vw;
    }
    h4 {
        color: #fff;
        font-weight: 500;
        &.hide {
            transition: opacity 0.5s;
            opacity: 0;
        }
    }
    .searchDiv {
        position: relative;
        font-size: 0;
        .searchInput {
            background-color: transparent;
            border: 2px solid #fff;
            border-radius: 4vw;
            text-align: center;
            position: absolute;
            padding-left: 2vw;
            width: 5vw;
            height: 5vw;
            top: 0;
            right: 0;
            opacity: 0;
            color: #fff;
        }
        &.ani {
            .searchImg {
                animation: ani1 1.5s forwards;
            }
            .searchInput {
                transition: opacity 2s;
                opacity: 1;
                animation: toLeft 1s 1s forwards;
            }
        }
        &.backAni {
            .searchImg {
                animation: ani2 1.5s forwards;
            }
            .searchInput {
                right: 8vw;
                width: 60vw;
                opacity: 1;
                animation: toRight 1s 0.5s forwards;
            }
        }
        &.whirl {
            .searchInput {
                animation: whirl 1s linear infinite;
            }
        }
    }
}
</style>