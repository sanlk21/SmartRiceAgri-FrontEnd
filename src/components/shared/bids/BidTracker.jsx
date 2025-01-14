import BidStatusBadge from '@/components/shared/bids/BidStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const BidTracker = ({ bid }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const calculateProgress = () => {
            const startDate = new Date(bid.postedDate);
            const endDate = new Date(bid.expiryDate);
            const currentDate = new Date();

            const total = endDate.getTime() - startDate.getTime();
            const elapsed = currentDate.getTime() - startDate.getTime();

            return Math.min(Math.max((elapsed / total) * 100, 0), 100);
        };

        setProgress(calculateProgress());

        const interval = setInterval(() => {
            setProgress(calculateProgress());
        }, 60000);

        return () => clearInterval(interval);
    }, [bid]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-500';
            case 'COMPLETED':
                return 'bg-blue-500';
            case 'EXPIRED':
                return 'bg-gray-500';
            case 'CANCELLED':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Bid Progress</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span>Posted: {format(new Date(bid.postedDate), 'PPp')}</span>
                        <span>Expires: {format(new Date(bid.expiryDate), 'PPp')}</span>
                    </div>
                    <Progress value={progress} className={getStatusColor(bid.status)} />
                    <div className="flex justify-between items-center">
                        <BidStatusBadge status={bid.status} />
                        {bid.status === 'ACTIVE' && (
                            <span className="text-sm">
                                {100 - Math.round(progress)}% time remaining
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// PropTypes validation
BidTracker.propTypes = {
    bid: PropTypes.shape({
        postedDate: PropTypes.string.isRequired,
        expiryDate: PropTypes.string.isRequired,
        status: PropTypes.oneOf(['ACTIVE', 'COMPLETED', 'EXPIRED', 'CANCELLED']).isRequired,
    }).isRequired,
};

export default BidTracker;
