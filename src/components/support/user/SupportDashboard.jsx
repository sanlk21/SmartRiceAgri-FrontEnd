// src/components/support/user/SupportDashboard.jsx
import { Button } from '@/components/ui/button';
import { useSupport } from '@/hooks/useSupport';
import { useState } from 'react';
import CreateTicketForm from './CreateTicketForm';
import { TicketList } from './TicketList';

export const SupportDashboard = () => {
    const { tickets, loading, error } = useSupport();
    const [showCreateForm, setShowCreateForm] = useState(false);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Support Tickets</h1>
                <Button onClick={() => setShowCreateForm(true)}>
                    Create New Ticket
                </Button>
            </div>

            {showCreateForm && (
                <CreateTicketForm onClose={() => setShowCreateForm(false)} />
            )}

            <TicketList tickets={tickets} />
        </div>
    );
};
