<template>
  <div class="m1">
    <div v-if="list.length">
      <van-cell v-for="(i, index) in list" :key="index" @click="toChat(i)">
        <div class="item">
          <small>{{ sortingDate(i.msgData.date) }}</small>
          <van-badge :content="i.num" />
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
  import {ApiConfig, GetLocalStorage, Request} from "@/assets/js/config";

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
           _this.list = res.list
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
      sortingDate(date) {
        date = new Date(Date.parse(date.replace(/-/g, "/")));
        // 是否是今天
        if (date.toString().slice(0, 10) === new Date().toString().slice(0, 10)) {
          return date.getHours() + ':' + date.getMinutes();
        } else {
          return date.getMonth() + 1 + '月' + date.getDate() + '日' + date.getHours() + ':' + date.getMinutes();
        }
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
