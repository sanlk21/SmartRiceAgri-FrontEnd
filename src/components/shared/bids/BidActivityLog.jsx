import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { bidService } from '@/services/bidService';
import { formatBidAmount } from '@/utils/bidUtils'; // Ensure this path is correct
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const BidActivityLog = ({ bidId }) => {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await bidService.getBidActivities(bidId);
                setActivities(data);
            } catch (err) {
                setError('Failed to load bid activities');
                console.error('Error fetching bid activities:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivities();

        // Subscribe to real-time updates
        const unsubscribe = bidService.subscribeToBidActivities(bidId, (newActivity) => {
            setActivities((prev) => [newActivity, ...prev]);
        });

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [bidId]);

    const getActivityColor = (type) => {
        switch (type) {
            case 'BID_PLACED':
                return 'bg-blue-500';
            case 'BID_ACCEPTED':
                return 'bg-green-500';
            case 'BID_REJECTED':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getActivityTitle = (type) => {
        switch (type) {
            case 'BID_PLACED':
                return 'Bid Placed';
            case 'BID_ACCEPTED':
                return 'Bid Accepted';
            case 'BID_REJECTED':
                return 'Bid Rejected';
            default:
                return 'Activity';
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Activity History</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Loading activities...</p>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Activity History</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-red-500">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg">
                            <div
                                className={`w-2 h-2 mt-2 rounded-full ${getActivityColor(activity.type)}`}
                            />
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <p className="font-medium">{getActivityTitle(activity.type)}</p>
                                    <span className="text-sm text-gray-500">
                                        {format(new Date(activity.timestamp), 'PP p')}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                {activity.data && (
                                    <div className="mt-2 text-sm text-gray-500">
                                        {activity.type === 'BID_PLACED' && (
                                            <p>Bid Amount: {formatBidAmount(activity.data.amount)}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {activities.length === 0 && (
                        <p className="text-center text-gray-500">No activity recorded yet</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

// PropTypes for validation
BidActivityLog.propTypes = {
    bidId: PropTypes.string.isRequired,
};

export default BidActivityLog;
