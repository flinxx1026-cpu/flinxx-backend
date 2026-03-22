import axios from 'axios'

const BACKEND_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : import.meta.env.VITE_BACKEND_URL;

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

// Add response interceptor to handle 401 and 403 errors
axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (err.response?.status === 401) {
      const errorCode = err.response.data?.code;
      const message = err.response.data?.message || err.response.data?.error;
      
      console.warn('🔐 [Axios] 401 Unauthorized:', message, errorCode);
      
      // Clear authentication data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('authProvider');
      
      // Show appropriate message to user
      if (errorCode === 'TOKEN_EXPIRED') {
        alert('à¤†à¤ªà¤•à¤¾ à¤¸à¤¤à¥à¤° à¤¸à¤®à¤¾à¤ªà¥à¤¤ à¤¹à¥‹ à¤—à¤¯à¤¾ à¤¹à¥ˆà¥¤ à¤•à¥ƒà¤ªà¤¯à¤¾ à¤«à¤¿à¤° à¤¸à¥‡ à¤²à¥‰à¤—à¤¿à¤¨ à¤•à¤°à¥‡à¤‚à¥¤');
      } else {
        alert('à¤ªà¥à¤°à¤®à¤¾à¤£à¥€à¤•à¤°à¤£ à¤µà¤¿à¤«à¤²à¥¤ à¤•à¥ƒà¤ªà¤¯à¤¾ à¤«à¤¿à¤° à¤¸à¥‡ à¤²à¥‰à¤—à¤¿à¤¨ à¤•à¤°à¥‡à¤‚à¥¤');
      }
      
      // Redirect to login
      window.location.href = '/login';
    }
    
    // Handle 403 USER_BANNED or ACCOUNT_BANNED
    const errCode = err.response?.data?.code || err.response?.data?.error;
    if (
      err.response?.status === 403 &&
      (errCode === 'USER_BANNED' || errCode === 'ACCOUNT_BANNED')
    ) {
      // Trigger WarningModal via AuthContext
      window.dispatchEvent(new CustomEvent('account_banned'));
    }
    
    return Promise.reject(err)
  }
)

export default axiosClient
