// src/hooks/useSupport.js
import axios from '@/api/axios';
import { useAuth } from '@/hooks/useAuth'; // Import your auth hook
import { useEffect, useState } from 'react';

export const useSupport = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Get user from auth context instead of session storage
    const { user } = useAuth();

    const fetchTickets = async () => {
        if (!user?.nic) {
            setError('Please log in to view tickets');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('/v1/support/my-tickets', {
                params: { userNic: user.nic }
            });
            setTickets(response.data);
        } catch (err) {
            console.error('Error fetching tickets:', err);
            setError(err.response?.data?.message || 'Failed to fetch tickets');
        } finally {
            setLoading(false);
        }
    };

    const createTicket = async (ticketData) => {
        if (!user?.nic) {
            throw new Error('Please log in to create a ticket');
        }

        try {
            setLoading(true);
            const response = await axios.post('/v1/support', ticketData, {
                params: { userNic: user.nic }
            });
            setTickets(prev => [response.data, ...prev]);
            return response.data;
        } catch (err) {
            console.error('Error creating ticket:', err);
            throw err.response?.data?.message || 'Failed to create ticket';
        } finally {
            setLoading(false);
        }
    };

    const answerTicket = async (ticketId, answer) => {
        if (!user?.nic) {
            throw new Error('Please log in to answer tickets');
        }

        try {
            setLoading(true);
            const response = await axios.post(`/v1/support/${ticketId}/answer`, 
                { answer },
                { params: { adminNic: user.nic } }
            );
            setTickets(prev => prev.map(ticket => 
                ticket.id === ticketId ? response.data : ticket
            ));
            return response.data;
        } catch (err) {
            throw err.response?.data?.message || 'Failed to answer ticket';
        } finally {
            setLoading(false);
        }
    };

    const closeTicket = async (ticketId) => {
        if (!user?.nic) {
            throw new Error('Please log in to close tickets');
        }

        try {
            setLoading(true);
            const response = await axios.put(`/v1/support/${ticketId}/close`);
            setTickets(prev => prev.map(ticket => 
                ticket.id === ticketId ? response.data : ticket
            ));
            return response.data;
        } catch (err) {
            throw err.response?.data?.message || 'Failed to close ticket';
        } finally {
            setLoading(false);
        }
    };

    const deleteTicket = async (ticketId) => {
        if (!user?.nic) {
            throw new Error('Please log in to delete tickets');
        }

        try {
            setLoading(true);
            await axios.delete(`/v1/support/${ticketId}`, {
                params: { userNic: user.nic }
            });
            setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
        } catch (err) {
            throw err.response?.data?.message || 'Failed to delete ticket';
        } finally {
            setLoading(false);
        }
    };

    // Fetch tickets when user changes
    useEffect(() => {
        if (user?.nic) {
            fetchTickets();
        } else {
            setTickets([]);
        }
    }, [user?.nic]);

    return {
        tickets,
        loading,
        error,
        createTicket,
        answerTicket,
        closeTicket,
        deleteTicket,
        refreshTickets: fetchTickets,
        user  // Return user for component access
    };
};