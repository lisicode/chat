<template>
  <div class="m4">
    <div class="s-1">
      <section>
        <img :src="photo === null ? 'https://img01.yzcdn.cn/vant/ipad.jpeg' : photo">
        <p>{{ nickname }}</p>
      </section>
      <van-uploader :after-read="changePhoto">
        <van-icon name="arrow" />
      </van-uploader>
    </div>
    <van-cell title="昵称" is-link value="修改" @click="nicknamePopup = true" />
    <van-cell title="退出登录" is-link />
    <van-popup v-model="nicknamePopup" position="top">
      <van-form @submit="changeNickname">
        <van-field
                v-model="changeNicknameData"
                center
                clearable
                :rules="[{ required: true }]"
                placeholder="请输入昵称"
        >
          <template #button>
            <van-button size="small" type="primary" native-type="submit">确认</van-button>
          </template>
        </van-field>
      </van-form>
    </van-popup>
  </div>
</template>

<script>
  import {ApiConfig, Request, GetLocalStorage} from "@/assets/js/config";

  export default {
    name: 'm4',
    data() {
      return {
        nicknamePopup: false,
        nickname: null,
        changeNicknameData: '',
        photo: null,
        account: GetLocalStorage('userData').account
      };
    },
    created() {
      Request({
        method: 'post',
        data: {
          api: ApiConfig.getUserData,
          account: GetLocalStorage('userData').account
        }
      }).then(res => {
        this.photo = res.data.photo;
        this.nickname = res.data.nickname;
      })
    },
    methods: {
      changePhoto(file) {
        console.log(typeof file.content);
        Request({
          method: 'post',
          data: {
            api: ApiConfig.changePhoto,
            photo: file.content,
            account: GetLocalStorage('userData').account
          }
        }).then(res => {
          console.log(res)
        })
      },
      changeNickname() {
        Request({
          method: 'post',
          data: {
            api: ApiConfig.changeNickname,
            nickname: this.changeNicknameData,
            account: GetLocalStorage('userData').account
          }
        }).then(res => {
          if (res.status === '0000') {
            this.nicknamePopup = false;
            this.changeNicknameData = '';
          } else {
            this.$notify({ type: 'danger', message: res.msg });
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .m4 {
    .s-1 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      padding: 10px 16px;
      width: 100%;
      margin-bottom: 10px;
      background-color: #f7f7f7;
      section {
        display: flex;
        align-items: center;
        p {
          margin: 0 0 0 5px;
        }
      }
      img {
        height: 60px;
      }
    }
    .van-cell {
      background-color: #f7f7f7;
    }
  }
</style>
