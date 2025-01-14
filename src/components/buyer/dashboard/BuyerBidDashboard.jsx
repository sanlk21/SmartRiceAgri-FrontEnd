import BidSummaryCard from '@/components/shared/bids/BidSummaryCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, ShoppingBag } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { bidService } from '../../../services/bidService';
import { formatBidAmount } from '../../../utils/bidUtils';

const StatCard = ({ title, value, icon: Icon, subtitle }) => (
    <Card>
        <CardContent className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
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
    subtitle: PropTypes.string,
};

const BuyerBidDashboard = () => {
    const [winningBids, setWinningBids] = useState([]);
    const [activeBids, setActiveBids] = useState([]);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [winningBidsData, activeBidsData] = await Promise.all([
                    bidService.getBuyerWinningBids(),
                    bidService.getAvailableBids({ status: 'ACTIVE' }),
                ]);
                setWinningBids(winningBidsData);
                setActiveBids(activeBidsData);

                setStats({
                    totalWinningBids: winningBidsData.length,
                    totalActiveBids: activeBidsData.length,
                    totalSpent: winningBidsData.reduce(
                        (total, bid) => total + bid.winningBidAmount * bid.quantity,
                        0
                    ),
                    activeBidsValue: activeBidsData.reduce(
                        (total, bid) => total + bid.minimumPrice * bid.quantity,
                        0
                    ),
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Winning Bids" value={stats?.totalWinningBids || 0} icon={Check} />
                <StatCard title="Active Bids" value={stats?.totalActiveBids || 0} icon={Clock} />
                <StatCard
                    title="Total Spent"
                    value={formatBidAmount(stats?.totalSpent || 0)}
                    icon={ShoppingBag}
                />
                <StatCard
                    title="Active Bids Value"
                    value={formatBidAmount(stats?.activeBidsValue || 0)}
                    icon={Clock}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Winning Bids</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {winningBids.slice(0, 5).map((bid) => (
                                <BidSummaryCard
                                    key={bid.id}
                                    bid={bid}
                                    onAction={() => window.open(`/bids/${bid.id}`, '_blank')}
                                    actionLabel="View Details"
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Available Bids</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activeBids.slice(0, 5).map((bid) => (
                                <BidSummaryCard
                                    key={bid.id}
                                    bid={bid}
                                    onAction={() => window.open(`/bids/${bid.id}`, '_blank')}
                                    actionLabel="Place Bid"
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default BuyerBidDashboard;
