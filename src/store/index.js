import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loading: true,
        opacity: 1
    },
    mutations: {
        show(state) {
            state.loading = true
        },
        hide(state) {
            state.loading = false
        },
        setOpacity(state, val) {
            state.opacity = val
        }
    }
})