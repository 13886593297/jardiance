import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loading: false,
        interceptor: true
    },
    mutations: {
        show(state) {
            state.loading = true
        },
        hide(state) {
            state.loading = false
        },
        setInterceptor(state, val) {
            state.interceptor = val
        }
    }
})