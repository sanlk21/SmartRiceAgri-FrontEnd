import PropTypes from 'prop-types';

const AllocationTable = ({ allocations }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-500 border border-gray-300">
              Farmer NIC
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-500 border border-gray-300">
              Allocated Amount (kg)
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-500 border border-gray-300">
              Status
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-500 border border-gray-300">
              Distribution Date
            </th>
          </tr>
        </thead>
        <tbody>
          {allocations.map((allocation) => (
            <tr key={allocation.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border border-gray-300">{allocation.farmerNic}</td>
              <td className="px-4 py-2 border border-gray-300">{allocation.allocatedAmount}</td>
              <td className="px-4 py-2 border border-gray-300">{allocation.status}</td>
              <td className="px-4 py-2 border border-gray-300">
                {allocation.distributionDate || 'Not Set'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

AllocationTable.propTypes = {
  allocations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      farmerNic: PropTypes.string.isRequired,
      allocatedAmount: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      distributionDate: PropTypes.string,
    })
  ).isRequired,
};

export default AllocationTable;
