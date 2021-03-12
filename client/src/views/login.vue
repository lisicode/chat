<template>
  <div class="login">
    <van-form @submit="onSubmit">
      <van-field
          :border="false"
          v-model="signInData.account"
          name="手机号码"
          placeholder="请输入手机号码"
          :rules="[{ required: true }]"
      />
      <van-field
          :border="false"
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
.van-cell {
  width: 90%;
  margin: 20px auto;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

</style>
