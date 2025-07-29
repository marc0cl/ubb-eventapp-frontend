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
    }
};

export default userService;
