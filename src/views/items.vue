<template>
  <div class="card" @mouseover="$emit('display')" @mouseleave="$emit('leave')">
    <router-link :to="'/product/' + id"
      ><img :src="img" class="myImg card-img-top"
    /></router-link>
    <div class="card-body">
      <p class="card-text name">{{ name }}</p>
      <p class="card-text sale">销量{{ sale }}件</p>
      <!-- <p class="card-text color" :style="'background-color:' + color"></p> -->
      <p class="card-text price">￥{{ price }}</p>
    </div>
    <span v-if="display === 'none'" class="cartNone"></span>
    <span
      v-else
      @click="$emit('click')"
      class="cart"
      :style="'display: ' + display"
      >加入购物车</span
    >
  </div>
</template>

<script>
export default {
  name: 'item',
  props: [
    'name',
    'price',
    'sale',
    'id',
    'img',
    'color',
    'display',
    'begin',
    'last',
    'disp',
    'lal',
  ],
};
</script>

<style scope>
.myImg {
  width: 146px;
  height: 160px;
}

.card {
  float: left;
  width: 25%;
  display: flex;
  margin-bottom: 2%;
  border-radius: 3px;
}

.cart {
  color: white;
  cursor: pointer;
  border-radius: 3px;
  float: right;
  /* width: 100%; */
  width: 40%;
  margin: 0 auto;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  background-color: crimson;
}

.cartNone {
  color: white;
  border-radius: 3px;
  float: right;
  /* width: 100%; */
  width: 40%;
  margin: 0 auto;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  background-color: white;
}

.cart:hover {
  background-color: orangered;
}

@media (max-width: 970px) {
  .card {
    width: 22%;
  }
}

@media (max-width: 768px) {
  .card {
    width: 42%;
  }
}

img {
  cursor: pointer;
}

.name {
  font-size: 14px;
  font-weight: bolder;
}

.color {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
  border: burlywood 1px solid;
}

.price {
  color: red;
  font-size: 14px;
}

.sale {
  color: black;
  font-size: 14px;
}

.card-body p {
  margin: 20px;
}
</style>
