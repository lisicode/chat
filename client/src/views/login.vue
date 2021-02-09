<template>
  <div class="login">
    <van-form @submit="onSubmit">
      <van-field
          v-model="signInData.account"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请输入手机号' }]"
      />
      <van-field
          v-model="signInData.password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请输入密码' }]"
      />
      <div style="margin: 16px;">
        <van-button block type="info" native-type="submit">提交</van-button>
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
      console.log(this.signInData);
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
          console.log(res.msg)
        }
      })
    },
  }
}
</script>
