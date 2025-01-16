// src/hooks/useSupport.js
import { supportApi } from '@/api/supportApi';
import { useAuth } from '@/hooks/useAuth';
import { useCallback, useEffect, useState } from 'react';

export const useSupport = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const fetchTickets = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = user?.role === 'ADMIN' 
                ? await supportApi.getOpenTickets()
                : await supportApi.getUserTickets();
            setTickets(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching tickets:', err);
        } finally {
            setLoading(false);
        }
    }, [user?.role]);

    const createTicket = async (ticketData) => {
        try {
            setError(null);
            const newTicket = await supportApi.createTicket(ticketData);
            setTickets(prev => [newTicket, ...prev]);
            return newTicket;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const answerTicket = async (ticketId, answer) => {
        try {
            setError(null);
            const updatedTicket = await supportApi.answerTicket(ticketId, answer);
            setTickets(prev => prev.map(ticket => 
                ticket.id === ticketId ? updatedTicket : ticket
            ));
            return updatedTicket;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const closeTicket = async (ticketId) => {
        try {
            setError(null);
            const updatedTicket = await supportApi.closeTicket(ticketId);
            setTickets(prev => prev.map(ticket => 
                ticket.id === ticketId ? updatedTicket : ticket
            ));
            return updatedTicket;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteTicket = async (ticketId) => {
        try {
            setError(null);
            await supportApi.deleteTicket(ticketId);
            setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
        } catch (err) {
            setError(err.message);
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
        closeTicket,
        deleteTicket,
        refreshTickets: fetchTickets
    };
};