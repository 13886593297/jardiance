import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'index',
        component: Index
    },
    {
        path: '/trainIndex',
        name: 'trainIndex',
        component: () =>
            import(
                /* webpackChunkName: "trainIndex" */ '../views/TrainIndex.vue'
            ),
        meta: {
            title: '基础培训'
        }
    },
    {
        path: '/section',
        name: 'section',
        component: () =>
            import(/* webpackChunkName: "section" */ '../views/Section.vue'),
        meta: {
            title: '基础培训'
        }
    },
    {
        path: '/details',
        name: 'details',
        component: () =>
            import(/* webpackChunkName: "details" */ '../views/Details.vue'),
        meta: {
            title: '基础培训'
        }
    },
    {
        path: '/completeStudy',
        name: 'completeStudy',
        component: () =>
            import(
                /* webpackChunkName: "completeStudy" */ '../views/CompleteStudy.vue'
            ),
        meta: {
            title: '基础培训'
        }
    },
    {
        path: '/train',
        name: 'train',
        component: () =>
            import(/* webpackChunkName: "train" */ '../views/Train.vue')
    },
    {
        path: '/analyze',
        name: 'analyze',
        component: () =>
            import(/* webpackChunkName: "analyze" */ '../views/Analyze.vue'),
        meta: {
            title: '题目解析'
        }
    },
    {
        path: '/errorCollection',
        name: 'errorCollection',
        component: () =>
            import(
                /* webpackChunkName: "errorCollection" */ '../views/ErrorCollection.vue'
            ),
        meta: {
            title: '错题集锦'
        }
    },
    {
        path: '/rank',
        name: 'rank',
        component: () =>
            import(/* webpackChunkName: "rank" */ '../views/Rank.vue'),
        meta: {
            title: '排行榜'
        }
    },
    {
        path: '/errorTrain',
        name: 'errorTrain',
        component: () =>
            import(
                /* webpackChunkName: "errorTrain" */ '../views/ErrorTrain.vue'
            ),
        meta: {
            title: '错题月考'
        }
    },
    {
        path: '/medical',
        name: 'medical',
        component: () =>
            import(/* webpackChunkName: "medical" */ '../views/Medical.vue'),
        meta: {
            title: '医讯速递'
        }
    },
    {
        path: '*',
        redirect: '/'
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
