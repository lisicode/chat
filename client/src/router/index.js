import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
  },
  {
    path: '/home',
    component: () => import(/* webpackChunkName: "home" */ '../views/home.vue'),
    children:[
      {
        path:'',
        component: () => import(/* webpackChunkName: "m1" */ '../components/home/m1.vue')
      },
      {
        path:'/m2',
        component: () => import(/* webpackChunkName: "m2" */ '../components/home/m2.vue')
      },
      {
        path:'/m3',
        component: () => import(/* webpackChunkName: "m3" */ '../components/home/m3.vue')
      }
    ]
  },
  {
    path:'/chat',
    name: 'chat',
    component: () => import(/* webpackChunkName: "chat" */ '../views/chat.vue')
  }
];

const router = new VueRouter({
  routes
});

export default router
