// src/components/admin/bids/BidManagement.jsx
import { bidService } from '@/api/bidApi';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useEffect, useState } from 'react';

const BidManagement = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    searchTerm: '',
    dateRange: '7d'
  });

  useEffect(() => {
    fetchBids();
  }, [filters]);

  const fetchBids = async () => {
    setLoading(true);
    try {
      const data = await bidService.getAllBids(filters);
      setBids(data);
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bid) => {
    try {
      await bidService.approveBid(bid.id);
      fetchBids();
    } catch (error) {
      console.error('Error approving bid:', error);
    }
  };

  const handleReject = async (bid) => {
    try {
      await bidService.rejectBid(bid.id);
      fetchBids();
    } catch (error) {
      console.error('Error rejecting bid:', error);
    }
  };

  const columns = [
    {
      accessorKey: "id",
      header: "ID"
    },
    {
      accessorKey: "farmerName",
      header: "Farmer"
    },
    {
      accessorKey: "riceVariety",
      header: "Rice Variety"
    },
    {
      accessorKey: "quantity",
      header: "Quantity (kg)"
    },
    {
      accessorKey: "minimumPrice",
      header: "Min. Price",
      cell: ({ row }) => (
        <span>Rs. {row.original.minimumPrice.toFixed(2)}</span>
      )
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={`
          px-2 py-1 rounded text-sm
          ${row.original.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : ''}
          ${row.original.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${row.original.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
        `}>
          {row.original.status}
        </span>
      )
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedBid(row.original);
              setShowApprovalDialog(true);
            }}
            disabled={row.original.status !== 'PENDING'}
          >
            Approve
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleReject(row.original)}
            disabled={row.original.status !== 'PENDING'}
          >
            Reject
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bid Management</h1>
        <Button onClick={fetchBids}>Refresh</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Select
              value={filters.status}
              onValueChange={(value) => 
                setFilters(prev => ({ ...prev, status: value }))
              }
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="REJECTED">Rejected</option>
            </Select>

            <Select
              value={filters.dateRange}
              onValueChange={(value) => 
                setFilters(prev => ({ ...prev, dateRange: value }))
              }
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </Select>

            <Input
              placeholder="Search by ID or farmer..."
              value={filters.searchTerm}
              onChange={(e) => 
                setFilters(prev => ({ ...prev, searchTerm: e.target.value }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <DataTable
            columns={columns}
            data={bids}
            loading={loading}
          />
        </CardContent>
      </Card>

      <AlertDialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Bid</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this bid? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleApprove(selectedBid);
                setShowApprovalDialog(false);
              }}
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BidManagement;