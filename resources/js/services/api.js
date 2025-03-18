import axios from 'axios';

// Create an axios instance for API calls
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true // This ensures cookies are sent with requests
});

// Add request interceptor to include authentication token
api.interceptors.request.use(
  config => {
    // Get token from localStorage or cookie
    const token = localStorage.getItem('auth_token');

    // Get CSRF token from meta tag
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access - could redirect to login page
      console.log('Unauthorized access, please log in');
      // Could redirect to login or dispatch logout action
    }

    return Promise.reject(error);
  }
);

export default api;

// Helper methods for common API operations
export const getUserData = async () => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    // If token is returned, save it
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/logout');
    // Clear stored token
    localStorage.removeItem('auth_token');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    // Clear token anyway on error
    localStorage.removeItem('auth_token');
    throw error;
  }
};
