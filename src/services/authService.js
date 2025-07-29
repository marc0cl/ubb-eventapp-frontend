import axiosInstance from './axiosInstance';

const authService = {
    login: async (email, password) => {
        const response = await axiosInstance.post('/auth/login', {
            email,
            password
        });
        return response.data;
    },

    register: async (userData) => {
        const response = await axiosInstance.post('/auth/register', userData);
        return response.data;
    },

    logout: async () => {
        const token = localStorage.getItem('accessToken');
        try {
            if (token) {
                await axiosInstance.post('/auth/logout');
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
