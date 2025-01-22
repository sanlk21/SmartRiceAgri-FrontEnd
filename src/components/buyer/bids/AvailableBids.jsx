import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bidService } from '@/services/bidService';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import BidCard from './BidCard';

const RiceVariety = {
  ALL: 'ALL',
  SAMBA: 'SAMBA',
  KIRI_SAMBA: 'KIRI_SAMBA',
  NADU: 'NADU',
  KEKULU: 'KEKULU',
  RED_SAMBA: 'RED_SAMBA',
  RED_NADU: 'RED_NADU',
  SUWANDEL: 'SUWANDEL',
  KALU_HEENATI: 'KALU_HEENATI',
  PACHCHAPERUMAL: 'PACHCHAPERUMAL',
  MADATHAWALU: 'MADATHAWALU',
  KURULUTHUDA: 'KURULUTHUDA',
  RATH_SUWANDEL: 'RATH_SUWANDEL',
  HETADA_WEE: 'HETADA_WEE',
  GONABARU: 'GONABARU',
  MURUNGAKAYAN: 'MURUNGAKAYAN'
};

const AvailableBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    riceVariety: 'ALL',
    minPrice: '',
    maxPrice: '',
    location: '',
    sortBy: 'date',
    sortDirection: 'desc',
  });

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await bidService.getFilteredBids(filters);
        setBids(data);
      } catch (error) {
        console.error('Error fetching available bids:', error);
        setError('Failed to fetch bids. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, [filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
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
              <SelectTrigger>
                <SelectValue placeholder="Select Rice Variety" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(RiceVariety).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {key.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
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
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="quantity">Quantity</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.sortDirection}
              onValueChange={(value) => setFilters({ ...filters, sortDirection: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {bids.map((bid) => (
          <BidCard key={bid.id} bid={bid} />
        ))}
        {bids.length === 0 && !loading && !error && (
          <p className="text-center text-gray-500">No bids available</p>
        )}
      </div>
    </div>
  );
};

export default AvailableBids;