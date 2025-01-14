import BidSummaryCard from '@/components/shared/bids/BidSummaryCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, DollarSign, Package, TrendingUp } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { bidService } from '../../../services/bidService';
import { formatBidAmount } from '../../../utils/bidUtils';

const StatCard = ({ title, value, icon: Icon, trend }) => (
    <Card>
        <CardContent className="p-6">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                    {trend && (
                        <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {trend > 0 ? '+' : ''}{trend}% from last month
                        </p>
                    )}
                </div>
                <Icon className="h-8 w-8 text-gray-400" />
            </div>
        </CardContent>
    </Card>
);

StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.elementType.isRequired,
    trend: PropTypes.number,
};

const FarmerBidDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentBids, setRecentBids] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsData, bidsData] = await Promise.all([
                    bidService.getBidStatistics(),
                    bidService.getFarmerBids(),
                ]);
                setStats(statsData);
                setRecentBids(bidsData.slice(0, 5)); // Get last 5 bids
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Active Bids" value={stats?.totalActiveBids || 0} icon={Activity} />
                <StatCard
                    title="Total Revenue"
                    value={formatBidAmount(stats?.totalRevenue || 0)}
                    icon={DollarSign}
                    trend={stats?.revenueTrend}
                />
                <StatCard
                    title="Total Quantity Sold"
                    value={`${stats?.totalQuantity || 0}kg`}
                    icon={Package}
                />
                <StatCard
                    title="Success Rate"
                    value={`${stats?.successRate || 0}%`}
                    icon={TrendingUp}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Bids</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentBids.map((bid) => (
                            <BidSummaryCard
                                key={bid.id}
                                bid={bid}
                                actionLabel={bid.status === 'ACTIVE' ? 'View Offers' : null}
                                onAction={(bid) => window.open(`/bids/${bid.id}`, '_blank')}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FarmerBidDashboard;
