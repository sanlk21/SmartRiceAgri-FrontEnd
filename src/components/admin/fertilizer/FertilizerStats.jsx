import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle, Package, Users } from 'lucide-react';
import PropTypes from 'prop-types';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

const FertilizerStats = ({ stats = {} }) => {
  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  const pieData = [
    { name: 'Collected', value: stats?.collectedCount || 0 },
    { name: 'Pending', value: stats?.pendingCount || 0 },
    { name: 'Expired', value: stats?.expiredCount || 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Allocations</p>
                <p className="text-2xl font-bold">{stats?.totalAllocations || 0}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Farmers</p>
                <p className="text-2xl font-bold">{stats?.activeFarmers || 0}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Season</p>
                <p className="text-2xl font-bold">{stats?.currentSeason || '-'}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                <p className="text-2xl font-bold">
                  {stats?.collectionRate ? `${stats.collectionRate}%` : '0%'}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Allocation Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

FertilizerStats.propTypes = {
  stats: PropTypes.shape({
    totalAllocations: PropTypes.number,
    activeFarmers: PropTypes.number,
    currentSeason: PropTypes.string,
    collectionRate: PropTypes.number,
    collectedCount: PropTypes.number,
    pendingCount: PropTypes.number,
    expiredCount: PropTypes.number
  })
};

FertilizerStats.defaultProps = {
  stats: {
    totalAllocations: 0,
    activeFarmers: 0,
    currentSeason: '-',
    collectionRate: 0,
    collectedCount: 0,
    pendingCount: 0,
    expiredCount: 0
  }
};

export default FertilizerStats;