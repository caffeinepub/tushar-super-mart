import { useState } from 'react';
import { useGetAllOrders, useUpdateOrderStatus } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { OrderStatus } from '../../backend';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function OrdersDashboardPage() {
  const { data: orders = [], isLoading } = useGetAllOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const sortedOrders = [...orders].sort((a, b) => Number(b.orderTime - a.orderTime));

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.pending:
        return <Clock className="w-4 h-4" />;
      case OrderStatus.confirmed:
        return <CheckCircle className="w-4 h-4" />;
      case OrderStatus.shipped:
        return <Truck className="w-4 h-4" />;
      case OrderStatus.delivered:
        return <Package className="w-4 h-4" />;
      case OrderStatus.cancelled:
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusVariant = (status: OrderStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case OrderStatus.pending:
        return 'secondary';
      case OrderStatus.confirmed:
      case OrderStatus.shipped:
        return 'default';
      case OrderStatus.delivered:
        return 'outline';
      case OrderStatus.cancelled:
        return 'destructive';
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        orderId,
        status: newStatus as OrderStatus,
      });
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  return (
    <div className="space-y-8">
      <Toaster />
      
      <div>
        <h1 className="text-4xl font-bold mb-2">Orders Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          {orders.length} total orders • Newest first
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      Order #{order.id}
                      <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                    </CardTitle>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Customer: {order.deliveryDetails.name}</p>
                      <p>Phone: {order.deliveryDetails.phone}</p>
                      <p>Placed: {formatDate(order.orderTime)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₹{Number(order.total) / 100}</p>
                    <p className="text-sm text-muted-foreground">{order.products.length} items</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Select
                    value={order.status}
                    onValueChange={(value) => handleStatusChange(order.id, value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={OrderStatus.pending}>Pending</SelectItem>
                      <SelectItem value={OrderStatus.confirmed}>Confirmed</SelectItem>
                      <SelectItem value={OrderStatus.shipped}>Shipped</SelectItem>
                      <SelectItem value={OrderStatus.delivered}>Delivered</SelectItem>
                      <SelectItem value={OrderStatus.cancelled}>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setExpandedOrder(expandedOrder === order.id ? null : order.id)
                    }
                  >
                    {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                  </Button>
                </div>

                {expandedOrder === order.id && (
                  <div className="pt-4 border-t space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Delivery Address</h4>
                      <p className="text-sm text-muted-foreground">
                        {order.deliveryDetails.address}
                        <br />
                        {order.deliveryDetails.city}, {order.deliveryDetails.postalCode}
                        <br />
                        Email: {order.deliveryDetails.email}
                      </p>
                      {order.deliveryDetails.deliveryInstructions && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>Instructions:</strong> {order.deliveryDetails.deliveryInstructions}
                        </p>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Order Items</h4>
                      <div className="space-y-2">
                        {order.products.map((product, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm p-2 bg-accent/20 rounded"
                          >
                            <span>{product.name}</span>
                            <span className="font-semibold">₹{Number(product.price) / 100}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

