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
        if (this.interceptor) {
            this.myInterceptor = this.$axios.interceptors.request.use(config => {
                this.show()
                return config
            })

            this.$axios.interceptors.response.use(response => {
                this.hide()
                return response
            })
        }
    },
    watch: {
        interceptor(newVal, oldVal) {
            if (newVal == false) {
                this.$axios.interceptors.request.eject(this.myInterceptor)
            } else {
                this.myInterceptor = this.$axios.interceptors.request.use(config => {
                    this.show()
                    return config
                })
            }
        }
    },
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
