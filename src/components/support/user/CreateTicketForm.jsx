import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSupport } from '@/hooks/useSupport';
import PropTypes from 'prop-types';
import { useState } from 'react';

const CreateTicketForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        subject: '',
        question: ''
    });
    const { createTicket } = useSupport();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await createTicket(formData);
            onClose();
        } catch (error) {
            console.error('Error creating ticket:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Support Ticket</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                            Subject
                        </label>
                        <Input
                            id="subject"
                            value={formData.subject}
                            onChange={handleChange('subject')}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="question" className="text-sm font-medium">
                            Question
                        </label>
                        <Textarea
                            id="question"
                            value={formData.question}
                            onChange={handleChange('question')}
                            required
                            className="min-h-[100px]"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Ticket'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

CreateTicketForm.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default CreateTicketForm;