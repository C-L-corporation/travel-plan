import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Planning from '../views/Planning.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/planning',
    name: 'Planning',
    component: Planning
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
