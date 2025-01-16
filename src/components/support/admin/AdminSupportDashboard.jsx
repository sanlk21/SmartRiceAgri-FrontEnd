import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSupport } from '@/hooks/useSupport';
import { AlertCircle, CheckCircle, Circle } from 'lucide-react';
import { useState } from 'react';
import { AdminTicketList } from './AdminTicketList';

export const AdminSupportDashboard = () => {
    const [filter, setFilter] = useState('OPEN'); // 'OPEN', 'ALL'
    const { tickets, loading, error } = useSupport();

    const filteredTickets = tickets.filter((ticket) =>
        filter === 'OPEN' ? ticket.status === 'OPEN' : true
    );

    const stats = {
        total: tickets.length,
        open: tickets.filter((t) => t.status === 'OPEN').length,
        answered: tickets.filter((t) => t.status === 'ANSWERED').length,
        closed: tickets.filter((t) => t.status === 'CLOSED').length,
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Support Ticket Management</h1>
                <div className="flex gap-2">
                    <Button
                        variant={filter === 'OPEN' ? 'default' : 'outline'}
                        onClick={() => setFilter('OPEN')}
                    >
                        Open Tickets
                    </Button>
                    <Button
                        variant={filter === 'ALL' ? 'default' : 'outline'}
                        onClick={() => setFilter('ALL')}
                    >
                        All Tickets
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Total Tickets</p>
                            <Circle className="h-4 w-4 text-gray-400" />
                        </div>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Open Tickets</p>
                            <AlertCircle className="h-4 w-4 text-yellow-400" />
                        </div>
                        <p className="text-2xl font-bold">{stats.open}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Answered</p>
                            <CheckCircle className="h-4 w-4 text-green-400" />
                        </div>
                        <p className="text-2xl font-bold">{stats.answered}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Closed</p>
                            <Circle className="h-4 w-4 text-gray-400" />
                        </div>
                        <p className="text-2xl font-bold">{stats.closed}</p>
                    </CardContent>
                </Card>
            </div>

            <AdminTicketList tickets={filteredTickets} />
        </div>
    );
};
