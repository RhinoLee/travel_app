import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/views/Home.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/addTrip',
      name: 'AddTrip',
      component: () => import('@/views/trip/AddTrip.vue')
    }
  ]
})

export default router
