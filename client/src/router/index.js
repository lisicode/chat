import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'
import home from '../views/home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    name: 'home',
    component: home,
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
  }
]

const router = new VueRouter({
  routes
})

export default router
