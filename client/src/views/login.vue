<template>
  <div class="login">
    <van-row type="flex" justify="center">
      <van-col span="24">
        <h1>微聊</h1>
        <small>欢迎登录冯小可爱专属聊天系统</small>
      </van-col>
      <van-col span="24">
        <van-form @submit="onSubmit">
        <van-field
                v-model="signInData.account"
                name="手机号码"
                placeholder="请输入手机号码"
                :rules="[{ required: true }]"
        />
        <van-field
                v-model="signInData.password"
                type="password"
                name="密码"
                placeholder="请输入密码"
                :rules="[{ required: true }]"
        />
        <div style="margin: 16px;">
          <van-button block type="info" native-type="submit">登录/注册</van-button>
        </div>
      </van-form>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import {Request, ApiConfig, SetLocalStorage} from '@/assets/js/config'
export default {
  name: 'login',
  data() {
    return {
      signInData: {
        account: '',
        password: '',
      }
    };
  },
  created() {

  },
  methods: {
    onSubmit() {
      Request({
        method: 'post',
        data: {
          api: ApiConfig.signIn,
          signInData: this.signInData
        }
      }).then(res => {
        if (res.status === '0000') {
          SetLocalStorage(res.data, 'userData');
          this.$router.push('/home')
        } else {
          this.$notify({ type: 'danger', message: res.msg });
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
.login {
  .van-row {
    margin-top: 100px;
    .van-col {
      h1 {
        margin-left: 16px;
        font-size: 20px;
        color: #455a64;
        letter-spacing: 2px;
        font-weight: 500;
      }
      small {
        margin-left: 16px;
        font-size: 12px;
        color: #999;
        letter-spacing: 2px;
      }
      .van-form {
        margin-top: 50px;
      }
      .van-cell {
        margin: 20px auto;
        border-radius: 2px;
      }
      .van-button {
        margin-top: 50px;
      }
    }
  }
}

</style>
