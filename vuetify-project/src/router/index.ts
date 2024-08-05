// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'

import Login from '../pages/Login.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Check if the user is authenticated
  if (!authStore.isAuthenticated) {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        // Attempt to fetch user data
        await authStore.checkAuth()
      } catch (error) {
        // If there's an error, clear the token
        authStore.logout()
      }
    }
  }

  // If the route requires authentication and the user is not authenticated, redirect to login
  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
