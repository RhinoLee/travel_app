import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/views/Home.vue"
import Login from "@/views/member/Login.vue"
import AddMainSchedule from "@/views/travel/AddMainSchedule.vue"
import { useMemberStore } from "@/stores/member"
import { useCommonStore } from "@/stores/common"

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
      component: () => import('@/views/member/Register.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/verifyEmail',
      name: 'VerifyEmail',
      component: () => import('@/views/member/VerifyEmail.vue')
    },
    {
      path: '/forgotPassword',
      name: 'ForgotPassword',
      component: () => import('@/views/member/ForgotPassword.vue')
    },
    {
      path: '/resetPassword',
      name: 'ResetPassword',
      component: () => import('@/views/member/ResetPassword.vue')
    },
    {
      path: '/memberInfo',
      name: 'MemberInfo',
      component: () => import('@/views/member/MemberInfo.vue')
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
      path: '/mainSchedules/:mainScheduleId/:date?',
      name: 'MainSchedule',
      component: () => import('@/views/travel/MainSchedule.vue')
    },
  ]
})

const withoutAuthList = [
  "Register", "VerifyEmail", "ForgotPassword", "ResetPassword"
]

router.beforeEach(async (to, from) => {
  if (withoutAuthList.findIndex(routeName => routeName === to.name) === -1) {
    const memberStore = useMemberStore()
    const result = await memberStore.getMemberInfo()
    if (to.name !== "Login" && !result) return { name: "Login" }
  }
})

export default router
