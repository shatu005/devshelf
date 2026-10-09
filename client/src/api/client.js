import axios from 'axios';

// 1. Create an Axios instance with the backend base URL
const api = axios.create({
  baseURL: 'http://localhost:5259/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor: runs BEFORE every outgoing HTTP request
api.interceptors.request.use(
  (config) => {
    // Read the stored JWT token from localStorage
    const token = localStorage.getItem('devshelf_token');

    // If a token exists, attach it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: handle global errors like expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns 401 Unauthorized, the token is invalid or expired
    if (error.response && error.response.status === 401) {
      // Clear invalid credentials
      localStorage.removeItem('devshelf_token');
      localStorage.removeItem('devshelf_user');
      
      // Optional: redirect to login if not already there
      if (
        window.location.pathname !== '/login' && 
        window.location.pathname !== '/register'
    ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;