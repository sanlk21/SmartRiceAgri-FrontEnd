// src/api/supportApi.js
import axios from '@/api/axios';

export const supportApi = {
    // Create a new support ticket
    createTicket: async (data) => {
        const response = await axios.post('/api/v1/support', data);
        return response.data;
    },

    // Get user's tickets
    getUserTickets: async () => {
        const response = await axios.get('/api/v1/support/my-tickets');
        return response.data;
    },

    // Get specific ticket
    getTicket: async (ticketId) => {
        const response = await axios.get(`/api/v1/support/${ticketId}`);
        return response.data;
    },

    // Close a ticket
    closeTicket: async (ticketId) => {
        const response = await axios.put(`/api/v1/support/${ticketId}/close`);
        return response.data;
    },

    // Delete a ticket
    deleteTicket: async (ticketId) => {
        const response = await axios.delete(`/api/v1/support/${ticketId}`);
        return response.data;
    },

    // Admin: Get all open tickets
    getOpenTickets: async () => {
        const response = await axios.get('/api/v1/support/open');
        return response.data;
    },

    // Admin: Get all tickets
    getAllTickets: async () => {
        const response = await axios.get('/api/v1/support/all');
        return response.data;
    },

    // Admin: Answer a ticket
    answerTicket: async (ticketId, answer) => {
        const response = await axios.post(`/api/v1/support/${ticketId}/answer`, { answer });
        return response.data;
    }
};