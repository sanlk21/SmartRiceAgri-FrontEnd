import { useEffect, useState } from 'react';
//import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { bidService } from '../../../services/bidService';
import BidCard from './BidCard';

const AvailableBids = () => {
  const [bids, setBids] = useState([]);
  const [filters, setFilters] = useState({
    riceVariety: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    sortBy: 'date',
    sortDirection: 'desc',
  });

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const data = await bidService.getAvailableBids(filters);
        setBids(data);
      } catch (error) {
        console.error('Error fetching available bids:', error);
      }
    };
    fetchBids();
  }, [filters]);

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Filter Bids</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={filters.riceVariety}
              onValueChange={(value) => setFilters({ ...filters, riceVariety: value })}
            >
              <option value="">All Rice Varieties</option>
              <option value="SAMBA">Samba</option>
              <option value="NADU">Nadu</option>
              <option value="BASMATI">Basmati</option>
            </Select>
            <Input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
            <Input
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
            <Select
              value={filters.sortBy}
              onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
            >
              <option value="date">Date</option>
              <option value="price">Price</option>
              <option value="quantity">Quantity</option>
            </Select>
            <Select
              value={filters.sortDirection}
              onValueChange={(value) => setFilters({ ...filters, sortDirection: value })}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {bids.map((bid) => (
          <BidCard key={bid.id} bid={bid} />
        ))}
        {bids.length === 0 && <p className="text-center text-gray-500">No bids available</p>}
      </div>
    </div>
  );
};

export default AvailableBids;
