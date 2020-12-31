import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueCookies from 'vue-cookies';

Vue.use(ElementUI);
Vue.use(VueCookies);
Vue.use(VueAxios, axios);
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

window.$cookies.config('30d')

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
