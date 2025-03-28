import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true  // This is crucial for cookies
});

// Get CSRF cookie before making other requests
const getCsrfToken = async () => {
    await axios.get('/sanctum/csrf-cookie');
};

// Add request interceptor to add auth token to every request
api.interceptors.request.use(
    async (config) => {
        // Get CSRF token if we don't have one
        if (!document.cookie.includes('XSRF-TOKEN')) {
            await getCsrfToken();
        }
        
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear auth data on 401 responses
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default api; 