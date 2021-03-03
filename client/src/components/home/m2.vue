<template>
  <div class="m2">
    <div v-if="list.length">
      <van-cell v-for="(i, index) in list" :key="index" @click="toChat(i)">
        <div class="item">
          <van-image
              width="3rem"
              height="3rem"
              fit="cover"
              :src="i.photo"
          />
          <span class="custom-title">{{ i.nickname === null ? i.account : i.nickname }}</span>
        </div>
      </van-cell>
    </div>
    <van-empty v-else description="暂无好友" />
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
        this.list = res.friendsList;
      })
    },
    methods: {
      toChat(e) {
        this.$router.push({
          path: '/chat',
          query: e
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .m2 {
    .van-cell {
      background-color: #f7f7f7;
      .item {
        display: flex;
        justify-content: left;
        align-items: center;
        .van-image {
          border-radius: 5px;
          overflow: hidden;
        }
        span {
          margin-left: 10px;
          font-size: 14px;
          color: #455a64;
        }
      }
    }
  }
</style>
