import axiosInstance from './axiosInstance';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Use a raw axios instance without interceptors for refresh flow
const rawAxios = axios.create({ baseURL: API_URL });

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
    },

    refreshToken: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token');
        }
        const response = await rawAxios.post('/auth/refresh', { refreshToken });
        return response.data;
    }
};

export default authService;
