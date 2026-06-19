import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach Sanctum Bearer Token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskora_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle auth errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('taskora_token');
      localStorage.removeItem('taskora_user');
      // Redirect to login if on protected page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/forgot-password' && !window.location.pathname.startsWith('/reset-password')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default client;
