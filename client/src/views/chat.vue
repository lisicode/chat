<template>
  <div class="chat">
    <div class="c-1">
      <van-nav-bar
              :title="this.$route.query.nickname === null ? this.$route.query.account : this.$route.query.nickname"
              left-arrow
              @click-left="back"
      />
    </div>
    <div class="c-2" id="chatContainer" :style="{ height: this.windowHeight - 100 + 'px' }">
      <div v-for="i in mq" :class="i.id === id ? 'a' : 'b' ">
        <div class="date">{{ sortingDate(i.msgData.date) }}</div>
        <van-image
            width="2rem"
            height="2rem"
            fit="cover"
            :src="i.id === id ? aPhoto : bPhoto"
            loading-icon="user-circle-o"
        />
        <div class="msg">
          <span v-if="i.msgData.type === 'text'">
            {{ i.msgData.data }}
          </span>
          <van-image
              v-if="i.msgData.type === 'picture'"
              width="5rem"
              fit="cover"
              :src="i.msgData.data"
          />
        </div>
      </div>
    </div>
    <div class="c-3">
      <van-form @submit="OnSend">
        <van-field
                v-model="msg"
                center
                clearable
                placeholder="按 Enter 键发送"
                :rules="[{ required: true }]"
        >
          <template #button>
            <van-uploader :after-read="OnSendPicture">
              <div class="photo">
                <van-icon name="photo-o" size="20px" />
              </div>
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
        unread: 0,
        roomId: '',
        id: GetLocalStorage('userData').account,
        aPhoto: GetLocalStorage('userData').photo,
        bPhoto: this.$route.query.photo,
        windowHeight: document.documentElement.clientHeight,
      };
    },
    watch: {
      mq() {
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
          this.mq = JSON.parse(res.mq);
          for (let i in this.mq) {
            if (this.mq[i].toId === this.id) {
              // 重置未读消息数据
              let data = {
                type: 'unread',
                toId: this.$route.query.account,
                roomId: this.roomId,
                mq: this.mq
              };
              this.websock.send(JSON.stringify(data));
              return;
            }
          }
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
      getDate() {
        let yy = new Date().getFullYear();
        let mm = new Date().getMonth() + 1;
        let dd = new Date().getDate();
        let hh = new Date().getHours();
        let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
        return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf;
      },
      sortingDate(date) {
        date = new Date(Date.parse(date.replace(/-/g, "/")));
        // 是否是今天
        if (date.toString().slice(0, 10) === new Date().toString().slice(0, 10)) {
            return date.getHours() + ':' + date.getMinutes();
        } else {
          return date.getMonth() + 1 + '月' + date.getDate() + '日' + date.getHours() + ':' + date.getMinutes();
        }
      },
      InitWebSocket() {
        this.websock = new WebSocket('ws://localhost:8082/');
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
        switch (data.type) {
          case 'send':
            if (this.$route.query.account != data.toId) {
              if (this.$route.query.account === data.id) {
                this.mq.push(data);
              } else {
                this.$notify({ type: 'success', message: '您有一条新消息'});
              }
            }
            break;
          case "unread":
            // 重置未读消息数
            this.unread = 0;
            break;
        }
      },
      OnSend() {
        let data = {
          type: 'send',
          id: this.id,
          roomId: this.roomId,
          toId: this.$route.query.account,
          unread: ++this.unread,
          msgData: {
            type: 'text',
            date: this.getDate(),
            data: this.msg
          }
        };
        this.mq.push(data);
        this.websock.send(JSON.stringify(data));
        this.msg = '';
      },
      OnSendPicture(file) {
        let data = {
          type: 'send',
          id: this.id,
          roomId: this.roomId,
          toId: this.$route.query.account,
          unread: ++this.unread,
          msgData:  {
            type: 'picture',
            date: this.getDate(),
            data: file.content
          }
        };
        this.mq.push(data);
        this.websock.send(JSON.stringify(data));
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
      .date {
        text-align: center;
        color: #455a64;
        font-size: 12px;
        line-height: 20px;
      }
      .a {
        box-sizing: border-box;
        padding: 5px;
        overflow: hidden;
        .van-image {
          float: right;
          border-radius: 5px;
          overflow: hidden;
        }
        .msg {
          margin-right: 5px;
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
          border-radius: 5px;
          overflow: hidden;
        }
        .msg {
          margin-left: 5px;
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
      .photo {
        display: flex;
        align-items: center;
        height: 29px;
      }
    }
  }
</style>
