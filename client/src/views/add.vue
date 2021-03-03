<template>
  <div class="add">
    <van-nav-bar
            title="添加好友"
            left-arrow
            @click-left="back"
    />
    <van-form @submit="query">
      <van-field
              v-model="queryData"
              center
              clearable
              placeholder="请输入手机号码"
              :rules="[{ required: true }]"
      >
        <template #button>
          <van-button size="small" type="info" native-type="submit">查询</van-button>
        </template>
      </van-field>
    </van-form>
    <van-cell center v-if="friendsData">
      <div class="item">
        <van-image
            width="2rem"
            height="2rem"
            fit="cover"
            :src="friendsData.photo"
            loading-icon="user-circle-o"
        />
        <span class="custom-title">{{ friendsData.nickname }}</span>
      </div>
      <template #right-icon>
        <van-button size="small" type="info" @click="add">添加</van-button>
      </template>
    </van-cell>
    <van-empty description="暂无好友信息" v-else />
  </div>
</template>

<script>
import {ApiConfig, Request, GetLocalStorage} from "@/assets/js/config";
export default {
  name: 'add',
  data() {
    return {
      queryData: '',
      friendsData: null,
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    query() {
      Request({
        method: 'post',
        data: {
          api: ApiConfig.queryFriends,
          queryData: this.queryData
        }
      }).then(res => {
        if (res.status === '0000') {
          this.friendsData = res;
        } else if (res.status === '0001') {
          this.friendsData = null;
        }
      })
    },
    add() {
      if (this.friendsData === GetLocalStorage('userData').account) {
        this.$notify({ type: 'danger', message: '您不能添加自己为好友' });
      } else {
        Request({
          method: 'post',
          data: {
            api: ApiConfig.addFriends,
            account: GetLocalStorage('userData').account,
            friendsData: this.friendsData.account
          }
        }).then(res => {
          if (res.status === '0000') {
            this.$notify({ type: 'success', message: res.msg });
            this.$router.push('/m2')
          } else if (res.status === '0001') {
            this.$notify({ type: 'danger', message: res.msg });
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.add {
  .van-cell {
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
