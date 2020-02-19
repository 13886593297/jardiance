<template>
    <div class="index">
        <div class="userInfo">
            <div class="userInfo-top">
                <img :src="userInfo.avatar" alt />
                <div>
                    <p class="small">WELCOME</p>
                    <p>{{ userInfo.name }}</p>
                </div>
            </div>
            <div class="userInfo-bottom">
                <div>
                    <p class="big">{{ userInfo.totalScore || 0 }}</p>
                    <p class="small">个人积分</p>
                </div>
                <div>
                    <p class="big">{{ userInfo.personalRank || 0 }}</p>
                    <p class="small">排名</p>
                </div>
                <div>
                    <p class="big">{{ userInfo.signTotalScore || 0 }}</p>
                    <p class="small">已打卡</p>
                </div>
            </div>
        </div>
        <div class="process" @click="toTrainIndex">
            <div class="top">
                <img src="../assets/img/index/2.png" alt />
                <div class="list-item">
                    <p>基础训练</p>
                    <p>Basic Training</p>
                </div>
                <div>{{ userInfo.totalTrain }}/{{ userInfo.totalQuestion }}</div>
            </div>
            <div class="process-bar">
                <div class="process-bar-area" ref="process"></div>
            </div>
        </div>
        <div class="list">
            <div @click="toMedical">
                <img src="../assets/img/index/3.png" alt />
                <div class="list-item">
                    <p>医讯速递</p>
                    <p>Medical Infomatics Express</p>
                </div>
            </div>
            <div @click="toError">
                <img src="../assets/img/index/4.png" alt />
                <div class="list-item">
                    <p>错题集锦</p>
                    <p>Error Collection</p>
                </div>
            </div>
            <div @click="toRanking">
                <img src="../assets/img/index/5.png" alt />
                <div class="list-item">
                    <p>排行榜</p>
                    <p>Ranking List</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'index',
    data() {
        return {
            userInfo: {},
        }
    },
    created() {
        this.$axios.get(this.$baseUrl.userInfo).then(res => {
            if (res.data.userCode == 2) {
                this.userInfo = res.data.reUserInfo
                let processWidth = this.userInfo.totalTrain / this.userInfo.totalQuestion
                this.$refs.process.style.width = Math.floor(processWidth * 100) + '%'
                window.sessionStorage.setItem('user', JSON.stringify(res.data.reUserInfo))
            }
        })
    },
    methods: {
        toTrainIndex() {
            this.$router.push('trainIndex')
        },
        toMedical() {
            this.$router.push('medical')
        },
        toError() {
            this.$router.push('errorCollection')
        },
        toRanking() {
            this.$router.push('rank')
        }
    }
}
</script>
<style lang="scss" scoped>
.index {
    background: #f5f5f5 url('../assets/img/index/1.png') no-repeat;
    background-size: contain;
    height: 100vh;
    .userInfo {
        padding: 15.5vw 8vw 6.2vw;
        color: #fff;
        .userInfo-top {
            display: flex;
            align-items: center;
            height: 20vw;
            img {
                width: 20vw;
                height: 20vw;
                border-radius: 50%;
            }
            div {
                margin-left: 4vw;
                p {
                    margin-bottom: 1vw;
                    text-align: center;
                }
                p:nth-of-type(2) {
                    font-size: 4.5vw;
                }
            }
        }
        .userInfo-bottom {
            height: 17.8vw;
            margin-top: 3.6vw;
            display: grid;
            grid-template-columns: repeat(3, 1fr) 5vw;
            align-items: center;
            gap: 2vw;
            text-align: center;
        }
    }
    .process {
        margin: 5.4vw 4vw 4.8vw;
        background-color: #fff;
        border-radius: 2vw;
        padding: 3.4vw 2.7vw;
        .top {
            display: grid;
            grid-template-columns: 7vw auto 7vw;
            align-items: center;
            img {
                width: 7vw;
            }
            div:nth-of-type(2) {
                font-size: 2vw;
                align-self: end;
            }
        }
        .process-bar {
            width: 100%;
            height: 1.2vw;
            margin-top: 2.7vw;
            background-color: #f1f1f1;
            border-radius: 4vw;
            .process-bar-area {
                background-color: var(--yellow);
                border-radius: 4vw;
                max-width: 100%;
                height: 100%;
            }
        }
    }
    .list {
        margin: 0 4vw;
        > div {
            margin-bottom: 5.4vw;
            background-color: #fff;
            border-radius: 2vw;
            display: grid;
            grid-template-columns: 13.1vw auto;
            align-items: center;
            img {
                width: 13.1vw;
            }
        }
    }
}

.small {
    font-size: 3vw;
}

.big {
    font-size: 5.4vw;
    font-weight: 100;
}

.list-item {
    margin-left: 2vw;
    font-size: 3.2vw;
    p:nth-of-type(2) {
        font-size: 2.5vw;
        color: #969394;
    }
}
</style>
