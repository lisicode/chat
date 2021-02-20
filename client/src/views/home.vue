<template>
  <div class="home">
    <header>
      <van-cell title="微聊" :border="false" center>
        <template #right-icon>
          <router-link to="/m3">
            <van-icon name="add-o" />
          </router-link>
        </template>
      </van-cell>
    </header>
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
import {GetLocalStorage} from "@/assets/js/config";

export default {
  name: 'home',
  data() {
    return {
      active: 0,
    };
  },
  created() {
    this.InitWebSocket();
  },
  methods: {
    InitWebSocket() {
      this.websock = new WebSocket('ws://localhost:8081');
      this.websock.onmessage = this.OnMessage;
      this.websock.onopen = this.OnOpen;
      this.websock.onerror = this.OnError;
      this.websock.onclose = this.OnClose;
    },
    OnOpen() {
      let data = {
        type: 'login',
        id: GetLocalStorage('userData').account
      };
      this.websock.send(JSON.stringify(data));
    },
    OnError() {
      this.InitWebSocket();
    },
    OnClose(e) {
      console.log('断开连接', e);
    },
    OnMessage(e) {
      console.log(e)
    },
  }
}
</script>

<style scoped lang="scss">
.home {

}
</style>
