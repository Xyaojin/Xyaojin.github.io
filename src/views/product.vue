<template>
  <section class="section">
    <div class="mainLeft">
      <img :src="img" />
      <div class="introduction" v-html="intro"></div>
    </div>
    <div class="mainRight">
      <div class="nameText">{{ name }}</div>
      <div class="priceText">￥{{ price }}</div>
      <button class="btn" @click="addItems">加入购物车</button>
    </div>
  </section>
</template>

<script>
import store from '@/store';

export default {
  name: 'product',
  data() {
    return {
      // 获取路由参数id，以此获取对应商品参数
      id: parseInt(this.$route.params.id),
      // 获取商品数组
      items: store.state.itemsBak,
    };
  },
  computed: {
    // 页面参数获取
    name() {
      return this.items[this.id - 1].name;
    },
    price() {
      return this.items[this.id - 1].price;
    },
    img() {
      return this.items[this.id - 1].img;
    },
    intro() {
      return this.items[this.id - 1].intro;
    },
  },
  methods: {
    // 添加商品时提交mutations
    addItems() {
      store.commit({
        type: 'addItem',
        count: 1,
      });
      store.commit({
        type: 'addCartItems',
        id: this.id,
        name: this.name,
        price: this.price,
        count: 1,
        img: this.img,
      });
    },
  },
};
</script>

<style scoped>
section {
  width: 94%;
  height: 500px;
  margin-top: 1%;
  margin-left: 3%;
  margin-right: 3%;
  border-radius: 5px;
}

.mainLeft,
.mainRight {
  width: 50%;
  float: left;
  height: 500px;
  text-align: center;
}

img {
  width: 187px;
  height: 300px;
  margin-top: 5px;
  margin-left: auto;
  margin-right: auto;
}

.introduction {
  text-align: center;
  margin-top: 10px;
  color: black;
  font-size: 13px;
}

.mainRight {
  height: 380px;
  margin-top: 120px;
}

.nameText {
  font-weight: bolder;
  font-size: 25px;
}

.priceText {
  color: red;
  font-size: 17px;
}

.btn {
  width: 100px;
  color: white;
}
</style>
