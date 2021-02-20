<template>
  <div class="chat">
    <div class="c-1">
      <van-nav-bar
              :title="this.$route.query.account"
              left-arrow
              @click-left="back"
      />
    </div>
    <div class="c-2" id="chatContainer" :style="{ height: this.windowHeight - 99 + 'px' }">
      <div v-for="i in mq" :class="i.class">
        <div>
          {{ i.msg }}
        </div>
      </div>
    </div>
    <div class="c-3">
      <van-form @submit="OnSend">
        <van-field
                v-model="msg"
                center
                clearable
                placeholder="请输入消息"
                :rules="[{ required: true }]"
        >
          <template #button>
            <van-button size="small" type="primary" native-type="submit">发送</van-button>
          </template>
        </van-field>
      </van-form>
    </div>
  </div>
</template>

<script>
  import {ApiConfig, Request, GetLocalStorage} from "@/assets/js/config";
  export default {
    name: 'chat',
    data() {
      return {
        msg: '',
        mq: [],
        windowHeight: document.documentElement.clientHeight
      };
    },
    watch: {
      mq(val) {
        console.log(val)

        this.$nextTick(() => {
          let list = this.$el.querySelector("#chatContainer");
          list.scrollTop = list.scrollHeight
        })
      }
    },
    created() {
      this.InitWebSocket();
    },
    destroyed() {
      this.websock.close()
    },
    methods: {
      InitWebSocket() {
        this.websock = new WebSocket('ws://localhost:8081/');
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
        let data = JSON.parse(e.data);
        this.mq.push(data);
      },
      OnSend() {
        let data = {
          type: 'send',
          id: GetLocalStorage('userData').account,
          toId: this.$route.query.account,
          msg: this.msg
        };
        this.mq.push(data);
        this.websock.send(JSON.stringify(data));
      },
      back() {
        this.$router.push('/m2')
      },
    }
  }
</script>

<style scoped lang="scss">
  .chat {
    .c-1 {

    }
    .c-2 {
      box-sizing: border-box;
      padding: 0 20px 0 20px;
      overflow-y: scroll;
      .a {
        box-sizing: border-box;
        padding: 5px;
        overflow: hidden;
        div {
          box-sizing: border-box;
          padding: 5px;
          border-radius: 4px;
          float: right;
          background-color: #07c160;
        }
      }
      .b {
        box-sizing: border-box;
        padding: 5px;
        overflow: hidden;
        div {
          box-sizing: border-box;
          padding: 5px;
          border-radius: 4px;
          float: left;
          background-color: #f7f7f7;
        }
      }
    }
    .c-3 {

    }
  }
</style>
