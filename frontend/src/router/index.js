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
      path: '/addMainSchedule',
      name: 'AddMainSchedule',
      component: () => import('@/views/travel/AddMainSchedule.vue')
    },
    {
      path: '/mainSchedules',
      name: 'MainSchedules',
      component: () => import('@/views/travel/MainSchedules.vue')
    },
    {
      path: '/mainSchedules/:mainScheduleId',
      name: 'MainSchedule',
      component: () => import('@/views/travel/MainSchedule.vue')
    },
  ]
})

router.beforeEach(async (to, from) => {
  const memberStore = useMemberStore()
  const result = await memberStore.getMemberInfo()
  if (to.name !== "Login" && !result) return { name: "Login" }
})

export default router
