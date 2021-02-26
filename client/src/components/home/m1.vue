<template>
  <div class="m1">
    <van-cell v-for="(i, index) in list" :key="index" :title="i.id" :label="i.message" />
<!--    <van-empty v-if="list.length === 0" description="暂无消息" />-->
  </div>
</template>

<script>
import {ApiConfig, GetLocalStorage, Request} from "@/assets/js/config";

export default {
  name: 'm1',
  data() {
    return {
      list: [],
    };
  },
  created() {

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
