import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/list',
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('./views/list.vue'),
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('./views/product.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('./views/cart.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/reg',
      name: 'reg',
      component: () => import('@/views/Reg.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path != '/login' && to.path != '/reg') {
    // 判断该路由是否需要登录权限
    if (window.$cookies.get('userInfo') != null) {
      // 通过vuex state获取当前的token是否存在
      next();
    } else {
      next({
        path: '/login',
      });
    }
  } else {
    next();
  }
});

export default router;
