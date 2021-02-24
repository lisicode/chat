<template>
  <div class="m1">
    <van-cell v-for="(i, index) in list" :key="index" :title="i.id" :label="i.msg" />
<!--    <van-empty description="暂无消息" />-->
  </div>
</template>

<script>
import {ApiConfig, GetLocalStorage, Request} from "@/assets/js/config";

export default {
  name: 'm1',
  data() {
    return {
      list: []

    };
  },
  created() {
    Request({
      method: 'post',
      data: {
        api: ApiConfig.messageRecords,
        account: GetLocalStorage('userData').account
      }
    }).then(res => {
      const result = Array.from(res.messageRecordsList.reduce((m, t) => m.set(t.id, t), new Map()).values());
      console.log(result)

      this.list = result;
    })
  },
  methods: {

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
