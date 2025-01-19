import PropTypes from 'prop-types';
//mport React from 'react';

const AllocationList = ({ allocations = [], currentPage = 0, totalPages = 0, onPageChange = () => {} }) => {
  // Fallback for undefined allocations
  if (!allocations || allocations.length === 0) {
    return <div>No allocations found.</div>;
  }

  return (
    <div>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Farmer NIC</th>
            <th className="border border-gray-300 px-4 py-2">Amount</th>
            <th className="border border-gray-300 px-4 py-2">Season</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {allocations.map((allocation) => (
            <tr key={allocation.id}>
              <td className="border border-gray-300 px-4 py-2">{allocation.farmerNic}</td>
              <td className="border border-gray-300 px-4 py-2">{allocation.allocatedAmount} kg</td>
              <td className="border border-gray-300 px-4 py-2">{allocation.season}</td>
              <td className="border border-gray-300 px-4 py-2">{allocation.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}>
          Previous
        </button>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1}>
          Next
        </button>
      </div>
    </div>
  );
};

AllocationList.propTypes = {
  allocations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      farmerNic: PropTypes.string.isRequired,
      allocatedAmount: PropTypes.number.isRequired,
      season: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ),
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
};

export default AllocationList;
