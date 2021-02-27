<template>
  <div class="m1">
    <van-cell v-if="list.length" v-for="(i, index) in list" :key="index" :title="i.toId === id ? i.id : i.toId" :label="i.msg" @click="toChat(i.toId === id ? i.id : i.toId)" />
    <van-empty v-else description="暂无消息" />
  </div>
</template>

<script>
import {ApiConfig, GetLocalStorage, Request} from "@/assets/js/config";

export default {
  name: 'm1',
  data() {
    return {
      id: GetLocalStorage('userData').account,
      list: [],
    };
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
.m1 {
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
