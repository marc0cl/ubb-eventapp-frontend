import axiosInstance from './axiosInstance';

const userService = {
    getUser: async (id) => {
        const res = await axiosInstance.get(`/users/${id}`);
        return res.data;
    },
    getSummary: async (id) => {
        const res = await axiosInstance.get(`/users/${id}/summary`);
        return res.data;
    },
    getTrophies: async (ids) => {
        const res = await axiosInstance.get(`/trophies`, { params: { ids: ids.join(',') } });
        return res.data;
    },
    getRecommendations: async (id) => {
        const res = await axiosInstance.get(`/users/${id}/recommendations`);
        return res.data;
    },
    getPendingRequests: async (userId) => {
        const res = await axiosInstance.get(`/users/pending/${userId}`);
        return res.data;
    },
    sendFriendRequest: async (userId, friendId) => {
        const res = await axiosInstance.post(`/friendships`, { userId, friendId });
        return res.data;
    },
    acceptFriendRequest: async (userId, friendId) => {
        const res = await axiosInstance.post(`/friendships/accept`, {
            userId,
            friendId
        });
        return res.data;
    },
    rejectFriendRequest: async (userId, friendId) => {
        const res = await axiosInstance.post(`/friendships/reject`, {
            userId,
            friendId
        });
        return res.data;
    }
};

export default userService;
