// src/components/admin/orders/AdminOrderManagement.jsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../../context/OrderContext';

export default function AdminOrderManagement() {
 const navigate = useNavigate();
 const { state, fetchAdminOrders } = useOrders();
 const [filteredOrders, setFilteredOrders] = useState([]);
 const [loading, setLoading] = useState(true);
 const [filters, setFilters] = useState({
   status: 'ALL',
   search: ''
 });

 useEffect(() => {
   const loadOrders = async () => {
     setLoading(true);
     try {
       await fetchAdminOrders();
     } finally {
       setLoading(false);
     }
   };
   loadOrders();
 }, []);

 useEffect(() => {
   if (!state.adminOrders) return;
   
   let result = state.adminOrders;
   
   if (filters.status !== 'ALL') {
     result = result.filter(order => order.status === filters.status);
   }
   
   if (filters.search) {
     result = result.filter(order => 
       order.orderNumber?.toLowerCase().includes(filters.search.toLowerCase()) ||
       order.buyerNic?.toLowerCase().includes(filters.search.toLowerCase()) ||
       order.farmerNic?.toLowerCase().includes(filters.search.toLowerCase())
     );
   }
   
   setFilteredOrders(result);
 }, [filters, state.adminOrders]);

 return (
   <div className="p-6 space-y-6">
     <div className="grid grid-cols-4 gap-4">
       <StatsCard title="Total Orders" value={state.statistics?.totalOrders || 0} />
       <StatsCard title="Pending Payments" value={state.statistics?.pendingPayments || 0} />
       <StatsCard title="Total Revenue" value={`Rs. ${(state.statistics?.totalRevenue || 0).toFixed(2)}`} />
       <StatsCard title="Total Quantity" value={`${(state.statistics?.totalQuantitySold || 0).toFixed(2)} kg`} />
     </div>

     <Card>
       <CardHeader>
         <div className="flex justify-between items-center">
           <CardTitle>Orders</CardTitle>
           <div className="flex gap-4">
             <Select
               value={filters.status}
               onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
             >
               <SelectTrigger className="w-[180px]">
                 <SelectValue placeholder="Filter by status" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="ALL">All Status</SelectItem>
                 <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
                 <SelectItem value="PAYMENT_COMPLETED">Completed</SelectItem>
                 <SelectItem value="CANCELLED">Cancelled</SelectItem>
               </SelectContent>
             </Select>
             <Input
               placeholder="Search orders..."
               value={filters.search}
               onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
               className="w-[250px]"
             />
           </div>
         </div>
       </CardHeader>
       <CardContent>
         {loading ? (
           <div className="text-center py-4">Loading orders...</div>
         ) : filteredOrders.length === 0 ? (
           <div className="text-center py-4">No orders found</div>
         ) : (
           <OrdersTable orders={filteredOrders} onViewDetails={(id) => navigate(`/admin/orders/${id}`)} />
         )}
       </CardContent>
     </Card>
   </div>
 );
}

function StatsCard({ title, value }) {
 return (
   <Card>
     <CardContent className="pt-4">
       <p className="text-sm text-muted-foreground">{title}</p>
       <p className="text-2xl font-bold">{value}</p>
     </CardContent>
   </Card>
 );
}

function OrdersTable({ orders, onViewDetails }) {
 return (
   <Table>
     <TableHeader>
       <TableRow>
         <TableHead>Order #</TableHead>
         <TableHead>Farmer</TableHead>
         <TableHead>Buyer</TableHead>
         <TableHead>Amount</TableHead>
         <TableHead>Status</TableHead>
         <TableHead>Actions</TableHead>
       </TableRow>
     </TableHeader>
     <TableBody>
       {orders.map(order => (
         <TableRow key={order.id}>
           <TableCell>{order.orderNumber}</TableCell>
           <TableCell>{order.farmerNic}</TableCell>
           <TableCell>{order.buyerNic}</TableCell>
           <TableCell>Rs. {order.totalAmount.toFixed(2)}</TableCell>
           <TableCell>
             <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
               {order.status}
             </span>
           </TableCell>
           <TableCell>
             <Button
               variant="outline"
               size="sm"
               onClick={() => onViewDetails(order.id)}
             >
               View Details
             </Button>
           </TableCell>
         </TableRow>
       ))}
     </TableBody>
   </Table>
 );
}

function getStatusColor(status) {
 const colors = {
   'PENDING_PAYMENT': 'bg-yellow-100 text-yellow-800',
   'PAYMENT_COMPLETED': 'bg-green-100 text-green-800',
   'CANCELLED': 'bg-red-100 text-red-800'
 };
 return colors[status] || 'bg-gray-100 text-gray-800';
}