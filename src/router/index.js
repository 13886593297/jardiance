import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import TrainIndex from '../views/TrainIndex.vue'
import Section from '../views/Section.vue'
import Details from '../views/Details.vue'
import CompleteStudy from '../views/CompleteStudy.vue'
import Train from '../views/Train.vue'
import Analyze from '../views/Analyze.vue'
import ErrorCollection from '../views/ErrorCollection.vue'
import Rank from '../views/Rank.vue'
import ErrorTrain from '../views/ErrorTrain.vue'
import Medical from '../views/Medical.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', name: 'index', component: Index },
    { path: '/trainIndex', name: 'trainIndex', component: TrainIndex, meta: { title: '基础训练' } },
    { path: '/section', name: 'section', component: Section, meta: { title: '基础训练' } },
    { path: '/details', name: 'details', component: Details },
    { path: '/completeStudy', name: 'completeStudy', component: CompleteStudy },
    { path: '/train', name: 'train', component: Train, meta: { title: '基础训练' } },
    { path: '/analyze', name: 'analyze', component: Analyze, meta: { title: '题目解析' } },
    { path: '/errorCollection', name: 'errorCollection', component: ErrorCollection, meta: { title: '错题集锦' } },
    { path: '/rank', name: 'rank', component: Rank, meta: { title: '排行榜' } },
    { path: '/errorTrain', name: 'errorTrain', component: ErrorTrain, meta: { title: '错题月考' } },
    { path: '/medical', name: 'medical', component: Medical, meta: { title: '医讯速递' } },
    { path: '*', redirect: '/'}
]

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes
})

export default router
