<template>
  <div class="chat">
    chat
  </div>
</template>

<script>
export default {
  name: 'chat',
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
    }
  }
}
</script>
