<template>
    <div id="app">
        <v-loading :active.sync="isLoading" background-color="#f5f5f5" :opacity="opacity"></v-loading>
        <router-view />
    </div>
</template>
<script>
export default {
    data() {
        return {
            isLoading: true,
            opacity: 1,
            timer: null
        }
    },
    created() {
        this.$router.push('/')
    },
    mounted() {
        this.$axios.post(this.$baseUrl.userInfo, {}).then(res => {
            if (res.status == 200) {
                this.userInfo = res.data
                this.isLoading = false
                window.sessionStorage.setItem('user', JSON.stringify(res.data))
            } else {
                alert('无权限访问')
                setTimeout(() => {
                    WeixinJSBridge.call('closeWindow')
                }, 100)
            }
        })
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
