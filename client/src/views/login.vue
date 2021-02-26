<template>
  <div class="login">
    <van-form @submit="onSubmit">
      <van-field
          v-model="signInData.account"
          name="手机号码"
          label="手机号码"
          placeholder="手机号码"
          :rules="[{ required: true }]"
      />
      <van-field
          v-model="signInData.password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true }]"
      />
      <div style="margin: 16px;">
        <van-button block type="info" native-type="submit">登录</van-button>
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
          SetLocalStorage(res.userData, 'userData');
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

</style>
