<template>
  <div class="m1">
    <div v-if="list.length">
      <van-cell v-for="(i, index) in list" :key="index" @click="toChat(i)">
        <div class="item">
          <small>{{ formatTime(i.msgData.date) }}</small>
          <van-badge :content="i.toId === id ? i.unread : null" />
          <van-image
                  width="3rem"
                  height="3rem"
                  fit="cover"
                  :src="i.photo"
                  loading-icon="user-circle-o"
          />
          <section>
            <p>{{ i.nickname === null ? i.toId === id ? i.id : i.toId : i.nickname }}</p>
            <span>{{ i.msgData.type === 'picture' ? '[图片]' : i.msgData.data }}</span>
          </section>
        </div>
      </van-cell>
    </div>
    <van-empty v-else description="暂无消息" />
  </div>
</template>

<script>
  import {ApiConfig, GetLocalStorage, Request, FormatTime} from "@/assets/js/config";

  export default {
    name: 'm1',
    props: ['parent'],
    data() {
      return {
        id: GetLocalStorage('userData').account,
        list: [],
      };
    },
    watch: {
      'parent.unreadMessag'(e) {
        let _this = this;
        Request({
          method: 'post',
          data: {
            api: ApiConfig.getMessageList,
            account: GetLocalStorage('userData').account
          }
        }).then(res => {
          _this.list = res.list;
          // 总未读消息数汇总
          let arr = [];
          let num = 0;
          for (let i in this.list) {
            if (this.list[i].unread) {
              arr.push(this.list[i].unread)
            }
          }
          arr.forEach(item => {
            num = num + item
          });
          this.$emit('changeUnreadNum', num)
        })
      }
    },
    created() {
      Request({
        method: 'post',
        data: {
          api: ApiConfig.getMessageList,
          account: GetLocalStorage('userData').account
        }
      }).then(res => {
        this.list = res.list;
        // 总未读消息数汇总
        let arr = [];
        let num = 0;
        for (let i in this.list) {
          if (this.list[i].toId === this.id) {
            if (this.list[i].unread) {
              arr.push(this.list[i].unread)
            }
          }
        }
        arr.forEach(item => {
          num = num + item
        });
        this.$emit('changeUnreadNum', num)
      })
    },
    methods: {
      toChat(e) {
        e.account = e.toId === this.id ? e.id : e.toId;
        this.$router.push({
          path: '/chat',
          query: e
        })
      },
      formatTime(e) {
        return FormatTime(e);
      },
    }
  }
</script>

<style scoped lang="scss">
  .m1 {
    .van-cell {
      background-color: #f7f7f7;
      .item {
        display: flex;
        justify-content: left;
        align-items: center;
        .van-badge {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
        }
        section {
          width: 100%;
          margin-left: 10px;
          p {
            margin: 0;
            line-height: 30px;
            font-size: 14px;
            color: #455a64;
          }
          span {
            display: inline-block;
            width: 100%;
            color: rgba(69, 90, 100, 0.6);
            font-size: 12px;
          }
        }
        small {
          position: absolute;
          right: 0;
          top: 0;
          color: #455a64;
          font-size: 12px;
        }
      }
    }
  }
</style>
