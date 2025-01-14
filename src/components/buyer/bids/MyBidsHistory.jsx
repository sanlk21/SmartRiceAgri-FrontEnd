import BidHistoryTable from '@/components/shared/bids/BidHistoryTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { bidService } from '../../../services/bidService';

const MyBidsHistory = () => {
    const [bids, setBids] = useState([]);
    const [filters, setFilters] = useState({
        status: 'all',
        timeRange: '30d',
    });

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const data = await bidService.getBuyerWinningBids();
                setBids(data);
            } catch (error) {
                console.error('Error fetching bid history:', error);
            }
        };
        fetchBids();
    }, [filters]);

    const filteredBids = bids.filter((bid) => {
        if (filters.status !== 'all' && bid.status !== filters.status) {
            return false;
        }
        return true;
    });

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Bid History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-4">
                        <Select
                            value={filters.status}
                            onValueChange={(value) => setFilters({ ...filters, status: value })}
                        >
                            <option value="all">All Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="EXPIRED">Expired</option>
                        </Select>

                        <Select
                            value={filters.timeRange}
                            onValueChange={(value) => setFilters({ ...filters, timeRange: value })}
                        >
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="all">All time</option>
                        </Select>
                    </div>

                    <BidHistoryTable bids={filteredBids} />
                </CardContent>
            </Card>
        </div>
    );
};

export default MyBidsHistory;
