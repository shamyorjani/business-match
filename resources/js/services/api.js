import axios from 'axios';

// Create an axios instance for API calls
const api = axios.create({
  baseURL: '/api', // Ensure this is correct
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Add request interceptor to include authentication token and CSRF token
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
    console.error('API Error:', error.response || error);

    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // Unauthorized - clear local storage and redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        // Redirect to login page if needed
        // window.location.href = '/login';
      }
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
    console.log('Registering user:', userData); // Add logging for debugging
    const response = await api.post('/register', userData);
    console.log('Registration response:', response); // Add logging for response
    
    // Save the token if it's returned
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error response data:', error.response?.data); // Add logging for error response data
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
