//import React from 'react';
import PropTypes from 'prop-types';
import { AdminTicketCard } from './AdminTicketCard';

export const AdminTicketList = ({ tickets }) => {
    return (
        <div className="space-y-4">
            {tickets.length === 0 ? (
                <p className="text-center text-gray-500">No tickets found</p>
            ) : (
                tickets.map((ticket) => (
                    <AdminTicketCard key={ticket.id} ticket={ticket} />
                ))
            )}
        </div>
    );
};

AdminTicketList.propTypes = {
    tickets: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            subject: PropTypes.string.isRequired,
            question: PropTypes.string.isRequired,
            userNic: PropTypes.string.isRequired,
            createdAt: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
            answer: PropTypes.string,
            answeredAt: PropTypes.string,
            adminNic: PropTypes.string,
        })
    ).isRequired,
};
