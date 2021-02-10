<template>
  <div class="m2">
    <van-cell>
     <div class="item">
       <img src="../../assets/logo.png" />
       <span class="custom-title">单元格</span>
     </div>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'm2',
}
</script>

<style scoped lang="scss">
.m2 {
  .van-cell {
    background-color: #f7f7f7;
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
