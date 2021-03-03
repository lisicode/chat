<template>
  <div class="m1">
    <div v-if="list.length">
      <van-cell v-for="(i, index) in list" :key="index" @click="toChat(i)">
        <div class="item">
          <van-image
              width="3rem"
              height="3rem"
              fit="cover"
              :src="i.photo"
          />
          <section>
            <p>{{ i.nickname === null ? i.toId === id ? i.id : i.toId : i.nickname }}</p>
            <span>{{ i.msg }}</span>
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
      e.account = e.toId === this.id ? e.id : e.toId;
      this.$router.push({
        path: '/chat',
        query: e
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
      align-items: center;
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
    }
  }
}
</style>
