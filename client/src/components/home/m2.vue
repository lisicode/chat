<template>
  <div class="m2">
    <header>
      <van-cell title="微聊" :border="false" center>
        <template #right-icon>
          <van-icon name="add-o" @click="to" />
        </template>
      </van-cell>
    </header>
    <van-cell v-for="i in list" @click="toChat(i)">
      <div class="item">
        <img src="../../assets/logo.png"/>
        <span class="custom-title">{{ i }}</span>
      </div>
    </van-cell>
  </div>
</template>

<script>
  import {ApiConfig, Request, GetLocalStorage} from "@/assets/js/config";

  export default {
    name: 'm2',
    data() {
      return {
        list: []

      };
    },
    created() {
      Request({
        method: 'post',
        data: {
          api: ApiConfig.getFriends,
          account: GetLocalStorage('userData').account
        }
      }).then(res => {
        this.list = JSON.parse(res.friendsList);
      })
    },
    methods: {
      to() {
        this.$router.push('/m3')
      },
      toChat(e) {
        this.$router.push({
          path: '/chat',
          query: {
            account: e
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .m2 {
    header {
      .van-cell {
        background-color: #fff;
      }
    }
    .van-cell {
      background-color: #f7f7f7;

      .item {
        display: flex;
        justify-content: left;
        align-items: center;

        img {
          width: 30px;
        }

        span {
          margin-left: 10px;
          font-size: 12px;
        }
      }
    }
  }
</style>
