import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const OrderList = ({ orders, onPaymentClick, userRole }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAYMENT_COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  };

  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <div className="divide-y">
      {orders.map((order) => (
        <div key={order.id} className="py-4 first:pt-0 last:pb-0">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium cursor-pointer hover:text-primary" 
                 onClick={() => handleViewDetails(order.id)}>
                Order #{order.orderNumber}
              </p>
              <p className="text-sm text-gray-500">
                Quantity: {order.quantity}kg at Rs.{order.pricePerKg}/kg
              </p>
              <p className="text-sm text-gray-500">
                Total Amount: Rs.{order.totalAmount}
              </p>
              <p className="text-sm text-gray-500">
                Order Date: {formatDate(order.orderDate)}
              </p>
              {order.status === 'PENDING_PAYMENT' && order.paymentDeadline && (
                <p className="text-sm text-red-500">
                  Payment Deadline: {getTimeRemaining(order.paymentDeadline)}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
              {userRole === 'BUYER' && order.status === 'PENDING_PAYMENT' && (
                <Button 
                  onClick={() => onPaymentClick(order)}
                  size="sm"
                  variant="outline"
                >
                  Make Payment
                </Button>
              )}
              <Button
                onClick={() => handleViewDetails(order.id)}
                size="sm"
                variant="ghost"
              >
                View Details
              </Button>
            </div>
          </div>

          {userRole === 'BUYER' && order.status === 'PENDING_PAYMENT' && (
            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <p className="text-sm font-medium">Payment Details:</p>
              <p className="text-sm text-gray-500">
                Bank: {order.farmerBankName}
              </p>
              <p className="text-sm text-gray-500">
                Branch: {order.farmerBankBranch}
              </p>
              <p className="text-sm text-gray-500">
                Account: {order.farmerAccountNumber}
              </p>
              <p className="text-sm text-gray-500">
                Account Holder: {order.farmerAccountHolderName}
              </p>
            </div>
          )}

          {order.status === 'PAYMENT_COMPLETED' && (
            <div className="mt-4 bg-green-50 p-4 rounded-md">
              <p className="text-sm font-medium">Payment Information:</p>
              <p className="text-sm text-gray-500">
                Method: {order.paymentMethod}
              </p>
              <p className="text-sm text-gray-500">
                Reference: {order.paymentReference}
              </p>
              <p className="text-sm text-gray-500">
                Date: {formatDate(order.paymentDate)}
              </p>
            </div>
          )}
        </div>
      ))}
      {orders.length === 0 && (
        <p className="text-center text-gray-500 py-4">No orders found</p>
      )}
    </div>
  );
};

OrderList.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      orderNumber: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      pricePerKg: PropTypes.number.isRequired,
      totalAmount: PropTypes.number.isRequired,
      orderDate: PropTypes.string.isRequired,
      paymentDeadline: PropTypes.string,
      status: PropTypes.string.isRequired,
      farmerBankName: PropTypes.string,
      farmerBankBranch: PropTypes.string,
      farmerAccountNumber: PropTypes.string,
      farmerAccountHolderName: PropTypes.string,
      paymentMethod: PropTypes.string,
      paymentReference: PropTypes.string,
      paymentDate: PropTypes.string,
    })
  ).isRequired,
  onPaymentClick: PropTypes.func.isRequired,
  userRole: PropTypes.oneOf(['FARMER', 'BUYER', 'ADMIN']).isRequired,
};

export default OrderList;