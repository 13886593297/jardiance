import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Axios from 'axios'
import VConsole from 'vconsole'
import BaseUrl from './assets/js/baseUrl'
import * as Handler from './assets/js/handler'
import share from './assets/js/share'
import './assets/css/base.scss'

// new VConsole()
Vue.config.productionTip = false
if (process.env.NODE_ENV == "development") {
    Axios.defaults.baseURL = 'http://192.168.1.145:8080'
}

const defaultTitle = '日静月益'
router.beforeEach((to, from, next) => {
    document.title = to.meta.title ? to.meta.title : defaultTitle
    let sign = window.localStorage.getItem('sign')
    let signUrl = to.name
    if (signUrl != 'index') {
        if (!sign) {
            setSign(signUrl)
        } else {
            let date = new Date().getDate()
            let signDate = new Date(sign).getDate()
            date != signDate && setSign(signUrl)
        }
    }
    next()
})

function setSign(signUrl) {
    setTimeout(() => {
        Axios.post(BaseUrl.userSign, { signUrl }).then(res => {
            if (res.data.status == 200) {
                console.log('打卡成功')
            }
            window.localStorage.setItem('sign', new Date())
        })
    }, 3000)
}

// 挂载全局对象
Vue.prototype.$axios = Axios
Vue.prototype.$baseUrl = BaseUrl
Vue.prototype.$handler = Handler
Vue.prototype.$share = share

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
