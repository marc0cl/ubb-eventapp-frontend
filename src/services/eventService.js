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
    },

    getUpcomingEvents: async () => {
        const now = new Date().toISOString().replace('Z', '');
        const response = await axios.get(`${API_URL}/events/upcoming?after=${encodeURIComponent(now)}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    getEventsByCreator: async (userId) => {
        const response = await axios.get(`${API_URL}/events/creator/${userId}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    createEvent: async (eventData) => {
        const response = await axios.post(`${API_URL}/events`, eventData, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    updateEvent: async (eventData) => {
        const response = await axios.put(`${API_URL}/events`, eventData, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    deleteEvent: async (eventId) => {
        const response = await axios.delete(`${API_URL}/events/${eventId}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    getPendingEvents: async () => {
        const response = await axios.get(`${API_URL}/events/pending`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    approveEvent: async (eventId) => {
        const response = await axios.post(`${API_URL}/events/${eventId}/approve`, {}, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    registerForEvent: async (eventId, userId) => {
        const response = await axios.post(`${API_URL}/registrations`, {
            id: { eventId, userId }
        }, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    cancelRegistration: async (eventId, userId) => {
        const response = await axios.post(`${API_URL}/registrations/cancel`, {
            eventId,
            userId
        }, {
            headers: getAuthHeaders()
        });
        return response.data;
    }
};

export default eventService;
