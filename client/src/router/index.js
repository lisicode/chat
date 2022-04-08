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
        path:'/m1',
        component: () => import(/* webpackChunkName: "m1" */ '../components/home/m1.vue')
      },
      {
        path:'/m2',
        component: () => import(/* webpackChunkName: "m2" */ '../components/home/m2.vue')
      },
      {
        path:'/m3',
        component: () => import(/* webpackChunkName: "m3" */ '../components/home/m3.vue')
      },
      {
        path:'/m4',
        component: () => import(/* webpackChunkName: "m4" */ '../components/home/m4.vue')
      },
    ]
  },
  {
    path:'/add',
    name: 'add',
    component: () => import(/* webpackChunkName: "add" */ '../views/add.vue')
  },
  {
    path:'/circles',
    name: 'circles',
    component: () => import(/* webpackChunkName: "circles" */ '../views/circles.vue')
  },
  {
    path:'/chat',
    name: 'chat',
    component: () => import(/* webpackChunkName: "chat" */ '../views/chat.vue')
  },
  {
    path:'/edit',
    name: 'edit',
    component: () => import(/* webpackChunkName: "edit" */ '../views/edit.vue')
  }
];

const router = new VueRouter({
  routes
});

export default router
