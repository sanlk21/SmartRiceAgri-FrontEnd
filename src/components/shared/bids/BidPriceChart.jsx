import { websocketService } from '@/api/websocket/socket'; // Import websocketService
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatBidAmount } from '@/utils/bidUtils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
    Legend,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const BidPriceChart = ({ offers, minimumPrice, bidId }) => {
    const [chartData, setChartData] = useState([]);
    const [stats, setStats] = useState({
        highestBid: 0,
        averageBid: 0,
        bidCount: 0,
        trend: 'neutral',
    });

    // Initialize chart data from props
    useEffect(() => {
        const initialData = offers.map((offer) => ({
            time: new Date(offer.bidDate).toLocaleString(),
            amount: offer.amount,
            movingAverage: calculateMovingAverage(offers, offer),
        }));
        setChartData(initialData);
        updateStats(initialData);
    }, [offers]);

    // Subscribe to real-time updates
    useEffect(() => {
        const handleBidUpdate = (data) => {
            if (data.bidId === bidId) {
                setChartData((prevData) => {
                    const newData = [
                        ...prevData,
                        {
                            time: new Date(data.timestamp).toLocaleString(),
                            amount: data.amount,
                            movingAverage: calculateMovingAverage([...prevData, data], data),
                        },
                    ];
                    updateStats(newData);
                    return newData;
                });
            }
        };

        const unsubscribe = websocketService.subscribe('bidUpdates', handleBidUpdate);
        return () => unsubscribe();
    }, [bidId]);

    const calculateMovingAverage = (data, currentPoint) => {
        const window = 5; // 5-point moving average
        const index = data.indexOf(currentPoint);
        if (index < window - 1) return null;

        const sum = data
            .slice(index - window + 1, index + 1)
            .reduce((acc, point) => acc + (point.amount || 0), 0);
        return sum / window;
    };

    const updateStats = (data) => {
        const amounts = data.map((d) => d.amount);
        const highestBid = Math.max(...amounts);
        const averageBid = amounts.reduce((a, b) => a + b, 0) / amounts.length;
        const trend =
            data.length > 1
                ? data[data.length - 1].amount > data[data.length - 2].amount
                    ? 'up'
                    : 'down'
                : 'neutral';

        setStats({
            highestBid,
            averageBid,
            bidCount: data.length,
            trend,
        });
    };

    if (chartData.length === 0) return null;

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border rounded-lg shadow-lg">
                    <p className="font-medium">{formatBidAmount(payload[0].value)}</p>
                    {payload[1]?.value && (
                        <p className="text-gray-500">
                            Average: {formatBidAmount(payload[1].value)}
                        </p>
                    )}
                    <p className="text-sm text-gray-400">{payload[0].payload.time}</p>
                </div>
            );
        }
        return null;
    };

    // Prop validation for CustomTooltip
    CustomTooltip.propTypes = {
        active: PropTypes.bool,
        payload: PropTypes.arrayOf(
            PropTypes.shape({
                value: PropTypes.number.isRequired,
                payload: PropTypes.shape({
                    time: PropTypes.string.isRequired,
                }),
            })
        ),
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                        Bid Price Trend
                        {stats.trend === 'up' && <TrendingUp className="h-5 w-5 text-green-500" />}
                        {stats.trend === 'down' && <TrendingDown className="h-5 w-5 text-red-500" />}
                    </CardTitle>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Highest Bid</p>
                            <p className="font-medium">{formatBidAmount(stats.highestBid)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Average</p>
                            <p className="font-medium">{formatBidAmount(stats.averageBid)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Total Bids</p>
                            <p className="font-medium">{stats.bidCount}</p>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <XAxis
                                dataKey="time"
                                tick={{ fontSize: 12 }}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                domain={[
                                    minimumPrice * 0.9,
                                    (dataMax) => Math.max(dataMax * 1.1, minimumPrice * 1.1),
                                ]}
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => formatBidAmount(value)}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <ReferenceLine
                                y={minimumPrice}
                                stroke="#dc2626"
                                strokeDasharray="3 3"
                                label={{ value: 'Minimum Price', position: 'top' }}
                            />
                            <Line
                                name="Bid Amount"
                                type="monotone"
                                dataKey="amount"
                                stroke="#2563eb"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                name="Moving Average"
                                type="monotone"
                                dataKey="movingAverage"
                                stroke="#16a34a"
                                strokeWidth={1}
                                dot={false}
                                strokeDasharray="5 5"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

// Validate props
BidPriceChart.propTypes = {
    offers: PropTypes.arrayOf(
        PropTypes.shape({
            bidDate: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
        })
    ).isRequired,
    minimumPrice: PropTypes.number.isRequired,
    bidId: PropTypes.string.isRequired,
};

export default BidPriceChart;
