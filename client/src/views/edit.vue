<template>
  <div class="edit">
    <van-form @submit="onSubmit">
      <van-nav-bar :border="false">
        <template #left>
          <router-link to="/circles">取消</router-link>
        </template>
        <template #right>
          <van-button type="primary" size="small" native-type="submit">发表</van-button>
        </template>
      </van-nav-bar>
      <van-field
              v-model="circlesData.text"
              :border="false"
              rows="2"
              type="textarea"
              placeholder="这一刻的想法..."
      />
      <section>
        <van-uploader v-model="circlesData.picture" />
      </section>
    </van-form>
  </div>
</template>

<script>
import {ApiConfig, Request, GetLocalStorage} from "@/assets/js/config";

export default {
  name: 'edit',
  data() {
    return {
      circlesData: {
        text: '',
        date: '',
        picture: [],
      }
    };
  },
  created() {

  },
  methods: {
    onSubmit() {
      console.log(this.circlesData)
    }
  }
}
</script>

<style scoped lang="scss">
.edit {
  section {
    box-sizing: border-box;
    width: 100%;
    padding: 10px;
  }

}
</style>
