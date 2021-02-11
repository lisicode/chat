<template>
  <div class="chat">
    <div class="c-1"></div>
    <footer>
      <van-field
              v-model="msg"
              center
              clearable
              placeholder="请输入消息"
      >
        <template #button>
          <van-button size="small" type="primary" @click="send">发送</van-button>
        </template>
      </van-field>
    </footer>
  </div>
</template>

<script>
import {ApiConfig, Request, GetLocalStorage} from "@/assets/js/config";
export default {
  name: 'chat',
  data() {
    return {
      msg: ''
    };
  },
  created() {
    this.InitWebSocket();
  },
  destroyed() {
    this.websock.close()
  },
  methods: {
    InitWebSocket() {
      this.websock = new WebSocket('ws://127.0.0.1:8081/');
      this.websock.onmessage = this.OnMessage;
      this.websock.onopen = this.OnOpen;
      this.websock.onerror = this.OnError;
      this.websock.onclose = this.Onclose;
    },
    OnOpen() {
      let data = {
        type: 'login',
        id: GetLocalStorage('userData').account
      };
      this.OnSend(data);
    },
    OnMessage(e) {
      console.log(e)
    },
    OnSend(e) {
      this.websock.send(JSON.stringify(e));
    },
    OnError() {
      this.InitWebSocket();
    },
    Onclose(e) {
      console.log('断开连接', e);
      this.OnOpen();
    },
    send() {
      let data = {
        type: 'send',
        toId: this.$route.query.account,
        msg: this.msg
      };
      this.OnSend(data);
    },
  }
}
</script>

<style scoped lang="scss">
  .c-1 {
    width: 100%;
    height: 500px;
  }
 footer {
   width: 100%;
 }
</style>
