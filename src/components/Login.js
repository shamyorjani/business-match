const handleLogin = async (credentials) => {
    try {
        const response = await api.post('/login', credentials);
        
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return true;
        }
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        return false;
    }
} 