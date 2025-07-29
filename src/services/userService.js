import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const userService = {
    getUser: async (id) => {
        const res = await axios.get(`${API_URL}/users/${id}`, { headers: getAuthHeaders() });
        return res.data;
    },
    getSummary: async (id) => {
        const res = await axios.get(`${API_URL}/users/${id}/summary`, { headers: getAuthHeaders() });
        return res.data;
    },
    getTrophies: async (ids) => {
        const res = await axios.get(`${API_URL}/trophies?ids=${ids.join(',')}`, { headers: getAuthHeaders() });
        return res.data;
    }
};

export default userService;
