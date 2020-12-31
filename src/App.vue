<template>
  <div id="app">
    <header>
      <div class="headerLeft">
        <router-link to="/list">列表</router-link>
        <span class="headerLeftText">/</span>
        <router-link :to="'/' + path">{{ path }}</router-link>
      </div>
      <div class="headerRight">
        <template v-if="!isLogin()">
          <router-link class="headerText" to="/login">登录</router-link>
          <el-divider direction="vertical"></el-divider>
          <router-link class="headerText" to="/reg">注册</router-link>
        </template>
        <template v-else>
          <a class="headerText white">
            欢迎您，尊敬的 {{ this.$store.getters.getUserInfo.username }}
          </a>
          <a class="headerText white"> 用户 </a
          ><el-divider direction="vertical"></el-divider>
          <a class="headerText white" @click="logOut"> 退出 </a>
        </template>
        <el-divider direction="vertical"></el-divider>
        <router-link class="headerText" to="/cart">我的购物车</router-link>
        <el-divider direction="vertical"></el-divider>
        <span class="glyphicon glyphicon-shopping-cart shoppingCart"></span>
        <div class="itemCount">{{ itemCount }}</div>
        <select id="select1" onchange="change()">
          <option value="" selected hidden disabled>选择主题</option>
          <option value="1">白天模式</option>
          <option value="2">夜间模式</option>
        </select>
      </div>
    </header>
    <router-view></router-view>
    <footer>
      <span class="footerText">&copy;Z09418226姚锦</span>
    </footer>
  </div>
</template>

<script>
import store from '@/store';

export default {
  name: 'App',
  data() {
    return {
      path: 'Cart',
    };
  },
  methods: {
    isLogin() {
      // console.log(this.$cookies.get('userInfo'));
      let userInfo =
        this.$store.state.userInfo || this.$cookies.get('userInfo');
      if (userInfo === null) {
        return false;
      }
      return true;
    },
    logOut() {
      this.$store.state.userInfo = null;
      window.$cookies.remove('userInfo');
      this.$router.go(0);
    },
  },
  beforeDestroy() {
    // 离线保存数据
    localStorage.itemCount = store.state.itemCount;
  },
  computed: {
    itemCount() {
      return store.state.itemCount;
    },
  },
  watch: {
    $route: function (value, oldValue) {
      let arr = value.path.split('/');
      let str = arr[1];
      str = str.charAt(0).toUpperCase() + str.slice(1);
      // console.log(str);
      this.path = str === 'List' ? 'Index' : str;
    },
  },
};
</script>

<style scope>
.white {
  color: #fff !important;
}

header,
footer {
  width: 100%;
  height: 50px;
}

.headerText {
  color: white;
  font-size: 15px;
  line-height: 50px;
}

.headerLeft {
  float: left;
  padding-left: 5%;
}

.headerLeft a {
  line-height: 50px;
  font-size: 14px;
  margin-right: 20px;
  border-radius: 3px;
}

.headerLeftText {
  font-size: 15px;
  color: grey;
  margin-left: -10px;
  margin-right: 10px;
}

.headerRight {
  float: right;
  cursor: pointer;
  padding-right: 5%;
}

.headerRight a:hover,
a:link,
a:visited {
  color: white;
  text-decoration: none;
}

.glyphicon {
  color: white;
  font-size: 15px;
}

.itemCount {
  color: white;
  width: 18px;
  height: 18px;
  font-size: 15px;
  border-radius: 50%;
  display: inline-block;
  background-color: red;
  line-height: 18px;
  text-align: center;
  margin-right: 10px;
}

footer {
  padding-left: 46%;
  margin-top: 100px;
}

.footerText {
  color: white;
  font-size: 15px;
  line-height: 50px;
}
</style>
