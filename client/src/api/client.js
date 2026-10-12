import axios from 'axios';

// Uses the Vercel env variable in production, localhost in development
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5259/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: attach the JWT to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('devshelf_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: handle expired/invalid tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('devshelf_token');
      localStorage.removeItem('devshelf_user');

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