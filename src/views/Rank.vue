<template>
    <div class="rank">
        <div class="top">
            <div class="my_ranking">
                <h5>我的排名</h5>
                <span>My Ranking</span>
            </div>
            <img :src="avatar" alt />
        </div>
        <div class="user_rank">
            <p>
                TOP {{user_rank}}
                <img src="../assets/img/rank/arrow.png" alt />
            </p>
            <p>
                我的积分
                <span>{{user_score}}</span>
            </p>
            <img class="crown" src="../assets/img/rank/crown.png" alt />
        </div>
        <div class="total_rank">
            <h5>总排行榜</h5>
            <ul>
                <li
                    v-for="(item, key) in group"
                    :key="key"
                    :class="{ active: active == key }"
                    @click="change(key)"
                >{{item}}</li>
            </ul>
            <ul>
                <li v-for="(item, key) in rank" :key="key">
                    <img :src="item.avatar || default_avatar" alt />
                    <div>
                        <p class="name">
                            {{item.name}}
                            <br />
                            <span>{{active == 0 ? '积分' : '平均积分'}}{{item.score || 0}}</span>
                        </p>
                        <p class="rank">TOP{{key + 1}}</p>
                    </div>
                </li>
            </ul>
        </div>
        <div class="btn">
            <button @click="goHome">返回首页</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            default_avatar: require('../assets/img/rank/default_avatar.png'),
            avatar: this.$handler.getStorage('avatar'),
            user_rank: this.$handler.getStorage('personalRank'),
            user_score: this.$handler.getStorage('totalScore'),
            group: ['REP', 'DM', 'RSD', 'RMM'],
            apiArr: ['personalRank', 'teamRank?name=DM', 'teamRank?name=RSD', 'teamRank?name=RMM'],
            active: 0,
            rank: []
        }
    },
    created() {
        this.getRank()
    },
    methods: {
        change(key) {
            if (this.active == key) return
            this.active = key
            this.getRank()
        },
        getRank() {
            this.$axios
                .get('/api/rank/' + this.apiArr[this.active])
                .then(res => {
                    console.log(res)
                    this.rank = res.data
                })
        },
        goHome() {
            this.$router.push('/')
        }
    }
}
</script>

<style lang="scss" scoped>
.rank {
    padding: 6.5vw;
    h5 {
        font-size: 4.2vw;
        color: #555555;
    }
    .top {
        display: grid;
        grid-template-columns: repeat(2, 50%);
        .my_ranking {
            span {
                color: #909090;
                font-size: 4vw;
            }
        }
        img {
            width: 10vw;
            border: 6px solid #fff;
            border-radius: 50%;
            justify-self: end;
        }
    }
    .user_rank {
        margin-top: 2vw;
        background-color: #008d7c;
        border-radius: 1vw;
        height: 25.6vw;
        box-sizing: border-box;
        padding: 4vw;
        color: #fff;
        p {
            &:nth-child(1) {
                font-size: 6vw;
                img {
                    width: 3vw;
                }
            }
            &:nth-child(2) {
                margin-top: 1vw;
                span {
                    margin-left: 4vw;
                }
            }
        }
        .crown {
            float: right;
            width: 6vw;
            margin-top: -2vw;
        }
    }
    .total_rank {
        margin-top: 9vw;
        ul {
            &:nth-of-type(1) {
                display: grid;
                grid-template-columns: repeat(3, 29%) 13%;
                margin-top: 3vw;
                li {
                    color: #cfcfcf;
                    &.active {
                        color: #404040;
                    }
                }
            }
            &:nth-of-type(2) {
                height: 40vh;
                overflow-y: scroll;
                margin-top: 3vw;
                img {
                    width: 13.8vw;
                    border-radius: 50%;
                }
                li {
                    display: grid;
                    grid-template-columns: 25% 75%;
                    align-items: center;
                    > div {
                        display: grid;
                        grid-template-columns: 70% 30%;
                        align-items: center;
                        justify-items: center;
                        border-bottom: 1px solid #eaeaea;
                        .name {
                            justify-self: start;
                            color: #707070;
                            span {
                                color: #aaaaaa;
                                font-size: 3vw;
                            }
                        }
                        .rank {
                            color: #008d7c;
                            font-weight: bold;
                            padding: 6.5vw 0;
                        }
                    }
                }
            }
        }
    }
    .btn {
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 4vw;
        text-align: center;
        box-sizing: border-box;
        button {
            height: 9vw;
            line-height: 9vw;
            width: 53vw;
            border-radius: 5vw;
            background-color: #009b96;
            color: #fff;
            font-size: 5vw;
        }
    }
}
</style>