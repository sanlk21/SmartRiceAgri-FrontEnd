import { Activity, DollarSign, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import StatCard from '../../components/shared/StatCard';
import { bidService } from '../../services/bidService';

const FarmerBidStatistics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await bidService.getBidStatistics();
        setStats(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Bid Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Active Bids"
          value={stats.totalActiveBids}
          icon={<Activity className="h-8 w-8" />}
        />
        <StatCard
          title="Total Revenue"
          value={`Rs.${stats.totalRevenue.toFixed(2)}`}
          icon={<DollarSign className="h-8 w-8" />}
        />
        <StatCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          icon={<TrendingUp className="h-8 w-8" />}
        />
      </div>
    </div>
  );
};

export default FarmerBidStatistics;
