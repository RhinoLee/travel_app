import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/views/Home.vue"
import Register from "@/views/member/Register.vue"
import Login from "@/views/member/Login.vue"
import { useMemberStore } from "@/stores/member"



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/addTrip',
      name: 'AddTrip',
      component: () => import('@/views/trip/AddTrip.vue')
    },
    {
      path: '/travelPlans',
      name: 'TravelPlans',
      component: () => import('@/views/trip/TravelPlans.vue')
    },
    {
      path: '/travelPlans/:planId',
      name: 'TravelPlan',
      component: () => import('@/views/trip/TravelPlan.vue')
    },
  ]
})

router.beforeEach(async (to, from) => {
  const memberStore = useMemberStore()
  console.log("router guard from", from);
  console.log("router guard to", to);
  const result = await memberStore.getMemberInfo()
  if (to.name !== "Login" && !result) return { name: "Login" }
  
})

export default router
