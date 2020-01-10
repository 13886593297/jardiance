<template>
    <div id="app">
        <v-loading :active.sync="loading" background-color="#f5f5f5" :opacity="1"></v-loading>
        <router-view />
    </div>
</template>
<script>
import store from './store'
import { mapState, mapMutations } from 'vuex'
export default {
    store,
    data() {
        return {
            myInterceptor: null
        }
    },
    computed: {
        ...mapState(['loading', 'interceptor'])
    },
    created() {
        // if (this.interceptor) {
        //     this.myInterceptor = this.$axios.interceptors.request.use(config => {
        //         this.show()
        //         return config
        //     })

        //     this.$axios.interceptors.response.use(response => {
        //         this.hide()
        //         return response
        //     })
        // }

        let hash = window.location.hash
        if (hash != '#/') {
            window.sessionStorage.setItem('hash', hash)
        }
        // userCode 2 正常 1 没有这个用户
        this.$axios.get(this.$baseUrl.userInfo).then(res => {
            if (typeof res.data == 'string') {
                window.location.href = res.data
            } else if (res.data.userCode == 2) {
                window.sessionStorage.setItem('user', JSON.stringify(res.data.reUserInfo))
                hash = window.sessionStorage.getItem('hash')
                if (hash) {
                    window.location = window.location.origin + window.location.pathname + hash
                }
            } else {
                alert('无权限访问')
                setTimeout(() => {
                    WeixinJSBridge.call('closeWindow')
                }, 100)
            }
        })
    },
    mounted() {
        // this.$share()
    },
    // watch: {
    //     interceptor(newVal, oldVal) {
    //         if (newVal == false) {
    //             this.$axios.interceptors.request.eject(this.myInterceptor)
    //         } else {
    //             this.myInterceptor = this.$axios.interceptors.request.use(config => {
    //                 this.show()
    //                 return config
    //             })
    //         }
    //     }
    // },
    methods: {
        ...mapMutations(['setInterceptor', 'show', 'hide'])
    }
}
</script>
<style lang="scss">
#app {
    background-color: #fff;
    height: 100vh;
    box-sizing: border-box;
}
</style>
