<template>
  <div id="app">
    <router-view/>
    <!-- 子应用挂载节点 -->
    <WujieVue width="100%" height="100%" name="bigscreen" :url="url" />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      url: 'http://localhost:5173/big-screen'  
    }
  },
  computed: {
    showMicroApp() {
      return this.$route.path === '/big-screen'
    }
  }
}
</script>