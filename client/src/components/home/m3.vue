<template>
  <div class="m3">
    <van-cell title="朋友圈" icon="like-o" to="/circles" is-link />
  </div>
</template>

<script>
import {ApiConfig, Request, GetLocalStorage} from "@/assets/js/config";

export default {
  name: 'm3',
  data() {
    return {};
  },
  created() {

  },
  methods: {}
}
</script>

<style scoped lang="scss">
.m3 {
  .van-cell {
    background-color: #f7f7f7;
  }
}
</style>
