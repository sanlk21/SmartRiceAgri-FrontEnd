// src/services/api/supportApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

export const supportApi = {
    // Create a new support ticket
    createTicket: async (data, userNic) => {
        try {
            const response = await axios.post(`${BASE_URL}/support`, data, {
                params: { userNic }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating ticket:', error);
            throw error;
        }
    },

    // Get user's tickets
    getUserTickets: async (userNic) => {
        try {
            const response = await axios.get(`${BASE_URL}/support/my-tickets`, {
                params: { userNic }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user tickets:', error);
            throw error;
        }
    },

    // Answer a ticket (admin only)
    answerTicket: async (ticketId, answer, adminNic) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/support/${ticketId}/answer`,
                { answer },
                { params: { adminNic } }
            );
            return response.data;
        } catch (error) {
            console.error('Error answering ticket:', error);
            throw error;
        }
    },

    // Close a ticket
    closeTicket: async (ticketId) => {
        try {
            const response = await axios.put(`${BASE_URL}/support/${ticketId}/close`);
            return response.data;
        } catch (error) {
            console.error('Error closing ticket:', error);
            throw error;
        }
    },

    // Delete a ticket
    deleteTicket: async (ticketId, userNic) => {
        try {
            await axios.delete(`${BASE_URL}/support/${ticketId}`, {
                params: { userNic }
            });
        } catch (error) {
            console.error('Error deleting ticket:', error);
            throw error;
        }
    },

    // Get open tickets (admin only)
    getOpenTickets: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/support/open`);
            return response.data;
        } catch (error) {
            console.error('Error fetching open tickets:', error);
            throw error;
        }
    },

    // Get all tickets (admin only)
    getAllTickets: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/support/all`);
            return response.data;
        } catch (error) {
            console.error('Error fetching all tickets:', error);
            throw error;
        }
    }
};

// src/hooks/useSupport.js
import { useCallback, useEffect, useState } from 'react';
import { supportApi } from '../services/api/supportApi';

export const useSupport = (userNic, isAdmin = false) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTickets = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = isAdmin 
                ? await supportApi.getOpenTickets()
                : await supportApi.getUserTickets(userNic);
            setTickets(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch tickets');
            console.error('Error fetching tickets:', err);
        } finally {
            setLoading(false);
        }
    }, [userNic, isAdmin]);

    const createTicket = async (ticketData) => {
        try {
            setError(null);
            const newTicket = await supportApi.createTicket(ticketData, userNic);
            setTickets(prev => [newTicket, ...prev]);
            return newTicket;
        } catch (err) {
            setError(err.message || 'Failed to create ticket');
            throw err;
        }
    };

    const answerTicket = async (ticketId, answer) => {
        if (!isAdmin) throw new Error('Only admins can answer tickets');
        try {
            setError(null);
            const updatedTicket = await supportApi.answerTicket(ticketId, answer, userNic);
            setTickets(prev => prev.map(ticket => 
                ticket.id === ticketId ? updatedTicket : ticket
            ));
            return updatedTicket;
        } catch (err) {
            setError(err.message || 'Failed to answer ticket');
            throw err;
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    return {
        tickets,
        loading,
        error,
        createTicket,
        answerTicket,
        closeTicket: (ticketId) => supportApi.closeTicket(ticketId),
        deleteTicket: (ticketId) => supportApi.deleteTicket(ticketId, userNic),
        refreshTickets: fetchTickets
    };
};