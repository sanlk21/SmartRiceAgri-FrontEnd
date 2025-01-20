// src/components/support/user/CreateTicketForm.jsx
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import React, { useState } from 'react';

export const CreateTicketForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({ subject: '', question: '' });
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await onSubmit(formData);
            setFormData({ subject: '', question: '' });
        } catch (err) {
            setError(err.message || 'Failed to create ticket');
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
                        {error}
                    </Alert>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Subject</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            value={formData.subject}
                            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                            placeholder="Enter ticket subject"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Question</label>
                        <textarea
                            className="w-full p-2 border rounded-md min-h-[100px]"
                            value={formData.question}
                            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                            placeholder="Describe your issue in detail"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading || !formData.subject || !formData.question}
                        className="w-full"
                    >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Submit Ticket
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};