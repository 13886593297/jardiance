<template>
    <div id="app">
        <v-loading :active.sync="loading" background-color="#f5f5f5" :opacity="opacity"></v-loading>
        <router-view />
    </div>
</template>
<script>
import store from './store'
import { mapState } from 'vuex'
export default {
    store,
    computed: {
        ...mapState(['loading', 'opacity'])
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
