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
    <div class="c-1" v-if="friendsCircles.length">
      <section v-for="i in friendsCircles">
        <div class="s-1">
          <div class="s-1-1">
            <van-image width="2rem" height="2rem" fit="cover" :src="i.photo" />
          </div>
          <div class="s-1-2">
            <span>{{ i.nickname === null ? i.account : i.nickname }}</span>
            <p>{{ i.text }}</p>
          </div>
        </div>
        <van-row class="s-2" gutter="5">
          <van-col span="12" v-for="s in i.picture">
            <img :src="s" style="width: 100%;">
          </van-col>
        </van-row>
        <div class="s-3">
          <small>{{ i.date }}</small>
          <van-icon name="other-pay"/>
        </div>
        <div class="s-4">评论内容</div>
      </section>
    </div>
    <van-empty v-else description="暂无内容" />
  </div>
</template>

<script>
import {ApiConfig, Request, GetLocalStorage} from "@/assets/js/config";

export default {
  name: 'circles',
  data() {
    return {
      friendsCircles: []
    };
  },
  created() {
    Request({
      method: 'post',
      data: {
        api: ApiConfig.getCircles,
        account: GetLocalStorage('userData').account,
      }
    }).then(res => {
      if (res.status === '0000') {
        this.friendsCircles = res.friendsCircles;
      } else if (res.status === '0001') {

      }
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
  .c-1 {
    section {
      box-sizing: border-box;
      padding: 10px;
      margin-top: 10px;
      border-bottom: 1px solid #fafafa;
      .s-1 {
        display: flex;
        justify-content: left;
        align-items: center;
        .s-1-1 {
          width: 40px;
        }
        .s-1-2 {
          margin-left: 5px;
          span {
            font-size: 14px;
            color: #455a64;
          }
          p {
            margin: 0;
            font-size: 14px;
            color: #000;
          }
        }
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
}
</style>
