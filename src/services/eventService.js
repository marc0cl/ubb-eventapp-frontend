import axiosInstance from './axiosInstance';

const eventService = {
    getEventsToAttend: async (userId) => {
        const response = await axiosInstance.get(`/users/${userId}/to-attend`);
        return response.data;
    },
    getEventsByIds: async (ids) => {
        const response = await axiosInstance.get(`/events`, {
            params: { ids: ids.join(',') }
        });
        return response.data;
    },

    getUpcomingEvents: async () => {
        // Backend expects the 'after' parameter without timezone information or
        // milliseconds. `toISOString()` returns a string with milliseconds,
        // which some backends fail to parse correctly. We therefore strip the
        // milliseconds portion.
        const now = new Date().toISOString().split('.')[0];
        const response = await axiosInstance.get(`/events/upcoming`, {
            params: { after: now }
        });
        return response.data;
    },

    getEventsByCreator: async (userId) => {
        const response = await axiosInstance.get(`/events/creator/${userId}`);
        return response.data;
    },

    createEvent: async (eventData) => {
        const response = await axiosInstance.post(`/events`, eventData);
        return response.data;
    },

    updateEvent: async (eventData) => {
        const response = await axiosInstance.put(`/events`, eventData);
        return response.data;
    },

    deleteEvent: async (eventId) => {
        const response = await axiosInstance.delete(`/events/${eventId}`);
        return response.data;
    },

    getPendingEvents: async () => {
        const response = await axiosInstance.get(`/events/pending`);
        return response.data;
    },

    approveEvent: async (eventId) => {
        const response = await axiosInstance.post(`/events/${eventId}/approve`);
        return response.data;
    },

    registerForEvent: async (eventId, userId) => {
        const response = await axiosInstance.post(`/registrations`, {
            id: { eventId, userId }
        });
        return response.data;
    },

    cancelRegistration: async (eventId, userId) => {
        const response = await axiosInstance.post(`/registrations/cancel`, {
            eventId,
            userId
        });
        return response.data;
    }
};

export default eventService;
