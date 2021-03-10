<template>
  <div class="circles">
    <van-nav-bar
        left-arrow
        title="朋友圈"
        @click-left="toBack"
    >
      <template #right>
        <van-icon name="edit" size="18" @click="toEdit" />
      </template>
    </van-nav-bar>
    <section>
      <div class="s-1">今日心情今日心情今日心情今日心情今日心情今日心情今日心情今日心情</div>
      <div class="s-2">
        <van-image
            width="10rem"
            fit="cover"
            src="https://img01.yzcdn.cn/vant/cat.jpeg"
        />
      </div>
      <div class="s-3">
        <small>10:20</small>
        <van-icon name="other-pay"/>
      </div>
      <div class="s-4">评论内容</div>
    </section>
  </div>
</template>

<script>
import {ApiConfig, Request, GetLocalStorage} from "@/assets/js/config";

export default {
  name: 'circles',
  data() {
    return {};
  },
  created() {
    Request({
      method: 'post',
      data: {
        api: ApiConfig.getCircles,
        account: GetLocalStorage('userData').account,
      }
    }).then(res => {
      console.log(res)
    })

  },
  methods: {
    toBack() {
      this.$router.push('/m3');
    },
    toEdit() {
      this.$router.push('/edit');
    }
  }
}
</script>

<style scoped lang="scss">
.circles {
  padding-bottom: 60px;
  section {
    box-sizing: border-box;
    padding: 10px;
    margin-top: 10px;
    border-bottom: 1px solid #fafafa;
    .s-1 {
      line-height: 20px;
      font-size: 13px;
      color: #455a64;
    }
    .s-2 {
      margin-top: 10px;
    }
    .s-3 {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      small {
        font-size: 12px;
        color: rgba(69, 90, 100, 0.6);
      }
    }
    .s-4 {
      box-sizing: border-box;
      padding: 5px;
      margin-top: 10px;
      line-height: 20px;
      font-size: 13px;
      color: #455a64;
      background-color: #fafafa;
      border-radius: 5px;
    }
  }
}
</style>
