<template>
  <div class="home">
    <router-view></router-view>
    <van-tabbar v-model="active" route>
      <van-tabbar-item icon="chat-o" to="/home">聊天</van-tabbar-item>
      <van-tabbar-item icon="friends-o" to="/m2">好友</van-tabbar-item>
      <van-tabbar-item icon="like-o">朋友圈</van-tabbar-item>
      <van-tabbar-item icon="setting-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      active: 0,
    };
  },
  created() {

  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.home {

}
</style>
