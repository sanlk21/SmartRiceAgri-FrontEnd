import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PropTypes from 'prop-types';

// Bid Alert Component
export const BidAlert = ({ type, title, description }) => {
  return (
    <Alert variant={type} className="mb-4">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

// Add PropTypes validation for BidAlert
BidAlert.propTypes = {
  type: PropTypes.oneOf(['success', 'info', 'warning', 'destructive']).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

// Bid Status Badge Component
export const BidStatusBadge = ({ status }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
};

// Add PropTypes validation for BidStatusBadge
BidStatusBadge.propTypes = {
  status: PropTypes.oneOf(['ACTIVE', 'COMPLETED', 'EXPIRED', 'CANCELLED']).isRequired,
};
