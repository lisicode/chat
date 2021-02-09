<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" @click="send">
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      id: '1',
      toId: '1',
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
        id: this.id
      }
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
    },


    send() {
      let data = {
        type: 'send',
        id: this.id,
        toId: this.toId
      }
      this.OnSend(data);
    }
  }
}
</script>
