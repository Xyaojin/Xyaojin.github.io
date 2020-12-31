<template>
  <div>
    <el-carousel
      :interval="5000"
      arrow="always"
      type="card"
      height="500px"
      indicator-position="none"
    >
      <el-carousel-item v-for="(item, index) of list" :key="index">
        <img :src="item" alt="图片" width="1200" height="450" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
 
<script>
export default {
  name: 'Top',
  data() {
    return {
      list: [
        '/static/img/lunbo/1.webp',
        '/static/img/lunbo/2.webp',
        '/static/img/lunbo/3.webp',
      ],
    };
  },
};
</script>

<style scoped>
</style>