import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bidService } from '@/services/bidService';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';

const AdminBidDashboard = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    searchTerm: '',
    dateRange: '7d'
  });

  const fetchBids = async (signal) => {
    setLoading(true);
    try {
      const data = await bidService.getAllBids({ signal, ...filters });
      setBids(data);
    } catch (error) {
      if (!signal?.aborted) {
        toast.error("Error fetching bids", {
          description: error.message || "Failed to load bids"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchBids(controller.signal);
    return () => controller.abort();
  }, [filters]);

  const columns = [
    {
      accessorKey: "id",
      header: "ID"
    },
    {
      accessorKey: "farmerNic",
      header: "Farmer NIC"
    },
    {
      accessorKey: "buyerNic",
      header: "Buyer NIC(s)",
      cell: ({ row }) => {
        const bid = row.original;
        
        // First check for a winning bid
        if (bid.status === 'COMPLETED' && bid.winningBuyerNic) {
          return (
            <div className="text-sm">
              <span className="font-medium text-green-600">
                {bid.winningBuyerNic}
              </span>
              {bid.winningBidAmount && (
                <span className="text-gray-500 ml-2">
                  (Rs. {bid.winningBidAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })})
                </span>
              )}
            </div>
          );
        }

        // Then display all active bid offers
        if (bid.bidOffers?.length > 0) {
          return (
            <div className="space-y-1">
              {bid.bidOffers.map((offer, index) => (
                <div key={index} className="text-sm">
                  <span>{offer.buyerNic}</span>
                  <span className="text-gray-500 ml-2">
                    (Rs. {offer.bidAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })})
                  </span>
                </div>
              ))}
            </div>
          );
        }

        // If no bids exist
        return <span className="text-gray-400">No bids yet</span>;
      }
    },
    {
      accessorKey: "riceVariety",
      header: "Rice Variety"
    },
    {
      accessorKey: "quantity",
      header: "Quantity (kg)",
      cell: ({ row }) => row.original.quantity.toLocaleString()
    },
    {
      accessorKey: "minimumPrice",
      header: "Min. Price",
      cell: ({ row }) => (
        <span>Rs. {row.original.minimumPrice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}</span>
      )
    },
    {
      accessorKey: "postedDate",
      header: "Posted Date",
      cell: ({ row }) => new Date(row.original.postedDate).toLocaleDateString()
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={`
          px-2 py-1 rounded text-sm font-medium
          ${row.original.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : ''}
          ${row.original.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${row.original.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
          ${row.original.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : ''}
          ${row.original.status === 'EXPIRED' ? 'bg-gray-100 text-gray-800' : ''}
        `}>
          {row.original.status}
        </span>
      )
    }
  ];

  return (
    <>
      <Toaster />
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bid Management</h1>
          <Button 
            onClick={() => fetchBids()}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Refresh'
            )}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="EXPIRED">Expired</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select
                  value={filters.dateRange}
                  onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, dateRange: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Search by ID, Farmer NIC or Buyer NIC..."
                  value={filters.searchTerm}
                  onChange={(e) => 
                    setFilters(prev => ({ ...prev, searchTerm: e.target.value }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <DataTable
              columns={columns}
              data={bids}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminBidDashboard;