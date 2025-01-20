// src/pages/support/UserSupportPage.jsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupport } from '@/hooks/useSupport';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, MessageSquare } from 'lucide-react';
import React from 'react';

const CreateTicketForm = ({ onSubmit, loading, error }) => {
    const [formData, setFormData] = React.useState({
        subject: '',
        question: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
            setFormData({ subject: '', question: '' });
        } catch (err) {
            console.error('Failed to create ticket:', err);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Support Ticket</CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Subject</label>
                        <input
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter ticket subject"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Question</label>
                        <textarea
                            value={formData.question}
                            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                            className="w-full p-2 border rounded-md min-h-[100px]"
                            placeholder="Describe your issue in detail"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || !formData.subject || !formData.question}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <MessageSquare className="h-4 w-4 mr-2" />
                        )}
                        Submit Ticket
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export const UserSupportPage = () => {
    const {
        tickets,
        loading,
        error,
        createTicket,
        user
    } = useSupport();

    if (!user) {
        return (
            <Alert variant="destructive" className="m-4">
                <AlertTitle>Authentication Required</AlertTitle>
                <AlertDescription>
                    Please log in to access the support system.
                </AlertDescription>
            </Alert>
        );
    }

    const getStatusBadge = (status) => {
        const styles = {
            OPEN: 'bg-yellow-100 text-yellow-800',
            ANSWERED: 'bg-green-100 text-green-800',
            CLOSED: 'bg-gray-100 text-gray-800'
        };
        return <Badge className={styles[status] || 'bg-gray-100'}>{status}</Badge>;
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <CreateTicketForm 
                onSubmit={createTicket} 
                loading={loading}
                error={error}
            />
            
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
            ) : (
                <div className="space-y-4">
                    {tickets.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No support tickets found. Create one above to get started!
                        </div>
                    ) : (
                        tickets.map(ticket => (
                            <Card key={ticket.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                                            <CardDescription>
                                                Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                                            </CardDescription>
                                        </div>
                                        {getStatusBadge(ticket.status)}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <p className="font-medium text-sm text-gray-500">Question:</p>
                                        <p className="mt-1">{ticket.question}</p>
                                    </div>
                                    {ticket.answer && (
                                        <div className="bg-blue-50 p-3 rounded-md">
                                            <p className="font-medium text-sm text-blue-500">Answer:</p>
                                            <p className="mt-1">{ticket.answer}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default UserSupportPage;