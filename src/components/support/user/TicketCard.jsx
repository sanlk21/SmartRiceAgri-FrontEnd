import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupport } from '@/hooks/useSupport';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useState } from 'react';

const TicketCard = ({ ticket }) => {
    const { closeTicket } = useSupport();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClose = async (e) => {
        e.stopPropagation(); // Prevent card expansion when clicking close
        try {
            await closeTicket(ticket.id);
        } catch (error) {
            console.error('Error closing ticket:', error);
        }
    };

    const getVariantByStatus = (status) => {
        switch (status) {
            case 'OPEN':
                return 'secondary';
            case 'ANSWERED':
                return 'success';
            default:
                return 'default';
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
                            <Badge variant={getVariantByStatus(ticket.status)}>
                                {ticket.status}
                            </Badge>
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                            Created {format(new Date(ticket.createdAt), 'PPp')}
                        </p>
                    </div>
                    {ticket.status === 'OPEN' && (
                        <Button 
                            variant="ghost"
                            size="sm"
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                    )}
                </div>
            </CardHeader>
            {isExpanded && (
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-medium mb-2">Question</h4>
                        <p className="text-gray-600">{ticket.question}</p>
                    </div>
                    {ticket.answer && (
                        <div>
                            <h4 className="font-medium mb-2">Answer</h4>
                            <p className="text-gray-600">{ticket.answer}</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Answered on {format(new Date(ticket.answeredAt), 'PPp')}
                            </p>
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
};

TicketCard.propTypes = {
    ticket: PropTypes.shape({
        id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        subject: PropTypes.string.isRequired,
        question: PropTypes.string.isRequired,
        status: PropTypes.oneOf(['OPEN', 'ANSWERED', 'CLOSED']).isRequired,
        createdAt: PropTypes.string.isRequired,
        answer: PropTypes.string,
        answeredAt: PropTypes.string,
    }).isRequired
};

export default TicketCard;