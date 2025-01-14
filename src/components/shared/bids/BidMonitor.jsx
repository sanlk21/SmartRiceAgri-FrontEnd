//import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PropTypes from 'prop-types'; // For prop validation
import {
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'; // Ensure Recharts is installed and imported properly

const BidPriceChart = ({ offers, minimumPrice }) => {
    if (offers.length === 0) return null;

    const data = offers.map((offer) => ({
        time: new Date(offer.bidDate).toLocaleString(),
        amount: offer.amount,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bid Price Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis dataKey="time" />
                            <YAxis domain={[minimumPrice, 'auto']} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#2563eb"
                                strokeWidth={2}
                            />
                            <ReferenceLine
                                y={minimumPrice}
                                stroke="#dc2626"
                                strokeDasharray="3 3"
                                label="Minimum Price"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

// Add prop validations
BidPriceChart.propTypes = {
    offers: PropTypes.arrayOf(
        PropTypes.shape({
            bidDate: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
        })
    ).isRequired,
    minimumPrice: PropTypes.number.isRequired,
};

export default BidPriceChart;
