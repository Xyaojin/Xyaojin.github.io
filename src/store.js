import Vue from 'vue';
import Vuex from 'vuex';
import products from './product';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 页面共享的商品总数和购物车数据
    itemCount: parseInt(localStorage.itemCount) || 0,
    cartItems: JSON.parse(localStorage.cartItems) || [],
    itemsBak: [...products],
    userInfo: null,
  },
  getters: {
    getUserInfo(state) {
      console.log('信息是');
      console.log(state.userInfo || window.$cookies.get('userInfo'));
      return state.userInfo || window.$cookies.get('userInfo');
    },
  },
  mutations: {
    // 对购物车数据进行的操作
    addItem(state, payload) {
      state.itemCount += payload.count;
      localStorage.itemCount = state.itemCount;
      localStorage.cartItems = JSON.stringify(state.cartItems);
    },
    reduceItem(state, payload) {
      state.itemCount -= payload.count;
      localStorage.itemCount = state.itemCount;
      localStorage.cartItems = JSON.stringify(state.cartItems);
    },
    addCartItems(state, payload) {
      let temp = state.cartItems;
      for (let i of temp) {
        if (i.id === payload.id) {
          i.count += payload.count;
          localStorage.cartItems = JSON.stringify([...temp]);
          return;
        }
      }
      state.cartItems.push({
        id: payload.id,
        name: payload.name,
        price: payload.price,
        count: payload.count,
        img: payload.img,
        selectFlag: 0,
      });
      localStorage.cartItems = JSON.stringify([...temp]);
    },
    deleteItems(state, payload) {
      let temp = state.cartItems;
      for (let i in temp) {
        if (temp[i].id === payload.id) {
          state.itemCount -= payload.count;
          localStorage.itemCount = state.itemCount;
          temp.splice(i, 1);
          localStorage.cartItems = JSON.stringify([...temp]);
          return;
        }
      }
    },
    UpdateUserInfo(state, info) {
      console.log(info);
      state.userInfo = info;
    },
    addUser(state, user) {
      console.log(user);
      let users = JSON.parse(localStorage.getItem('users'));
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      state.userInfo = user;
      console.log(state.userInfo);
    },
  },
  actions: {
    getUsers() {
      if (localStorage.getItem('users') === null) {
        this.$axios({
          type: 'get',
          url: '/static/data/users.json',
        })
          .then((res) => {
            console.log(res);
            localStorage.setItem('users', JSON.stringify(res.data));
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        return JSON.parse(localStorage.getItem('users'));
      }
    },
  },
});
