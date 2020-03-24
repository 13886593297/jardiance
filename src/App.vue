<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script>
export default {
    created() {
        let hash = window.location.hash
        if (hash != '#/') {
            window.sessionStorage.setItem('hash', hash)
        }
        // userCode 2 正常 1 没有这个用户
        this.$axios.get(this.$baseUrl.userInfo).then(res => {
            if (typeof res.data == 'string') {
                window.location.href = res.data
            } else if (res.data.userCode == 2) {
                document.querySelector('#app').style.display = 'block'
                window.sessionStorage.setItem('user', JSON.stringify(res.data.reUserInfo))
                hash = window.sessionStorage.getItem('hash')
                if (hash) {
                    window.location = window.location.origin + window.location.pathname + hash
                    window.sessionStorage.removeItem('hash')
                }
            } else {
                alert('请联系管理员')
                setTimeout(() => {
                    WeixinJSBridge.call('closeWindow')
                }, 100)
            }
        })
    },
    mounted() {
        // this.$share()
    }
}
</script>
<style lang="scss">
#app {
    background-color: #fff;
    height: 100vh;
    display: none;
    box-sizing: border-box;
}
</style>
