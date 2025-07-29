import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const eventService = {
    getEventsToAttend: async (userId) => {
        const response = await axios.get(`${API_URL}/users/${userId}/to-attend`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },
    getEventsByIds: async (ids) => {
        const response = await axios.get(`${API_URL}/events?ids=${ids.join(',')}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    }
};

export default eventService;
