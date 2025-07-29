import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const authService = {
    login: async (email, password) => {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });
        return response.data;
    },

    register: async (userData) => {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return response.data;
    },

    logout: async () => {
        const token = localStorage.getItem('accessToken');
        try {
            if (token) {
                await axios.post(
                    `${API_URL}/auth/logout`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
        } catch (err) {
            console.error('Failed to logout from API:', err);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    }
};

export default authService;
