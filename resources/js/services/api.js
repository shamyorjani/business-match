import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Redirect to login page
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const login = (data) => {
  return api.post('/login', data).then(response => {
    // Save token to local storage
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  });
};

export const register = (data) => {
  return api.post('/register', data).then(response => {
    // Save token to local storage
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  });
};

export const logout = () => {
  return api.post('/logout').finally(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  });
};

export const getUser = () => {
  return api.get('/user');
};

export default api;
