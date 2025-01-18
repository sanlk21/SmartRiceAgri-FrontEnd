import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Calendar, CheckCircle, Package, TrendingUp, Users } from 'lucide-react';
import PropTypes from 'prop-types';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const FertilizerStats = ({ stats = {} }) => {
  const COLORS = {
    collected: '#10B981',
    pending: '#F59E0B',
    expired: '#EF4444'
  };

  const pieData = [
    { name: 'Collected', value: stats?.collectedCount || 0, color: COLORS.collected },
    { name: 'Pending', value: stats?.pendingCount || 0, color: COLORS.pending },
    { name: 'Expired', value: stats?.expiredCount || 0, color: COLORS.expired }
  ];

  const calculatePercentage = (value) => {
    const total = stats?.totalAllocations || 0;
    return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  };

  const progressValue = calculatePercentage(stats?.collectedCount || 0);

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
                <p className="text-xs text-gray-500 mt-1">
                  {stats?.totalAmount || 0} kg total
                </p>
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
                <p className="text-xs text-gray-500 mt-1">
                  {stats?.pendingFarmers || 0} pending
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                <p className="text-2xl font-bold">{progressValue}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats?.collectedAmount || 0} kg collected
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Season</p>
                <p className="text-2xl font-bold">{stats?.currentSeason || '-'}</p>
                <p className="text-xs text-gray-500 mt-1">{stats?.year}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution Status</CardTitle>
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
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Collection Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Collection Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Overall Progress</span>
                  <span>{progressValue}%</span>
                </div>
                <Progress value={parseFloat(progressValue)} className="h-2" />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Collected</span>
                  </div>
                  <span>{stats?.collectedCount || 0} allocations</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-yellow-500" />
                    <span>Pending</span>
                  </div>
                  <span>{stats?.pendingCount || 0} allocations</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span>Expired</span>
                  </div>
                  <span>{stats?.expiredCount || 0} allocations</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

FertilizerStats.propTypes = {
  stats: PropTypes.shape({
    totalAllocations: PropTypes.number,
    totalAmount: PropTypes.number,
    activeFarmers: PropTypes.number,
    pendingFarmers: PropTypes.number,
    currentSeason: PropTypes.string,
    year: PropTypes.number,
    collectedCount: PropTypes.number,
    collectedAmount: PropTypes.number,
    pendingCount: PropTypes.number,
    expiredCount: PropTypes.number
  })
};

export default FertilizerStats;