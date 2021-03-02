<template>
  <div class="chat">
    <div class="c-1">
      <van-nav-bar
              :title="this.$route.query.account"
              left-arrow
              @click-left="back"
      />
    </div>
    <div class="c-2" id="chatContainer" :style="{ height: this.windowHeight - 100 + 'px' }">
      <div v-for="i in mq" :class="i.id === id ? 'a' : 'b' ">
        <van-image
            width="2rem"
            height="2rem"
            fit="cover"
            :src="i.id === id ? aPhoto : bPhoto"
        />
        <div class="msg">
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
            <van-uploader :after-read="afterRead">
              <van-button size="small" icon="photo-o" type="default" plain />
            </van-uploader>
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
        roomId: '',
        id: GetLocalStorage('userData').account,
        windowHeight: document.documentElement.clientHeight,
        aPhoto: GetLocalStorage('userData').photo,
        bPhoto: this.$route.query.photo
      };
    },
    watch: {
      mq() {
        // 存储聊天记录
        Request({
          method: 'post',
          data: {
            api: ApiConfig.storedMessageRecord,
            roomId: this.roomId,
            mq: this.mq
          }
        }).then(res => {
        });

        // 动态调整聊天框体
        this.$nextTick(() => {
          let list = this.$el.querySelector("#chatContainer");
          list.scrollTop = list.scrollHeight
        })
      }
    },
    created() {
      // 初始化websocket
      this.InitWebSocket();

      // 查询或创建信息池id
      Request({
        method: 'post',
        data: {
          api: ApiConfig.queryRoomId,
          id: GetLocalStorage('userData').account,
          toId: this.$route.query.account
        }
      }).then(res => {
        // 获取信息池id
        this.roomId = res.roomId;
        // 加载信息池
        Request({
          method: 'post',
          data: {
            api: ApiConfig.getMessageRecord,
            roomId: res.roomId
          }
        }).then(res => {
          this.mq = JSON.parse(res.mq)
        })

      })
    },
    destroyed() {
      // 退出的断开websocket
      this.websock.close()
    },
    methods: {
      back() {
        this.$router.go(-1);
      },
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
          id: this.id
        };
        this.websock.send(JSON.stringify(data));
      },
      OnError() {
        this.InitWebSocket();
      },
      OnMessage(e) {
        let data = JSON.parse(e.data);
        if (this.$route.query.account != data.toId) {
          if (this.$route.query.account === data.id) {
            this.mq.push(data);
          } else {
            this.$notify({ type: 'success', message: '您有一条新消息'});
          }
        }
      },
      OnSend() {
        let data = {
          type: 'send',
          id: this.id,
          toId: this.$route.query.account,
          msg: this.msg
        };
        this.mq.push(data);
        this.websock.send(JSON.stringify(data));
        this.msg = '';
      },

      afterRead(file) {
        console.log(file);
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
        .van-image {
          float: right;
          margin-left: 5px;
          border-radius: 5px;
          overflow: hidden;
        }
        .msg {
          max-width: 200px;
          float: right;
          box-sizing: border-box;
          padding: 5px;
          border-radius: 4px;
          background-color: #07c160;
        }
      }
      .b {
        box-sizing: border-box;
        padding: 5px;
        overflow: hidden;
        .van-image {
          float: left;
          margin-right: 5px;
          border-radius: 5px;
          overflow: hidden;
        }
        .msg {
          max-width: 200px;
          float: left;
          box-sizing: border-box;
          padding: 5px;
          border-radius: 4px;
          background-color: #f7f7f7;
        }
      }
    }
    .c-3 {
      box-sizing: border-box;
      border-top: 1px solid #ebedf0;
    }
  }
</style>
