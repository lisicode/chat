<template>
  <div class="m1">
    <van-card
            v-if="list.length"
            v-for="(i, index) in list"
            :key="index"
            :centered="true"
            thumb="https://img01.yzcdn.cn/vant/ipad.jpeg"
            @click="toChat(i.toId === id ? i.id : i.toId)"
    >
      <template #title>
        <p>{{ i.toId === id ? i.id : i.toId }}</p>
      </template>
      <template #desc>
        <span>{{ i.msg }}</span>
      </template>
    </van-card>

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
.van-card {
  p {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 16px;
  }
  span {
    width: 100%;
    display: inline-block;
    font-size: 12px;
    color: #969799;
    overflow: hidden;
  }
}

}
</style>
