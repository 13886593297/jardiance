<template>
    <div class="medical">
        <div class="header">
            <img src="../assets/img/trainIndex/home.png" alt @click="goHome" />
            <div
                v-for="(item, key) in titleArr"
                :key="key"
                @click="change(key)"
                :class="{active: active == key}"
            >{{item.name}}</div>
        </div>
        <div class="content" :class="{new: active == 1}">
            <ul>
                <li
                    v-for="(item, key) in list"
                    :key="key"
                    :class="{fail: item.trainStatus == 2, pass: item.trainStatus == 1, normal: item.trainStatus == 0}"
                    @click="toDetails(item.id, item.category_id)"
                >
                    <div class="top">
                        <div>
                            <p class="time">{{item.create_time | timeformat}}</p>
                            <p class="name">{{item.name}}</p>
                        </div>
                        <div>
                            <img :src="require(`../assets/img/medical/${item.trainStatus}.png`)" alt />
                            <p class="status" v-if="item.trainStatus == 1">PASS</p>
                            <p class="status" v-if="item.trainStatus == 2">FAIL</p>
                        </div>
                    </div>
                    <p class="text" v-if="item.trainStatus == 1">恭喜您，本章已通过</p>
                    <p class="text" v-if="item.trainStatus == 2">很遗憾，本章未能通关，请继续努力！</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import store from '../store'
import { mapMutations } from 'vuex'
export default {
    store,
    name: 'medical',
    data() {
        return {
            titleArr: [],
            active: window.sessionStorage.getItem('medicalActive') || 0,
            list: []
        }
    },
    created() {
        this.init()
        this.setInterceptor(false)
    },
    destroyed() {
        window.sessionStorage.setItem('medicalActive', this.active)
        this.setInterceptor(true)
    },
    filters: {
        timeformat(time) {
            let date = time.split('T')[0].split('-')
            return date[1] + '/' + date[2]
        }
    },
    methods: {
        ...mapMutations(['setInterceptor']),
        init() {
            this.$axios
                .post(this.$baseUrl.trainIndex, { type: '医讯速递' })
                .then(res => {
                    this.titleArr = res.data
                    this.getTypeData()
                })
        },
        getTypeData() {
            this.$axios
                .get(this.$baseUrl.getArticleList, {
                    params: {
                        categoryId: this.titleArr[this.active].id,
                        pageNow: 1,
                        pageSize: 10
                    }
                })
                .then(res => {
                    this.list = res.data
                })
        },

        toDetails(id, categoryId) {
            this.$router.push({
                name: 'details',
                query: { id, categoryId }
            })
        },
        goHome() {
            this.$router.push('/')
        },
        change(key) {
            this.active = key
            this.getTypeData()
        }
    }
}
</script>

<style lang="scss" scoped>
.medical {
    .header {
        img {
            width: 6vw;
        }
        background-color: #009b96;
        height: 15.3vw;
        display: grid;
        grid-template-columns: 20% 30% 30% 20%;
        align-items: center;
        justify-items: center;
        > div {
            align-self: end;
            padding-bottom: 4vw;
            margin-bottom: 1vw;
            color: #e2e1e1;
            border-bottom: 1px solid transparent;
            &.active {
                border-color: #fff;
                color: #fff;
            }
        }
    }
    .content {
        padding: 9.6vw 8vw 0;
        ul {
            height: 110vw;
            overflow-y: scroll;
            li {
                padding: 3vw 3vw 3vw 6vw;
                border-left: 1.5vw solid transparent;
                border-radius: 1vw;
                -webkit-box-shadow: 0 0 2vw #ccc;
                box-shadow: 0 0 2vw #ccc;
                height: 31.2vw;
                box-sizing: border-box;
                margin-bottom: 4vw;
                .top {
                    display: grid;
                    grid-template-columns: 80% 20%;
                    .time {
                        font-size: 5vw;
                        color: #4d433f;
                    }
                    .name {
                        font-size: 4vw;
                        color: #8d918d;
                        margin-top: 1vw;
                        font-weight: 600;
                    }
                    div:nth-child(2) {
                        justify-self: end;
                        img {
                            width: 7.3vw;
                        }
                        .status {
                            font-size: 2vw;
                            text-align: center;
                        }
                    }
                }
                .text {
                    font-size: 2.7vw;
                    margin-top: 8vw;
                }
                &.fail {
                    border-color: #ffd502;
                    background-color: #fff7ce;
                    .text {
                        color: #988c57;
                    }
                    .status {
                        color: #d0ae02;
                    }
                }
                &.pass {
                    border-color: #009b96;
                    background-color: #edf6f4;
                    .text {
                        color: #516d69;
                    }
                    .status {
                        color: #4ab4a3;
                    }
                }
                &.normal {
                    border-color: #4b3231;
                    background-color: #ededed;
                }
            }
        }
        &.new {
            li {
                height: 18vw;
                padding-top: 1.5vw;
                padding-left: 4.5vw;
                padding-bottom: 0;
                .top {
                    height: 8vw;
                    .time,
                    .name {
                        display: inline-block;
                    }
                    .name {
                        margin-left: 4vw;
                    }
                }
                .text {
                    margin-top: 3.5vw;
                }
            }
        }
    }
}
</style>