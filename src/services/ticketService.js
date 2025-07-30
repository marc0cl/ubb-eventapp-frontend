import axiosInstance from './axiosInstance';

const ticketService = {
    openTicket: async (descripcion, reporterId) => {
        const response = await axiosInstance.post('/tickets', {
            descripcion,
            reporter: { id: reporterId }
        });
        return response.data;
    },
    getOpenTickets: async () => {
        const response = await axiosInstance.get('/tickets');
        return response.data;
    },
    closeTicket: async (ticketId) => {
        const response = await axiosInstance.post(`/tickets/${ticketId}/close`);
        return response.data;
    }
};

export default ticketService;
