import axios from 'axios'
import domain from '../config'

const apiClient = axios.create({
  baseURL: domain,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized! Redirecting to login...')
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
export default apiClient
