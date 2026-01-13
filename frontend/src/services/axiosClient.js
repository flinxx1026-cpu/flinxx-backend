import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Create axios instance
const axiosClient = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to attach token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle 403 USER_BANNED
axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response?.status === 403 &&
      err.response.data?.code === 'USER_BANNED'
    ) {
      alert('Your account has been banned')
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default axiosClient
