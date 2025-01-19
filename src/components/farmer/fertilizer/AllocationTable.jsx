import PropTypes from 'prop-types';

const AllocationTable = ({ allocations }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Allocation Details</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 px-4 py-2">Date</th>
            <th className="border border-gray-200 px-4 py-2">Amount (kg)</th>
            <th className="border border-gray-200 px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {allocations.map((allocation) => (
            <tr key={allocation.id} className="border-t">
              <td className="border border-gray-200 px-4 py-2">{allocation.date}</td>
              <td className="border border-gray-200 px-4 py-2">{allocation.allocatedAmount}</td>
              <td className="border border-gray-200 px-4 py-2">{allocation.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

AllocationTable.propTypes = {
  allocations: PropTypes.array.isRequired,
};

export default AllocationTable;
