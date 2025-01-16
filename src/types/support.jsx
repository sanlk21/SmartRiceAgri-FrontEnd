import PropTypes from 'prop-types';

export const TicketStatus = {
    OPEN: 'OPEN',
    ANSWERED: 'ANSWERED',
    CLOSED: 'CLOSED'
};

export const TicketPropType = PropTypes.shape({
    id: PropTypes.number.isRequired,
    subject: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    answer: PropTypes.string,
    status: PropTypes.oneOf(Object.values(TicketStatus)).isRequired,
    createdAt: PropTypes.string.isRequired,
    answeredAt: PropTypes.string,
    userNic: PropTypes.string.isRequired,
    adminNic: PropTypes.string
});