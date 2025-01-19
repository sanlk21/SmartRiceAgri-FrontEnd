import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';

const AllocationChart = ({ allocations }) => {
  const data = {
    labels: allocations.map((a) => a.date),
    datasets: [
      {
        label: 'Fertilizer Allocations (kg)',
        data: allocations.map((a) => a.allocatedAmount),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
    ],
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium">Allocation History</h2>
      <Line data={data} />
    </div>
  );
};

// PropTypes validation
AllocationChart.propTypes = {
  allocations: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      allocatedAmount: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default AllocationChart;
