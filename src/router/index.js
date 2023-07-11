import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import PlanningPage from '../views/PlanningPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/planning',
    name: 'Planning',
    component: PlanningPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
