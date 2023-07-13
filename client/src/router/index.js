import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import PlanningPage from '../views/PlanningPage.vue'
import ItineraryPage from '../views/ItineraryPage.vue'

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
  },
  {
    path: '/itinerary',
    name: 'Itinerary',
    component: ItineraryPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Always scroll to the top
    return { top: 0 }
  }
})

export default router
