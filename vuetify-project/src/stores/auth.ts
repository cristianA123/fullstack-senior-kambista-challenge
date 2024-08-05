import { defineStore } from 'pinia'
import router from '../router'
import ApiBackend from '@/api/ApiBackend'

interface User {
  id: string;
  email: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
  }),
  actions: {
    async login (email: string, password: string) {
      try {
        const response = await ApiBackend.post('/auth/login', { email, password })
        const user = response.data.user
        this.user = user
        this.isAuthenticated = true
        localStorage.setItem('authToken', response.data.token)
        router.push('/')
      } catch (error) {
        console.error('Error en el login', error)
      }
    },
    logout () {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('authToken')
      router.push('/login')
    },
    async checkAuth () {
      const token = localStorage.getItem('authToken')
      if (token) {
        try {
          const { data } = await ApiBackend.get('/auth/me')
          this.user = data.data.user
          this.isAuthenticated = true
          localStorage.setItem('authToken', data.data.token)
        } catch (error) {
          this.logout()
        }
      } else {
        this.logout()
      }
    },
  },
})
