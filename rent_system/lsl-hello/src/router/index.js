import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import GoodsDetail from '../views/GoodsDetail.vue'
import Admin from '../views/Admin.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/detail/:id', component: GoodsDetail },
  { path: '/admin', component: Admin }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router