// src/components/shared/analytics/BidAnalytics.jsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatBidAmount } from '@/utils/bidUtils';
import { Activity, BarChart3, TrendingDown, TrendingUp } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const BidAnalytics = ({ bidData, timeRange = '7d' }) => {
    const [analytics, setAnalytics] = useState({
        totalBids: 0,
        successRate: 0,
        averageBidAmount: 0,
        winningBids: 0,
        priceHistory: [],
        bidDistribution: [],
        volumeByVariety: []
    });

    useEffect(() => {
        // Calculate analytics from bidData
        const calculateAnalytics = () => {
            const totalBids = bidData.length;
            const winningBids = bidData.filter(bid => bid.status === 'WON').length;
            const avgAmount = bidData.reduce((acc, bid) => acc + bid.amount, 0) / totalBids;

            // Calculate price history
            const priceHistory = bidData
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                .map(bid => ({
                    date: new Date(bid.timestamp).toLocaleDateString(),
                    price: bid.amount
                }));

            // Calculate distribution by rice variety
            const varietyDistribution = bidData.reduce((acc, bid) => {
                acc[bid.riceVariety] = (acc[bid.riceVariety] || 0) + 1;
                return acc;
            }, {});

            setAnalytics({
                totalBids,
                successRate: (winningBids / totalBids) * 100,
                averageBidAmount: avgAmount,
                winningBids,
                priceHistory,
                bidDistribution: Object.entries(varietyDistribution).map(([variety, count]) => ({
                    variety,
                    count
                }))
            });
        };

        calculateAnalytics();
    }, [bidData, timeRange]);

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500">Total Bids</p>
                                <p className="text-2xl font-bold">{analytics.totalBids}</p>
                            </div>
                            <Activity className="h-5 w-5 text-gray-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500">Success Rate</p>
                                <p className="text-2xl font-bold">{analytics.successRate.toFixed(1)}%</p>
                            </div>
                            <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500">Average Bid</p>
                                <p className="text-2xl font-bold">{formatBidAmount(analytics.averageBidAmount)}</p>
                            </div>
                            <BarChart3 className="h-5 w-5 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500">Winning Bids</p>
                                <p className="text-2xl font-bold">{analytics.winningBids}</p>
                            </div>
                            <TrendingDown className="h-5 w-5 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Price History Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Price History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics.priceHistory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis tickFormatter={(value) => formatBidAmount(value)} />
                                <Tooltip 
                                    formatter={(value) => formatBidAmount(value)}
                                    labelFormatter={(label) => `Date: ${label}`}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="price" 
                                    stroke="#2563eb" 
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Bid Distribution Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Bid Distribution by Rice Variety</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.bidDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="variety" />
                                <YAxis />
                                <Tooltip />
                                <Bar 
                                    dataKey="count" 
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Add PropTypes validation
BidAnalytics.propTypes = {
    bidData: PropTypes.arrayOf(
        PropTypes.shape({
            timestamp: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
            status: PropTypes.string.isRequired,
            riceVariety: PropTypes.string.isRequired,
        })
    ).isRequired,
    timeRange: PropTypes.string,
};

export default BidAnalytics;
