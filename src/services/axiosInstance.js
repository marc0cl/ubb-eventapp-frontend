import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const instance = axios.create({
    baseURL: API_URL
});

let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
    refreshQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    refreshQueue = [];
};

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`
        };
    }
    return config;
});

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        refreshQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers['Authorization'] = `Bearer ${token}`;
                            return instance(originalRequest);
                        })
                        .catch((err) => {
                            return Promise.reject(err);
                        });
                }

                originalRequest._retry = true;
                isRefreshing = true;
                try {
                    const data = await authService.refreshToken();
                    const newToken = data.accessToken || data.access_token || data.token;
                    if (newToken) {
                        localStorage.setItem('accessToken', newToken);
                        instance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                        processQueue(null, newToken);
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        return instance(originalRequest);
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
                        window.location.href = '/';
                    }
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                localStorage.removeItem('accessToken');
                if (typeof window !== 'undefined' && window.location.pathname !== '/') {
                    window.location.href = '/';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
