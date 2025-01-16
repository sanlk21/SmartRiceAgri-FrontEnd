// src/components/support/user/TicketList.jsx
//import React from 'react';
import PropTypes from 'prop-types';
import TicketCard from './TicketCard';

export const TicketList = ({ tickets }) => {
    return (
        <div className="space-y-4">
            {tickets.length === 0 ? (
                <p className="text-center text-gray-500">No tickets found</p>
            ) : (
                tickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                ))
            )}
        </div>
    );
};

TicketList.propTypes = {
    tickets: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            subject: PropTypes.string.isRequired,
            question: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
            createdAt: PropTypes.string.isRequired,
            answer: PropTypes.string,
            answeredAt: PropTypes.string,
        })
    ).isRequired,
};
