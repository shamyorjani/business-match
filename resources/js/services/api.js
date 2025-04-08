import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Enable sending cookies with requests
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding auth token to request:', token.substring(0, 10) + '...');
    } else {
      console.log('No auth token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      response: error.response?.data
    });

    if (error.response?.status === 401) {
      console.log('Unauthorized - clearing auth data');
      // Clear auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');

      // Only redirect if not already on home page
      const currentPath = window.location.pathname;
      if (currentPath !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const login = (data) => {
  return api.post('/login', data);
};
export const register = (data) => {
    return api.post('/register', data).then(response => {
        // Save token to local storage
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
            console.log('Auth token saved to localStorage' ,  response.data.token);
        }

        return response;
    });
};

export const logout = () => {
  return api.post('/logout');
};

export const getUser = () => {
  console.log('Fetching user data...');
  return api.get('/user');
};

export default api;
