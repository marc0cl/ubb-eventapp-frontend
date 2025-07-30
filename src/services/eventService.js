import axiosInstance from './axiosInstance';

let upcomingCache = null;
let upcomingCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
        const nowMs = Date.now();
        if (upcomingCache && nowMs - upcomingCacheTime < CACHE_DURATION) {
            return upcomingCache;
        }
        // Backend expects the 'after' parameter without timezone information or
        // milliseconds. `toISOString()` returns a string with milliseconds,
        // which some backends fail to parse correctly. We therefore strip the
        // milliseconds portion.
        const now = new Date().toISOString().split('.')[0];
        const response = await axiosInstance.get(`/events/upcoming`, {
            params: { after: now }
        });
        upcomingCache = response.data;
        upcomingCacheTime = nowMs;
        return response.data;
    },

    getEventsByCreator: async (userId) => {
        const response = await axiosInstance.get(`/events/creator/${userId}`);
        return response.data;
    },

    createEvent: async (eventData) => {
        const response = await axiosInstance.post(`/events`, eventData);
        eventService.clearUpcomingCache();
        return response.data;
    },

    updateEvent: async (eventData) => {
        const response = await axiosInstance.put(`/events`, eventData);
        eventService.clearUpcomingCache();
        return response.data;
    },

    deleteEvent: async (eventId) => {
        const response = await axiosInstance.delete(`/events/${eventId}`);
        eventService.clearUpcomingCache();
        return response.data;
    },

    getPendingEvents: async () => {
        const response = await axiosInstance.get(`/events/pending`);
        return response.data;
    },

    approveEvent: async (eventId) => {
        const response = await axiosInstance.post(`/events/${eventId}/approve`);
        eventService.clearUpcomingCache();
        return response.data;
    },

    registerForEvent: async (eventId, userId) => {
        const response = await axiosInstance.post(`/registrations`, {
            id: { eventId, userId },
            event: { id: eventId },
            user: { id: userId }
        });
        return response.data;
    },

    cancelRegistration: async (eventId, userId) => {
        const response = await axiosInstance.post(`/registrations/cancel`, {
            eventId,
            userId
        });
        return response.data;
    },

    getPublicEvents: async () => {
        const response = await axiosInstance.get(`/events/public`);
        const events = response.data || [];
        const now = new Date();
        return events
            .filter(
                ev =>
                    ev.estadoValidacion !== 'PENDIENTE' &&
                    new Date(ev.fechaFin) >= now
            )
            .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
    },

    clearUpcomingCache: () => {
        upcomingCache = null;
        upcomingCacheTime = 0;
    }
};

export default eventService;
