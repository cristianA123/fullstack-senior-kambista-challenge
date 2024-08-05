import { envs } from '@/config/envs'
import axios from 'axios'

// Configuración de la instancia de Axios
const ApiBackend = axios.create({
  baseURL: envs.VITE_API_BASE_URL_BACKEND,
})

// Interceptor para agregar el token de autorización a cada solicitud
ApiBackend.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default ApiBackend
