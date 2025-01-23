// Frontend Component: OrderContainer.jsx

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import orderApi from "../api/orderApi";
import OrderList from "../OrderList";

const OrderContainer = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderApi.getFarmerOrders(user.nic);
        setOrders(data); // Update state with fetched orders
        setLoading(false); // Stop loading spinner
      } catch (err) {
        setError(err.message); // Store error message
        setLoading(false); // Stop loading spinner
      }
    };

    fetchOrders();
  }, [user.nic]);

  if (loading) {
    return (
      <div className="orders-container flex flex-col items-center justify-center min-h-[400px]">
        <div className="spinner animate-spin rounded-full h-10 w-10 border-t-2 border-gray-900"></div>
        <p className="text-gray-500 ml-4">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-container flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-lg font-medium text-red-500">{error}</p>
        <p className="text-sm text-gray-500">Try again later or contact support.</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-container flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-lg font-medium text-gray-600">No Orders Found</p>
        <p className="text-sm text-gray-500">Your orders will appear here once available.</p>
      </div>
    );
  }

  return <OrderList orders={orders} />;
};

OrderContainer.propTypes = {
  user: PropTypes.shape({
    nic: PropTypes.string.isRequired,
  }).isRequired,
};

export default OrderContainer;
