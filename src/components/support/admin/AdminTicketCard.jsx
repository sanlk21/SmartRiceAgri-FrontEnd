import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useSupport } from '@/hooks/useSupport';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useState } from 'react';

export const AdminTicketCard = ({ ticket }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [answer, setAnswer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { answerTicket } = useSupport();

    const handleAnswer = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await answerTicket(ticket.id, answer);
            setIsExpanded(false);
            setAnswer('');
        } catch (error) {
            console.error('Error answering ticket:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader
                className="cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            {ticket.subject}
                            <Badge
                                variant={
                                    ticket.status === 'OPEN'
                                        ? 'secondary'
                                        : ticket.status === 'ANSWERED'
                                        ? 'success'
                                        : 'default'
                                }
                            >
                                {ticket.status}
                            </Badge>
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                            From: {ticket.userNic} | Created: {format(new Date(ticket.createdAt), 'PPp')}
                        </p>
                    </div>
                </div>
            </CardHeader>
            {isExpanded && (
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-medium mb-2">Question</h4>
                        <p className="text-gray-600">{ticket.question}</p>
                    </div>
                    {ticket.status === 'OPEN' ? (
                        <form onSubmit={handleAnswer} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="answer" className="font-medium">
                                    Your Answer
                                </label>
                                <Textarea
                                    id="answer"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Type your answer here..."
                                    className="min-h-[100px]"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        ticket.answer && (
                            <div>
                                <h4 className="font-medium mb-2">Answer</h4>
                                <p className="text-gray-600">{ticket.answer}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Answered by: {ticket.adminNic} on {format(new Date(ticket.answeredAt), 'PPp')}
                                </p>
                            </div>
                        )
                    )}
                </CardContent>
            )}
        </Card>
    );
};

AdminTicketCard.propTypes = {
    ticket: PropTypes.shape({
        id: PropTypes.string.isRequired,
        subject: PropTypes.string.isRequired,
        question: PropTypes.string.isRequired,
        userNic: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        answer: PropTypes.string,
        answeredAt: PropTypes.string,
        adminNic: PropTypes.string,
    }).isRequired,
};
