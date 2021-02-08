<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" @click="initWebSocket">
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      websock: null,
    };
  },
  created() {

  },
  destroyed() {
    this.websock.close()
  },
  methods: {
    initWebSocket() {
      this.websock = new WebSocket('ws://127.0.0.1:8080');
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      let actions = {"test": "12345"};
      this.websocketsend(JSON.stringify(actions));
    },
    websocketonerror() {
      this.initWebSocket();
    },
    websocketonmessage(e) {
      console.log(e.data)
    },
    websocketsend(Data) {
      this.websock.send(Data);
    },
    websocketclose(e) {
      console.log('断开连接', e);
    },
  }
}
</script>
